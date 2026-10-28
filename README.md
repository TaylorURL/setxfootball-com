<img src="src/assets/logo-192w.png" width="160" alt="SETX Football" />

# SETX Football

Registration and shirt orders for a youth football camp in Daisetta, Texas.

[setxfootball.org](https://www.setxfootball.org)

<img src="https://img.shields.io/badge/version-2026.44.4-e11d2a?style=for-the-badge" alt="Version 2026.44.4" />

A free camp for kids 5 to 12, two half-days in July. The only cost is $5 per camp shirt. Parents sign kids up from their phone with no account, one entry per camper with a shirt size each, and pay by CashApp afterward. They can check payment status and edit a sign-up for 3 days after filing it. Volunteers get a staff panel to search the roster, group families, mark payments and export CSV.

## Who can change what

The browser only has the publishable key, so row level security is the boundary, not the UI.

Signed-out visitors can file a sign-up and read nothing. Anon has an insert policy and no select grant, and the client mints the row id itself so the insert never needs to read anything back.

Families can't mark themselves paid. A policy's `WITH CHECK` only sees the new row, so it can't tell whether `payment_status` changed. A trigger compares old and new and blocks family writes to the staff and system columns. The same goes for the edit window: the dashboard hides Edit after 3 days, the update path refuses it too, and `created_at` is frozen because the window is measured from it.

Easy to miss: `is_camp_staff()` gets inlined by the planner, so the `auth.uid()` hoist has to be inside the function, not only around it, or the session gets read per row.

<details>
<summary>The build chain</summary>

It's Create React App with a `postbuild` chain:

- `prerender.js` writes each public route's first screen into its own HTML. `/auth`, `/dashboard`, `/staff` and `/payment` get the empty shell since they depend on a session. Unmatched paths go to `404.html`.
- `drop-remote-font-import.js` removes the design system's Google Fonts `@import`. Geist comes from two local subset files instead, the first one preloaded.
- `preload-hero-image.js` adds a preload for the hero photo with the same srcset and sizes as the img.
- `preload-shared-chunks.js` preloads the one chunk every route needs so it starts alongside `main.js`.
- `start-bundle-after-hero.js` holds the bundle until the hero photo has painted.

AVIF copies of the photos are made by hand with `npm run images:avif` and committed next to the WebP.

</details>

```bash
npm install
cp .env.example .env
npm start
```

Set `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` in `.env`. The marketing pages load without them, but sign-up and sign-in need a Supabase project. `npm run build`, `npm test`, `npm run lint` and `npm run format` do what they say.

React 19, React Router 7, Create React App, Tailwind CSS and Supabase, on Vercel. Proprietary, see [LICENSE.md](LICENSE.md).

Built and maintained by [TaylorURL](https://www.taylorurl.com).
