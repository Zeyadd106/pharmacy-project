# Mohamed Hamed Pharmacy | صيدلية محمد حامد

Full-stack pharmacy website. Guest ordering (no customer login), admin dashboard, JSON file database (beginner-friendly, no Prisma needed).

## Features
- Guest flow: Browse → Search → Product → Cart → Checkout (name + phone + address) → Order confirmation
- 6 categories: Medicines, Health, Beauty, Medical Products, Personal Care, Baby Care
- Search by name/description/category (DB query via API)
- Favorites + cart in localStorage
- Orders saved server-side: real prices from DB, stock checked + decremented, order number `PH-YYYYMMDD-XXXX`, status PENDING
- Admin: secure login, dashboard stats + new-order badge (15s polling), orders + status flow, products, categories, stores, contact messages
- Store Locator with Google Maps embed + Get Directions
- Contact form saved to DB
- Arabic/English switcher with RTL (`lib/i18n.tsx`)
- SEO: metadata, Open Graph, sitemap, robots, 404

## Tech stack
Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React, JSON file DB (`data/db.json`).

## Installation
```bash
cd mohamed-hamed-pharmacy
npm install
cp .env.example .env.local   # then edit values
npm run dev                  # http://localhost:3000
```

## Environment variables (.env.local)
```
ADMIN_EMAIL=admin@mohamedhamed.com
ADMIN_PASSWORD=change-me-strong-password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=   # optional, see below
```

## Database (JSON, easiest way)
- File: `data/db.json` — categories, products, orders, stores, messages, sessions
- Helper: `lib/db.ts` (`readDb`/`writeDb`)
- Edit products directly in the JSON or via `/admin/products`
- Demo products are marked "Demo" — replace with real pharmacy data

## Commands
```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

## Admin
- Login: `/admin/login` (email + password from `.env.local`)
- Dashboard: `/admin/dashboard` — stats, revenue, recent orders, low stock
- Orders: `/admin/orders` — filter by status/date/name/phone/order#
- Change `.env.local` password in production. Sessions are httpOnly cookies, 12h expiry.

## Google Maps setup (Store Locator)
The locator works out of the box with keyless embed + directions links. For the full JS API:
1. Create a Google Cloud project at https://console.cloud.google.com
2. Enable "Maps JavaScript API" + "Places API"
3. Create an API key (APIs & Services → Credentials)
4. Restrict it: HTTP referrers → your domain (e.g. `*.vercel.app/*`), API restrictions → Maps JavaScript API only
5. Put it in `.env.local` as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...` and in Vercel env vars

Never commit real keys. Never hardcode keys in source.

## Vercel deployment
Note: JSON DB writes work locally; on Vercel's read-only filesystem use Vercel KV/Postgres adapter later, or keep JSON for catalog + connect orders to a real DB.
1. Push to GitHub
2. Import in Vercel, set root to `mohamed-hamed-pharmacy`
3. Add env vars: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`
4. Deploy → `npm run build` must pass

## Troubleshooting
- `npm run build` fails: run `npm install` first, check Node 20+
- Admin 401: check `.env.local` credentials, restart dev server after editing env
- Cart empty after order: expected — cart clears on success
- Images: products use icon placeholders; set `image` URL in admin/JSON to use real photos with `next/image`

## Medical safety
Demo data only. Prescription items are flagged `requiresPrescription` and show a verification notice. Always enforce pharmacist verification before dispensing.
