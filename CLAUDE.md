# setxfootball-com — Agent Context

## Stack
Create React App (react-scripts 5.0.1), React 19, React Router v7, Tailwind 3.4, Supabase, Framer Motion, Recharts. Deployed on Vercel.

## Build
- Verify build before committing: `CI=true npm run build` (CRA treats warnings as errors when CI=true — same as Vercel)
- Dev server: `npm start`

## Design system
`@bradley-t-t/sunday-design-system` is vendored at `vendor/bradley-t-t-sunday-design-system-2026.24.1.tgz`.
- `package.json` references it as `"file:./vendor/bradley-t-t-sunday-design-system-2026.24.1.tgz"` — do NOT change this to an absolute local path; that path does not exist on Vercel and causes `EMISSINGTARGET` build failures
- The `vendor/` directory is committed (not gitignored) — the tarball must stay in the repo

## Branch structure
`main` (production) · `develop` (day-to-day). Work off `develop`; releases promote to `main`.
