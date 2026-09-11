# TechOrbit — Backend & Application Form Technical Reference (Handoff)

> **Purpose:** A complete, self-contained handoff for anyone taking over the **TechOrbit**
> codebase — a retro-arcade-styled campus hackathon launch and Stage 1 member hiring site.
> It covers the server, the REST contract, the data model, persistence, the application form
> (expected + failure behavior), and where to look for each feature.

---

## 1. Overview

TechOrbit runs as a single process served by `server.ts`:

- In **development** (`NODE_ENV !== 'production'`), the Express server mounts Vite's
  middleware and serves the app at `http://0.0.0.0:3000`.
- In **production**, it serves the static `dist/` build plus the same REST API, with an SPA
  fallback for unknown routes.

Application submissions are:

1. Accepted by `POST /api/applications`
2. Validated server-side (required fields)
3. Sanitized against a whitelist of fields
4. Persisted to a local JSON file (`data/applications.json`)
5. Optionally forwarded, non-blocking, to a Google Sheet via an Apps Script webhook

The frontend is a single-page React app: a scroll-through Three.js arcade corridor, pixel-art
logo, 8-bit sound FX, a 7-day countdown, and the application modal.

---

## 2. Tech Stack

| Area | Technology |
|------|------------|
| Language | TypeScript ~5.8 (`tsc --noEmit` for lint) |
| Frontend framework | React 19 |
| Build / dev server | Vite 6 + `@vitejs/plugin-react` |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` |
| 3D / WebGL | `three` (0.186) |
| UI icons | `lucide-react` |
| Confetti | `canvas-confetti` |
| Animation | `motion` |
| Backend | Express 4 (dev via `tsx`; prod bundled with esbuild into `dist/server.cjs`) |
| Env loading | `dotenv` 17 (`.env.local` then `.env`; real environment always wins) |
| Declared, unused | `@google/genai` (scaffolding; no AI call implemented) |

> The earlier Firebase Google Sign-In / client-side Google Sheets utilities were **removed**;
> Sheets sync now happens server-side through the webhook only.

**Key config files:**
- `package.json` — scripts & dependencies
- `vite.config.ts` — Vite + Tailwind plugin + `@` alias + AI Studio HMR guard
- `tsconfig.json` — TS compiler options
- `server.ts` — Express API, persistence, Sheets forward, static serving
- `index.html` — HTML shell, fonts, meta tags
- `metadata.json` — AI Studio applet metadata
- `.env.example` — documented env vars

---

## 3. Getting Started / Run Commands

**Prerequisites:** Node.js

```bash
npm install          # install dependencies
npm run dev          # Express + Vite middleware -> http://0.0.0.0:3000
```

**Production**
```bash
npm run build        # vite build && esbuild server.ts -> dist/server.cjs
NODE_ENV=production npm start   # node dist/server.cjs (serves ./dist + same REST API)
```

> **Important:** the static build branch requires `NODE_ENV=production`. Running
> `npm start` alone leaves `NODE_ENV` unset, so the server boots the **Vite dev middleware**
> instead of serving `dist/`. Set the env var explicitly (`NODE_ENV=production npm start` in
> POSIX shells; on Windows cmd: `set NODE_ENV=production&& npm start`), or add `cross-env`/
> a dist-presence check if you want it automatic.

**Other scripts**
```bash
npm run lint         # tsc --noEmit (type-check only)
npm run preview      # vite preview
npm run clean        # rm -rf dist server.js (POSIX shells)
```

> Env vars are optional. Set `GOOGLE_SHEETS_WEBHOOK_URL` in `.env.local` only if you want
> server-side Sheets forwarding.

---

## 4. Project Structure

```
techorbit/
├── index.html                      # HTML shell (dark theme, fonts, og/twitter meta)
├── package.json                    # deps + scripts
├── tsconfig.json                   # TS config (ES2022, bundler resolution)
├── vite.config.ts                  # Vite + Tailwind, @ alias, HMR guard
├── server.ts                       # Express backend (API, JSON persistence, webhook)
├── metadata.json                   # AI Studio applet metadata
├── .env.example / .gitignore
├── README.md                       # Project readme
├── HANDOFF.md                      # ← this document
├── data/
│   └── applications.json           # Persisted applications (auto-created as [])
└── src/
    ├── main.tsx                    # Entry: mounts <App/> into #root
    ├── App.tsx                     # Layout, state, role definitions, modals
    ├── index.css                   # Tailwind base + CRT/neon/pixel utilities
    ├── types.ts                    # Shared types (roles, application, candidate)
    ├── vite-env.d.ts               # Vite + asset module declarations
    ├── assets/images/              # Static images (arcade mockup JPG)
    ├── components/
    │   ├── Arcade3DScene.tsx        # Full 3D WebGL corridor (Three.js)
    │   ├── ArcadeHUD.tsx            # (Currently NOT mounted — see §18)
    │   ├── ArcadeAssetViewerModal.tsx # Retro 3D assets & coin "terminal" modal
    │   ├── ApplyModal.tsx           # Application form, submit logic, pass card
    │   ├── HackathonCountdown.tsx   # 7-day countdown (full & compact variants)
    │   ├── SelectedCandidatesBoard.tsx # "Score Board" section (static roster)
    │   └── TechOrbitLogo.tsx        # Pixel-art SVG logo (defs, lettering, graphic)
    └── utils/
        ├── arcadeTextures.ts        # Procedural CanvasTexture generators (15 exports)
        └── audio.ts                 # 8-bit Web Audio synth (coin/select/hover/start/victory)
