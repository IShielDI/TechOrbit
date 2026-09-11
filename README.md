# TechOrbit — Campus Hackathon Launch & Member Hiring Terminal

A retro-arcade-styled single-page React site (Three.js WebGL arcade corridor, pixel-art UI,
8-bit sound FX) with an Express + Vite backend and a Stage 1 member application form.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. (Optional) Copy `.env.example` to `.env.local` and set `GOOGLE_SHEETS_WEBHOOK_URL`
   to forward applications to a Google Apps Script / Sheets webhook.
3. Start the dev server (Express + Vite middleware):
   `npm run dev`
4. Open http://localhost:3000

## Build & Run Production

```
npm run build   # vite build + bundle server into dist/server.cjs
npm start       # node dist/server.cjs (serves ./dist + same REST API)
```

## REST API

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/applications` | List submitted applications |
| POST | `/api/applications` | Create an application (`playerName`, `handle`, `email` required) |

Applications are validated, sanitized against a field whitelist, persisted to
`data/applications.json`, and optionally forwarded (non-blocking) to
`GOOGLE_SHEETS_WEBHOOK_URL` when set.

## Lint

`tsc --noEmit` → `npm run lint`

See `HANDOFF.md` for the full technical reference (request/response contract, data model,
form behavior, persistence, and known gaps).

