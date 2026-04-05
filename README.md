# KineticSpeech (Migration Workspace)

This repo is organized as a monorepo:

- `client/`: React (Vite) + React Router
- `server/`: Node.js + Express REST API (PostgreSQL via `pg`)
- `db/`: SQL migrations
- `legacy/httrack/`: the raw HTTrack Squarespace snapshot (reference only)

## Quick start (after installing deps)

1. Install:
   - `npm install`
2. Run DB migrations (requires `DATABASE_URL`):
   - `npm run db:migrate`
3. Start API + client:
   - API: `npm start -w server`
   - Client: `npm run dev -w client`