```

---

## 5. Data Model — `src/types.ts`

```ts
HackathonRoleId =
  'marketing-outreach' | 'design-content' | 'logistics-operations' |
  'technical-judging'  | 'hospitality-volunteers';
```

(Backend treats `role` as an opaque string; it is not validated against the enum server-side.)

### `MemberApplication` (the submitted payload)

| Field | Type | Source |
|---|---|---|
| `id` | `string` | Generated client-side (`TORB-…`), overwritten by the server's `id` on success. |
| `playerName` | `string` | Form → `FULL STUDENT NAME` |
| `handle` | `string` | Form → `ARCADE HANDLE / CALLSIGN` (uppercased, spaces → `_`) |
| `email` | `string` | Form → `COLLEGE EMAIL` |
| `personalEmail` | `string` | Form → `PERSONAL EMAIL` |
| `studentId` | `string` | Not a form field; defaults to `CS-<5-digit random>` client-side |
| `year` | `string` | Form → `CLASS YEAR` select (`"1" \| "2" \| "3"`) |
| `role` | `HackathonRoleId` | Pre-selected (not a user-facing control) |
| `experienceLevel` | `'Novice' \| 'Apprentice' \| 'Adept' \| 'Master'` | Hard-coded `'Apprentice'`; no UI control |
| `portfolioOrGithub` | `string` | Form → `GITHUB PROFILE` (URL) |
| `linkedin` | `string` | Form → `LINKEDIN PROFILE` (URL) |
| `motivation` | `string` | Form → `WHY JOIN TECHORBIT?` (textarea) |
| `submittedAt` | `string` | Locale date string, e.g. `Sep 11, 2026` |
| `receivedAt` | `string` | Server-assigned ISO 8601 timestamp |

### `HackathonRole` / `SelectedCandidate`

`HackathonRole` powers the Stage 1 domain cards in `App.tsx` (5 roles). `SelectedCandidate`
is defined for the future scoreboard but is currently unused (see §18).

---

## 6. REST API

### `GET /api/health`

```json
200
{
  "status": "ok",
  "timestamp": "2026-09-11T10:30:00.000Z",
  "service": "techorbit-api"
}
```

### `GET /api/applications`

```json
200
{
  "count": 3,
  "applications": [ { ...application objects... } ]
}
```

### `POST /api/applications`

**Validations (server-side)**
- `playerName`, `handle`, and `email` must be present (non-empty). If not: `400` with
  `{ "ok": false, "error": "playerName, handle and email are required." }`

**Sanitization whitelist** — only these keys are copied (as trimmed strings):

```
playerName, handle, email, personalEmail, studentId,
year, role, experienceLevel, portfolioOrGithub, linkedin, motivation
```

`submittedAt` is taken from the body if it is a string; otherwise set to the current locale
date.

**Server-assigned fields**
- `id` → `` `TORB-${Date.now()}-${4-digit random}` ``
- `receivedAt` → ISO 8601 timestamp

**Success response**

```json
201
{
  "ok": true,
  "id": "TORB-1789000000000-4321",
  "count": 4
}
```

**Internal error** → `500 { "ok": false, "error": "Failed to record application" }`

### Server bootstrap (`server.ts`)

| Item | Value |
|---|---|
| Port | `3000` |
| Host | `0.0.0.0` |
| JSON body parsing | `express.json()` enabled for all routes |
| Data directory | `<cwd>/data` |
| Applications file | `<cwd>/data/applications.json` (auto-created as `[]` if missing) |

Helper functions in `server.ts`:
- `ensureDataFile()` — creates `data/` and the JSON file if they don't exist.
- `readApplications()` — reads and parses the file, returns `[]` on any error.
- `writeApplications(apps)` — writes the array back with 2-space indentation.
- `sanitizeApplication(body)` — builds a clean object from the whitelist above.
- `forwardToSheets(app)` — non-blocking POST to the webhook; failures are logged, never thrown.

---

## 7. Application Form — `src/components/ApplyModal.tsx`

### How to open it
- The `APPLY FOR TECHORBIT CREW` button in the Stage 1 section opens the modal
  (`preselectedRole` defaults to `'marketing-outreach'` from App state).
- The Stage 2 `INSERT COIN // APPLY TO TECHORBIT` CTA opens it the same way.
- The modal renders the **pass card** (instead of the form) if a saved application exists in
  `localStorage` under `techorbit_hackathon_app`.

