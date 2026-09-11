import path from 'path';
import fs from 'fs';
import express from 'express';
import { config as loadEnv } from 'dotenv';
import type { MemberApplication } from './src/types';
import { createServer as createViteServer } from 'vite';

// Load env: real environment always wins; .env.local takes precedence over .env.
// (dotenv never overrides already-set process.env keys, so load .env.local first.)
loadEnv({ path: '.env.local' });
loadEnv();

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'applications.json');

// ── Global application deadline (single source of truth) ──────────────
// Stage 1 hiring closes Sep 18, 2026 23:59 IST (= Sep 18, 18:29 UTC).
// Keep in sync with src/deadline.ts and worker/index.ts.
export const APPLICATION_DEADLINE_ISO = '2026-09-18T18:29:00.000Z';
const APPLICATION_DEADLINE_MS = Date.parse(APPLICATION_DEADLINE_ISO);

/** Whitelist of fields copied from an incoming request body. */
const FIELD_WHITELIST: (keyof MemberApplication)[] = [
  'playerName',
  'handle',
  'email',
  'personalEmail',
  'studentId',
  'year',
  'role',
  'experienceLevel',
  'portfolioOrGithub',
  'linkedin',
  'motivation',
];

/** Creates the data directory and applications.json (as []) if they don't exist. */
function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
  }
}

/** Reads and parses the applications file; returns [] on any error. */
function readApplications(): MemberApplication[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MemberApplication[]) : [];
  } catch (err) {
    console.error('[storage] failed to read applications file:', err);
    return [];
  }
}

/** Writes the applications array back to disk (pretty-printed). */
function writeApplications(apps: MemberApplication[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2), 'utf-8');
}

/** Builds a clean application object from the request body whitelist. */
function sanitizeApplication(body: Record<string, unknown>): MemberApplication {
  const clean: Record<string, string> = {};

  for (const key of FIELD_WHITELIST) {
    const value = body[key];
    clean[key] = typeof value === 'string' ? value.trim() : '';
  }

  clean.submittedAt =
    typeof body.submittedAt === 'string' && body.submittedAt.trim()
      ? body.submittedAt
      : new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

  clean.id = `TORB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const application = {
    ...clean,
    receivedAt: new Date().toISOString(),
  } as unknown as MemberApplication;

  return application;
}

/** Non-blocking forward of a saved application to the Google Sheets webhook. */
function forwardToSheets(app: MemberApplication): void {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('[sheets] GOOGLE_SHEETS_WEBHOOK_URL not set, skipping forward.');
    return;
  }

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(app),
  })
    .then(async (res) => {
      if (res.ok) {
        console.log(`[sheets] forwarded application ${app.id}`);
      } else {
        const body = await res.text().catch(() => '');
        console.error(`[sheets] forward failed: ${res.status} ${body}`);
      }
    })
    .catch((err: unknown) => {
      console.error(`[sheets] forward error: ${err instanceof Error ? err.message : String(err)}`);
    });
}

async function startServer() {
  const app = express();

  app.use(express.json());

  ensureDataFile();

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'techorbit-api',
      applicationsOpen: Date.now() < APPLICATION_DEADLINE_MS,
      deadline: APPLICATION_DEADLINE_ISO,
    });
  });

  // List all submitted applications (backend audit)
  app.get('/api/applications', (_req, res) => {
    const applications = readApplications();
    res.json({
      count: applications.length,
      applications,
    });
  });

  // Submit application endpoint (backend handling)
  app.post('/api/applications', (req, res) => {
    try {
      // Authoritative deadline enforcement: reject late submissions.
      if (Date.now() >= APPLICATION_DEADLINE_MS) {
        res.status(410).json({
          ok: false,
          error: 'Applications are closed. The Stage 1 hiring window has ended.',
        });
        return;
      }

      const body = (req.body ?? {}) as Record<string, unknown>;

      const playerName = typeof body.playerName === 'string' ? body.playerName.trim() : '';
      const handle = typeof body.handle === 'string' ? body.handle.trim() : '';
      const email = typeof body.email === 'string' ? body.email.trim() : '';

      if (!playerName || !handle || !email) {
        res.status(400).json({
          ok: false,
          error: 'playerName, handle and email are required.',
        });
        return;
      }

      const application = sanitizeApplication(body);
      const applications = readApplications();
      applications.push(application);
      writeApplications(applications);

      console.log(
        `[Backend] New candidate application received: ${application.playerName} (${application.handle}) - ${application.role}`
      );

      // Optional, non-blocking Google Sheets sync
      forwardToSheets(application);

      res.status(201).json({
        ok: true,
        id: application.id,
        count: applications.length,
      });
    } catch (err: unknown) {
      console.error('[Backend] Error processing application:', err);
      res.status(500).json({ ok: false, error: 'Failed to record application' });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TechOrbit running on port ${PORT}`);
  });
}

startServer();