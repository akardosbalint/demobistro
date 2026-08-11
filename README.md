# Zöld Sarok Vegan Bistro

Prémium növényi alapú bistro márka weboldala: publikus site, animált étlap, foglalási
rendszer és admin panel. Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion.

## Gyors indítás

```bash
npm install
npm run dev
```

Nyisd meg a [http://localhost:3000](http://localhost:3000) címet. **Supabase/Resend/Twilio/Stripe
kulcsok nélkül is elindul** — ilyenkor demo/mock adatokkal fut (lásd `src/lib/mock-data.ts`),
az e-mail/SMS küldés pedig a konzolra íródik ki. Éles használathoz másold le a `.env.example`
fájlt `.env` néven, és töltsd ki a kulcsokat.

## Tech stack

- **Next.js 14** App Router, TypeScript (strict), Tailwind CSS
- **Framer Motion** — parallax hero, scroll-reveal, staggered kártyák, layout animációk
- **Supabase** — PostgreSQL, Auth, Storage (`supabase/migrations/`)
- **Resend** / **Twilio** — tranzakciós e-mail / SMS (kulcs nélkül konzol-stub)
- **Stripe** — opcionális asztalfoglalási kaució (kulcs nélkül stub client secret)
- **react-hook-form + zod** — validáció
- **dnd-kit** — drag-and-drop sorrendezés az admin étlap kezelőben

## Struktúra

```
src/app/(site)/        publikus oldalak (/, /menu, /booking, /review/[token])
src/app/admin/          admin panel (/admin/login, /admin/*)
src/app/api/            REST route-ok (bookings, menu, admin/*, cron, payment)
src/components/         UI (ui/, menu/, booking/, home/, admin/, layout/)
src/lib/data/           adatelérési réteg — Supabase ha konfigurált, egyébként mock
src/lib/supabase/       kliens/szerver/admin Supabase kliensek
supabase/migrations/    séma + RLS policy-k + seed adatok
```

## Adatbázis

A `supabase/migrations/0001_init.sql` tartalmazza a sémát (táblák, RLS policy-k), a
`0002_seed.sql` demo adatokat tölt be. Supabase CLI-vel:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

## Cron

A `/api/cron/reminders` endpoint 24h/2h előtti emlékeztetőket és check-in utáni
review-meghívókat küld. `vercel.json` 15 percenkénti Vercel Cron-t konfigurál.
Opcionálisan védhető a `CRON_SECRET` env változóval.