### Visible form fields (in order)

| # | Label | Input type | Required |
|---|---|---|---|
| 1 | ARCADE HANDLE / CALLSIGN | `text` | ✅ |
| 2 | FULL STUDENT NAME | `text` | ✅ |
| 3 | COLLEGE EMAIL | `email` | ✅ |
| 4 | CLASS YEAR | `select` → `1 (1st Year) / 2 (2nd Year) / 3 (3rd Year)` | — |
| 5 | PERSONAL EMAIL | `email` | ✅ |
| 6 | GITHUB PROFILE | `url` | ✅ |
| 7 | LINKEDIN PROFILE | `url` | ✅ |
| 8 | WHY JOIN TECHORBIT? | `textarea` (3 rows) | — |

> **Known gap (worth deciding on):** the submitted `MemberApplication` includes `role` and
> `experienceLevel`, but **neither is exposed as a form control**. `role` comes from the
> pre-selected value and `experienceLevel` is hard-coded `'Apprentice'`. If applicants should
> choose their domain, add a picker (the 5-role list already lives in `App.tsx`).

### Client-side pre-processing
- Required check: if `handle`, `playerName`, or `email` are empty, submission is aborted.
- `handle` → uppercase, spaces replaced with `_`.
- `studentId` → generated as `CS-<5-digit random>`.
- `id` → `` `TORB-${Date.now()}-${4-digit random}` `` (temporary; replaced by server id).

### Submission flow (`handleSubmit`)
1. Build the `MemberApplication` object.
2. `POST /api/applications` with `Content-Type: application/json`.
3. **On success (2xx):** overwrite `id` with the server-returned `id`, save the app to
   `localStorage['techorbit_hackathon_app']`, show the confirmation pass card, play victory
   sound, fire confetti.
4. **On failure (network error / non-2xx):** the app is **still saved to `localStorage`** and
   the pass card is still shown, but an inline error is displayed:
   *"Your application was saved on this device, but could not be sent to the club server: …"*
   This ensures a submission is never lost client-side if the server is unreachable.

### Pass card (after submission)
Shows: application ID, submission date, player handle, recruit name, assigned role (via
`ROLE_LABELS`), class year, and status `STAGE 1 CANDIDATE`. Actions: **Submit for another
role** (`handleReset` — clears the saved `localStorage` entry and resets form fields) and
**RETURN TO ARCADE** (closes the modal).

### Role label map used on the pass card

| ID | Label |
|---|---|
| `marketing-outreach` | Marketing & Outreach |
| `design-content` | Design & Content |
| `logistics-operations` | Logistics & Operations |
| `technical-judging` | Technical & Judging |
| `hospitality-volunteers` | Hospitality & Volunteers |

---

## 8. Persistence & Data Handling

- All applications are stored in `data/applications.json` as a JSON array (pretty-printed).
- `GET /api/applications` returns this array wrapped as `{ count, applications }`.
- The file is auto-created (`[]`) on server start via `ensureDataFile()`.
- Data **survives restarts** (file-backed, unlike the earlier in-memory store).
- There is **no database and no authentication**. Anyone who can reach the API can read
  (`GET`) the full list and post (`POST`) new applications. Put something in place (auth /
  a proxy / rate limiting / the Sheets webhook as the canonical store) before exposing it
  publicly.

