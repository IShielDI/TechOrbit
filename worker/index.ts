interface Env {
  GOOGLE_SHEETS_WEBHOOK_URL: string;
}

const REQUIRED_FIELDS = ['playerName', 'handle', 'email'] as const;

// ── Global application deadline (single source of truth) ──────────────
// Stage 1 hiring closes Sep 18, 2026 23:59 IST (= Sep 18, 18:29 UTC).
// Keep in sync with src/deadline.ts and server.ts.
const APPLICATION_DEADLINE_ISO = '2026-09-18T18:29:00.000Z';
const APPLICATION_DEADLINE_MS = Date.parse(APPLICATION_DEADLINE_ISO);

const ALLOWED_ROLES = new Set([
  'marketing-outreach',
  'design-content',
  'logistics-operations',
  'technical-judging',
  'hospitality-volunteers',
]);

const FIELD_WHITELIST = [
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
] as const;

function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

interface Application {
  id: string;
  playerName: string;
  handle: string;
  email: string;
  personalEmail: string;
  studentId: string;
  year: string;
  role: string;
  experienceLevel: string;
  portfolioOrGithub: string;
  linkedin: string;
  motivation: string;
  submittedAt: string;
  receivedAt: string;
}

function sanitizeApplication(body: Record<string, unknown>): Application {
  const application = {} as Application;

  for (const key of FIELD_WHITELIST) {
    const value = body[key];
    application[key] = typeof value === 'string' ? value.trim() : '';
  }

  if (!ALLOWED_ROLES.has(application.role)) {
    application.role = 'technical-judging';
  }

  application.submittedAt = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  application.id = `TORB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  application.receivedAt = new Date().toISOString();

  return application;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/health' && request.method === 'GET') {
      return json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'techorbit-api',
        applicationsOpen: Date.now() < APPLICATION_DEADLINE_MS,
        deadline: APPLICATION_DEADLINE_ISO,
      });
    }

    if (url.pathname === '/api/applications') {
      if (request.method !== 'POST') {
        return json({ ok: false, error: 'Method not allowed.' }, 405);
      }

      try {
        // Authoritative deadline enforcement: reject late submissions.
        if (Date.now() >= APPLICATION_DEADLINE_MS) {
          return json(
            {
              ok: false,
              error: 'Applications are closed. The Stage 1 hiring window has ended.',
            },
            410,
          );
        }

        const body = (await request.json()) as Record<string, unknown>;

        for (const field of REQUIRED_FIELDS) {
          if (typeof body[field] !== 'string' || !body[field].trim()) {
            return json(
              { ok: false, error: 'playerName, handle and email are required.' },
              400,
            );
          }
        }

        if (!env.GOOGLE_SHEETS_WEBHOOK_URL) {
          console.error('[sheets] GOOGLE_SHEETS_WEBHOOK_URL is not configured.');
          return json({ ok: false, error: 'Application service is not configured.' }, 503);
        }

        const application = sanitizeApplication(body);

        const sheetsResponse = await fetch(env.GOOGLE_SHEETS_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(application),
        });

        if (!sheetsResponse.ok) {
          const details = await sheetsResponse.text().catch(() => '');
          console.error(`[sheets] forward failed: ${sheetsResponse.status} ${details}`);
          return json(
            { ok: false, error: 'Application could not be recorded. Please try again.' },
            502,
          );
        }

        return json(
          {
            ok: true,
            id: application.id,
          },
          201,
        );
      } catch (error) {
        console.error('[api] application error:', error);
        return json({ ok: false, error: 'Failed to record application.' }, 500);
      }
    }

    return new Response('Not found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
