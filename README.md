<p align="center">
  <img src="src/assets/logo.PNG" width="200" alt="SETX Football" />
</p>

<h1 align="center">SETX Football</h1>

<p align="center">
  <b>Registration and shirt-order management for SETX Football Camp.</b>
</p>
<p align="center">
  A youth football camp in Southeast Texas — parents sign up and pay by CashApp,<br />
  staff verify and manage the roster. Live at <a href="https://setxfootball.com">setxfootball.com</a>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-e11d2a?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/React_Router-7-e11d2a?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router 7" />
  <img src="https://img.shields.io/badge/CRA-react--scripts_5-e11d2a?style=for-the-badge&logo=createreactapp&logoColor=white" alt="Create React App" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-e11d2a?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Postgres-e11d2a?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vercel-deployed-e11d2a?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<br />

## Why SETX Football

A youth camp registration needs to be effortless for a parent on a phone and airtight for the volunteer staff running check-in. This is the whole camp online: a public marketing site, a no-account-needed registration and shirt-order flow that collects payment over CashApp, and a role-gated staff panel that verifies each payment and manages the roster — all backed by Supabase with row-level security so parents only ever see their own registrations.

<table width="100%">
  <tr>
    <td width="33%" valign="top">
      <h3 align="center">Register &amp; pay</h3>
      <p align="center">A multi-shirt order form with a live $5-per-shirt total, then CashApp payment to <code>$SETXYFC</code> — no account required to start.</p>
    </td>
    <td width="33%" valign="top">
      <h3 align="center">Parent dashboard</h3>
      <p align="center">Signed-in parents track payment status and edit their registration inside a 3-day window with a live days-remaining countdown.</p>
    </td>
    <td width="33%" valign="top">
      <h3 align="center">Staff panel</h3>
      <p align="center">A role-gated roster with search, family grouping, revenue KPIs, one-toggle payment verification, and CSV export.</p>
    </td>
  </tr>
</table>

<br />

## Stack

| Layer        | Technology                                                              |
| :----------- | :--------------------------------------------------------------------- |
| Framework    | React 19 + React Router 7 on Create React App (`react-scripts` 5)      |
| Styling      | Tailwind CSS 3.4 + vendored `@bradley-t-t/sunday-design-system`        |
| UI / SEO     | `framer-motion` · `lucide-react` · `recharts` · `react-helmet-async`   |
| Backend      | Supabase — PostgreSQL, Auth, Row-Level Security                        |
| Data access  | `AuthService` + `RegistrationService` returning `{ data, error }` tuples |
| Hosting      | Vercel                                                                 |

The design system ships as a committed tarball under `vendor/` and is referenced from `package.json` as `file:./vendor/…tgz`, so installs and Vercel builds resolve it without a registry.

## Getting started

```bash
npm install          # design system is vendored, so this resolves offline
npm start            # dev server at localhost:3000
npm test             # react-scripts / Jest in watch mode
CI=true npm run build   # production build gate — see below
```

Create a `.env` with the Supabase credentials — the client throws on startup if either is missing:

| Variable                      | Required | Purpose                              |
| :---------------------------- | :------- | :----------------------------------- |
| `REACT_APP_SUPABASE_URL`      | always   | Supabase project URL.                |
| `REACT_APP_SUPABASE_ANON_KEY` | always   | Supabase anonymous (public) API key. |

Always gate the build with `CI=true` — Create React App treats warnings as errors under CI, matching Vercel. A plain `npm run build` can pass locally and still fail the deploy.

## Routes

| Path         | Page        | Access          |
| :----------- | :---------- | :-------------- |
| `/`          | Home        | public          |
| `/about`     | About       | public          |
| `/gallery`   | Gallery     | public          |
| `/sponsors`  | Sponsors    | public          |
| `/register`  | Register    | public          |
| `/payment`   | Payment     | public          |
| `/auth`      | Sign in / up | public         |
| `/dashboard` | Dashboard   | signed-in       |
| `/staff`     | Staff panel | staff / admin   |
| `/privacy` · `/terms` · `/design` | Legal / design | public |

## How it works

- **No component touches Supabase directly.** Every read and write flows through `AuthService` and `RegistrationService`, which return `{ data, error }` tuples; `library/supabaseClient.js` is the single client.
- **Registration lands as `pending`.** A parent fills the form, the row is written to `camp_registrations`, and the app forwards to the payment page with CashApp instructions for the `$SETXYFC` handle.
- **Accounts reconcile by email.** Creating an account (with email verification) lets a parent return to a dashboard that finds their registrations by `parent_email` and exposes an inline edit form for `EDIT_WINDOW_DAYS` (3) after creation.
- **Staff work the same table.** A role-gated panel filters by camp year and payment status, groups family registrations, surfaces live revenue KPIs, flips payment `pending` ↔ `paid`, and exports the filtered rows to CSV.
- **Roles live in `user_profiles`.** `AuthContext` exposes the user, profile, and `isStaff` / `isAdmin` flags; `ProtectedRoute` gates `/dashboard` and `/staff`.

## Security & data access

- **Row-Level Security** — policies in [`supabase_schema.sql`](supabase_schema.sql) scope `camp_registrations` and `user_profiles` to their owner, with staff/admin read-and-update policies keyed off `user_profiles.role`.
- **Service boundary** — only `AuthService` and `RegistrationService` import the Supabase client; update and delete queries constrain by both record ID and user ID.
- **No credential fallbacks** — Supabase config comes only from env vars, and CSV export escapes formula triggers to prevent injection.

## Project structure

```
src/
  app/          App.jsx — client-side routes
  pages/        Home, About, Gallery, Sponsors, Register, Auth, Dashboard,
                StaffPanel, Payment, Privacy, Terms, Design
  components/   nav, footer, marketing sections, routing, seo, brand, layout
  context/      AuthContext.jsx — session state + role flags
  services/     AuthService.js, RegistrationService.js — Supabase access
  hooks/        useStaffRegistrations, useScrollReveal, useCountUp, …
  utils/        constants, helpers, csv, shirtOrders, registrationGrouping
  library/      supabaseClient.js, sunday-analyzer/ (analytics)
  content/      campContent.js
  assets/       logo.PNG, images/
vendor/         bradley-t-t-sunday-design-system-*.tgz (committed)
public/         index.html, sitemap, manifest, favicons, sponsors/
supabase_schema.sql
```

## License

Proprietary — Copyright (c) 2026 Trenton Taylor. All rights reserved. See [LICENSE.md](LICENSE.md).

<br />

<p align="center">
  <sub>Sign up, pay, and hit the field — SETX Football Camp.</sub>
</p>