---

## 9. Google Sheets Forwarding

When `GOOGLE_SHEETS_WEBHOOK_URL` is set, after a successful local save the server POSTs the
same sanitized object to the webhook (non-blocking; the response is not awaited and failures
are logged only). This lets you keep a live recruitment sheet:

- Not set → `[sheets] GOOGLE_SHEETS_WEBHOOK_URL not set, skipping forward.`
- On success → `[sheets] forwarded application <id>`
- On non-2xx → `[sheets] forward failed: <status> <body>`
- On network error → `[sheets] forward error: <message>`

---

## 10. Page Content & User Flow

The page is one long scroll (the 3D camera flies through the arcade corridor as you scroll).

1. **Hero (`#stage-hero`)** — pixel-art `TechOrbitLogo`, a 4-card stage breadcrumb
   (STAGE 0 / STAGE 1 / STAGE 2 / SCORE BOARD), `EXPLORE 3 STAGES` + `SCORE BOARD` CTAs.
2. **Stage 0 (`#stage-0`)** — planning & approval (approved charter narrative).
3. **Stage 1 (`#stage-1`)** — hiring terminal: `HackathonCountdown` (7-day window), the
   `APPLY FOR TECHORBIT CREW` CTA, and the **5 hackathon domain cards** (no per-card apply
   button; the single CTA above opens the modal).
4. **Stage 2 (`#stage-2`)** — execution: `CAMPUS HACKATHON ARENA` CTA block with
   `INSERT COIN // APPLY TO TECHORBIT` + `VIEW SCORE BOARD`.
5. **Score Board (`#candidates-roster`)** — `SelectedCandidatesBoard`, currently a static
   "Process Ongoing" placeholder (roster not yet published — see §18/§19).

**Modals:**
- `ApplyModal` — application form + pass card (§7).
- `ArcadeAssetViewerModal` — "RETRO 3D ASSETS & MINTED COIN TERMINAL": tabbed showcase of the
  procedurally generated 3D assets; collecting coins increments the App coin toast.

---

## 11. Hackathon Domains (in `src/App.tsx`)

All recruit 2 seats for the 24-hour campus hackathon:

| id | Title | color | Mission (deliverables) |
|----|-------|-------|------------------------|
| `marketing-outreach` | Marketing & Outreach | `#FFB800` gold | cross-college promo, social media, registration drive, sponsor shoutouts |
| `design-content` | Design & Content | `#10b981` emerald | branding, posters, certificates, sponsor deck, social creatives |
| `logistics-operations` | Logistics & Operations | `#FF8A00` orange | venue, food, power/Wi-Fi, seating, 24h coordination |
| `technical-judging` | Technical & Judging | `#FF5500` red | problem statements, tech desk, mentors/judges, rubric & rounds |
| `hospitality-volunteers` | Hospitality & Volunteers | `#22c55e` green | guest/participant reception, check-in desk, hospitality coordination, volunteer team management |

> **Where to add/change domains:** edit the `hackathonRoles` array at the top of `App.tsx`,
> `HackathonRoleId` in `src/types.ts`, and `ROLE_LABELS` in `ApplyModal.tsx`.

---

## 12. 3D Scene — `src/components/Arcade3DScene.tsx`

A Three.js scene built imperatively inside a `useEffect` on mount:

- **Scene/camera:** Perspective camera, `ACESFilmicToneMapping`, fog, ambient + directional +
  colored point lights (pink/cyan/gold).
- **Floor:** Synthwave `GridHelper` + floor plane that re-snaps in Z each frame for an
  "infinite grid" illusion.
- **Decorative cabinets:** Elevator Action and Asteroids arcade cabinets built from boxes with
  procedurally generated textures.
- **Interactive loot:** floating gold coins and pirate loot / ammo crates that are clickable
  (`Raycaster` on `window` click). Collecting plays the coin sound, increments a counter,
  calls the `onCoinCollect(count)` prop (App shows a toast), and triggers a coin jump bounce.
- **Animation loop:** scroll-driven camera path with smooth lerping, gyroscopic coin spin +
  sine bobbing + sparkle flares, starfield rotation.
- **Cleanup:** removes listeners, cancels the animation frame, detaches and disposes the
  renderer on unmount.

