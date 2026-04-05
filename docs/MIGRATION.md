# Squarespace (HTTrack) → React/Node/Postgres migration

## What’s preserved

The raw HTTrack export lives in:

- `legacy/httrack/`

Use this as your reference for:

- Existing URL slugs and page structure
- Titles/meta descriptions/OG tags
- Images and downloadable assets

## What’s rebuilt

- `client/`: React (Vite) + React Router (SPA)
- `server/`: Express REST API
- `db/`: plain SQL migrations (run via `server/src/db/migrate.js`)

## Suggested next steps

1. Decide canonical routes and keep them stable (match existing slugs where possible).
2. Rebuild pages in `client/src/routes/` using clean semantic HTML + modern CSS.
3. Copy/download needed images from `legacy/httrack/` into `client/public/` (self-host assets).
4. Replace Squarespace forms/booking:
   - Forms: `POST /api/forms/contact` stores into `form_submissions`
   - Booking: integrate Calendly/Acuity or implement a custom scheduler
5. Redirect legacy `*.html` paths:
   - Netlify: `client/public/_redirects`
   - Vercel: add `vercel.json` redirects when you deploy there

