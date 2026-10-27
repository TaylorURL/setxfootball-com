<p align="center">
  <img src="src/assets/logo-192w.png" width="160" alt="SETX Football" />
</p>

<h1 align="center">SETX Football</h1>

<p align="center">Registration and shirt orders for a youth football camp in Daisetta, Texas.</p>

<p align="center"><a href="https://www.setxfootball.org">setxfootball.org</a></p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2026.44.0-e11d2a?style=for-the-badge" alt="Version 2026.44.0" />
</p>

SETX Football Camp is a free camp for kids 5 to 12 in Daisetta, in Liberty County, held over two half-days in July. There are no tryouts, and the only cost is $5 for each camp shirt. The site lets parents sign their kids up and order shirts from their phone, and gives the volunteers running the camp a staff panel for payments and the roster.

## What's on the site

- Pages about the camp, its coaches, photos from past seasons, sponsors and contact info
- A sign-up form: one entry per camper, with a shirt size for each and a running total
- Payment by CashApp after signing up. No account needed to register
- A parent dashboard to check payment status and edit a sign-up for 3 days after it's filed
- A staff panel to search the roster, group families, mark payments as paid and export to CSV

## Running it locally

```bash
npm install
cp .env.example .env
npm start
```

Fill in `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` in `.env`. The dev server runs at http://localhost:3000. The marketing pages load without them, but sign-up and sign-in need a Supabase project.

Other scripts: `npm run build`, `npm test`, `npm run lint` and `npm run format`.

## Built with

React 19, React Router 7, Create React App, Tailwind CSS, Supabase. Hosted on Vercel.

## License

Proprietary. See [LICENSE.md](LICENSE.md).

Built and maintained by [TaylorURL](https://www.taylorurl.com).