**Props:** `{ scrollProgress?: number; onCoinCollect?: (totalCount: number) => void }`

**Procedural textures — `src/utils/arcadeTextures.ts` (15 exports):** all textures are drawn
onto offscreen `<canvas>` elements at runtime (no image files):
`createElevatorActionMarqueeTexture`, `...SideTexture`, `...ScreenTexture`,
`createAsteroidsMarqueeTexture`, `...SideTexture`, `...ControlPanelTexture`,
`createDiamondPlateMetalTexture`, `createWoodGrainTexture`, `createCoinFaceTexture`,
`createCoinNormalTexture`, `createCoinDoorTexture`, `createPiratePlankTexture`,
`createPirateJollyRogerTexture`, `createAmmoCrateTexture`, `createAmmoCrateLidTexture`.

---

## 13. Audio — `src/utils/audio.ts`

`RetroAudioSystem` (singleton `arcadeAudio`) synthesizes 8-bit chiptune effects in real time
using the browser AudioContext + oscillators (no audio files):

- `playCoin()` — sine B5→E6 coin "ping."
- `playSelect()` — square 440→880Hz blip.
- `playHover()` — short triangle blip.
- `playStartGame()` — C-major arpeggio.
- `playVictory()` — victory fanfare (fired on successful submission).

Master `enabled` flag exists, but there is currently **no UI toggle** wired to it
(`ArcadeHUD`, which owned the sound button, is not mounted — see §18).

---

## 14. Countdown — `src/components/HackathonCountdown.tsx`

- Persists a **7-day deadline target timestamp** in `localStorage['techorbit_hiring_deadline_ts']`.
- On first ever load it sets now+7d; if a saved deadline has already passed it resets to now+7d
  (so the demo never naturally "expires").
- Two render modes: `compact` (small badge) and full (4 time-digit cards). The full variant
  is mounted in Stage 1; the compact variant is only used by the unmounted `ArcadeHUD`.

---

## 15. Pixel Logo — `src/components/TechOrbitLogo.tsx`

Pure SVG pixel-art, no image assets:
- `TechOrbitDefs` — SVG defs: 6-stripe raster gradient, 3D block shadow gradient, CRT glow
  drop-shadow filter, scanline pattern.
- `PixelStar`, `PixelArcadeGraphic` (joystick & gear), `TechOrbitRasterLettering`
  (TECHORBIT text).
- `TechOrbitLogo` (size: sm/md/lg/hero; togglable graphic/text/subtitle) and standalone
  `TechOrbitGraphic` / `TechOrbitText` exports. The hero variant is mounted in `App.tsx`.

---

## 16. State / Persistence Reference

### localStorage keys (as used in code today)

| Key | Set by | Purpose |
|-----|--------|---------|
| `techorbit_hackathon_app` | `ApplyModal.tsx` | Last submitted application (replays the pass card; cleared by "Submit for another role") |
| `techorbit_hiring_deadline_ts` | `HackathonCountdown.tsx` | 7-day countdown target timestamp |

### Removed keys (no longer referenced anywhere)

`techorbit_sheets_spreadsheet_id` (client Sheets utils deleted) and
`techorbit_sound_enabled` (sound toggle lived in the unmounted `ArcadeHUD`).

### Server-side persistence

`data/applications.json` — JSON array of applications (§8).

---

## 17. Environment Variables (`.env.example`)

Loaded with `dotenv` — real environment always wins, otherwise `.env.local` takes precedence
over `.env`.

| Variable | Used by server? | Purpose |
|---|---|---|
| `GOOGLE_SHEETS_WEBHOOK_URL` | ✅ Yes | Apps Script web app URL. If set, every application is POSTed here after being saved locally. If empty, the forward is skipped (log: `[sheets] GOOGLE_SHEETS_WEBHOOK_URL not set, skipping forward.`). |
| `GEMINI_API_KEY` | ❌ Not currently used | Declared by the AI Studio scaffolding / `metadata.json`; the server makes no Gemini API call today. |
| `APP_URL` | ❌ Not currently used | Declared for self-referential links / OAuth by scaffolding; not referenced by the current server. |

> `.env.example` is the template; copy it to `.env.local` and fill in values.

---

## 18. Known Issues / Gotchas

1. **No auth on the API.** `GET /api/applications` exposes all submissions to anyone who can
   reach the server, and `POST` is open. Add auth / a proxy / rate limiting before exposing
   publicly (§8).
2. **`role` / `experienceLevel` have no form controls.** `role` is the pre-selected value,
   `experienceLevel` is hard-coded `'Apprentice'`, and `studentId` is auto-generated. If
   applicants should pick their domain, a control must be added (§7 gap).
3. **`ArcadeHUD.tsx` is not mounted.** The component (fixed top bar with stage indicator,
   compact countdown, token counter, sound toggle, apply CTA) still exists and compiles, but
   `App.tsx` does not render or import it. Mount it in `App.tsx` or delete the file.
4. **`SelectedCandidatesBoard` is static.** The scoreboard is a "Process Ongoing" placeholder;
   publishing real selections requires new work. `SelectedCandidate` type is unused.
5. **`ArcadeAssetViewerModal` is mounted but has no opener.** `App.tsx` keeps an
   `isAssetViewerOpen` state, but no button sets it to true — the asset terminal can't be
   opened from the UI today.
6. **`npm run clean` uses `rm -rf`** (POSIX). On Windows cmd/PowerShell it needs a POSIX
   shell (Git Bash) or `rimraf`.
7. **Stale `bun.lock`.** The lockfile is from the original AI Studio template (Bun); the
   project is now developed/installed with npm (`package-lock.json`). Ignore or regenerate
   if you switch to Bun.
8. **Declared-but-unused deps.** `@google/genai` is installed but no AI call is implemented;
   `motion` is installed but the UI uses CSS animations. (The previously-listed `firebase`
   dependency was removed — no source imports it.)
9. **HMR guard in `vite.config.ts`.** `DISABLE_HMR=true` disables HMR/file-watching (AI Studio
   agent-edit guard) — leave as-is unless you know you need it.
10. **Countdown never ends.** It auto-resets to 7 days once the deadline passes (by design
    for demos).
11. **`npm start` needs `NODE_ENV=production`.** Without it, the server mounts the Vite dev
    middleware rather than serving the static build (see §3). Verified: with
    `NODE_ENV=production`, `npm run build` + `npm start` serves the built HTML, the SPA
    fallback, and the REST API correctly.

> **Verified working:** the production build path (`npm run build` + `npm start`) serves
> `./dist` with the SPA fallback correctly — `res.sendFile(path.join(distPath,'index.html'))`
> is valid Express 4 usage (absolute path). This document previously flagged that line as a
> bug; that claim was wrong and has been removed.

---

## 19. Suggested Next Steps / Roadmap

- [ ] Decide on the **`role` control**: either render a domain picker in the form or pass
      explicit pre-selected roles per CTA; decide whether `experienceLevel` should be exposed.
- [ ] Wire the **Score Board** to real, published selections (data-driven `SelectedCandidate[]`
      or a read-only view over `GET /api/applications`).
- [ ] Add **auth / rate limiting** to the API before public exposure.
- [ ] Mount or remove **`ArcadeHUD`** (sound toggle + token counter currently unreachable).
- [ ] Add an opener for **`ArcadeAssetViewerModal`** or remove it.
- [ ] Set up **`GOOGLE_SHEETS_WEBHOOK_URL`** with an Apps Script web app to keep a live
      recruitment sheet (§9).
- [ ] (Optional) Implement the declared Gemini capability with `@google/genai`.
- [ ] Harden form validation (email format, URL format) and improve error UX.
- [ ] Consider a real database (SQLite/Firestore) if `data/applications.json` is insufficient.
- [ ] Regenerate/remove stale `bun.lock`; standardize on npm.

---

## 20. Handoff Checklist Summary

- Codebase root: `c:\Users\LENOVO\Downloads\techorbit`
- Entry chain: `index.html → src/main.tsx → src/App.tsx → components`
- Backend entry: `server.ts` (Express + Vite middleware, port 3000)
- Run: `npm install && npm run dev` → http://localhost:3000
- Build/prod: `npm run build && npm start`
- Lint: `npm run lint` (type-check)
- Applications data: `data/applications.json` (auto-created)
- Where to change what: pointers in each section above.

> This document reflects the repository as of **2026-09-11** (post backend/form rework) and
> was verified against the running app: health/POST/GET endpoints, JSON persistence, webhook
> forwarding (mock), type-check, and the production build path.

---

*TechOrbit — Campus Hackathon Launch & Member Hiring Terminal. © 2025–2026*