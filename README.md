# Meridian Dental

A full-stack demo of a premium dental practice website: a marketing homepage, a
multi-step booking engine with real-time availability, a patient portal, and an
admin/staff dashboard — all backed by a real (embedded) database.

This is a demo product built for illustrative purposes. No real appointments,
payments, emails, or SMS messages are created — everything is clearly labeled
as a demo where it matters (booking review step, payment form).

## Stack

- **Next.js (App Router) + TypeScript** — Server Components/Actions for data and mutations
- **Tailwind CSS v4** — design tokens in `src/app/globals.css`
- **Framer Motion** — page/section animation, respects `prefers-reduced-motion`
- **GSAP** available for future scroll-driven work; **React Three Fiber + drei** for the hero's subtle 3D accent
- **Prisma + SQLite** (via `@prisma/adapter-libsql`, no native build tools required)
- **Recharts** for admin analytics
- Custom lightweight auth (bcrypt + JWT session cookie, no third-party auth service)

## Getting started

```bash
npm install
npx prisma migrate dev   # creates prisma/dev.db from prisma/schema.prisma
npx prisma db seed       # seeds locations, services, doctors, ~180 patients, appointments, invoices, documents
npm run dev
```

Visit http://localhost:3000.

## Demo accounts

| Role    | Email                        | Password    |
|---------|------------------------------|-------------|
| Patient | sarah.patient@demo.com       | Demo1234!   |
| Admin   | admin@meridiandental.com     | Demo1234!   |

Both are also available as one-click "quick login" buttons on `/login`.

## Project layout

```
prisma/               schema.prisma, seed.ts
src/
  app/
    page.tsx                    marketing homepage
    booking/                    multi-step booking wizard + confirmation/[code]
    manage-appointment/         reschedule/cancel by confirmation code + email (no login required)
    login/, register/
    portal/                     patient dashboard (appointments, records, documents, billing, profile)
    admin/                      staff dashboard (overview/analytics, appointments, patients, billing, documents, settings)
    api/                        ICS calendar download, document downloads
  components/
    ui/                shared primitives (Button, Card, Modal, Toast, Table, …)
    marketing/         homepage sections
    booking/           booking wizard steps
    dashboard/          shared sidebar/topbar shell for portal + admin
    portal/, admin/     role-specific views
    charts/             Recharts wrappers
  lib/                 db.ts, auth.ts, availability.ts, validations.ts, queries/
```

## Notes on scope

- **Availability** is computed live from each doctor's working hours minus existing
  appointments (`src/lib/availability.ts`) — nothing is precomputed or faked.
- **Payments** are a mock form (Luhn-validated card number, no real gateway) that
  marks an invoice paid — there is no real payment processor involved.
- **Documents** are stored as `Bytes` blobs directly in the `Document` table (not
  local disk) and served back through an authenticated route handler — this is
  what makes uploads work on serverless hosts with no persistent filesystem.
- **Location "find nearest me"** uses the browser Geolocation API and a haversine
  distance calculation against each location's seeded lat/lng — no maps API key
  is required; map previews use a keyless Google Maps embed URL.

## Deploying (Vercel + Turso)

Local dev defaults to a SQLite file, but that doesn't work on serverless hosts
(read-only filesystem, no persistent storage). For a live deployment:

1. Create a free database at [turso.tech](https://turso.tech) and grab its
   connection URL + an auth token.
2. Set `DATABASE_URL` (both locally in `.env` and in your host's environment
   variables) to `libsql://your-db.turso.io?authToken=YOUR_TOKEN` — the token
   embedded as a query param works for both the app's runtime client and any
   one-off scripts, with nothing else to configure.
3. **Prisma's own CLI (`migrate deploy`/`db push`) cannot connect to `libsql://`
   URLs** — its schema engine only recognizes `file:` and a handful of native
   database schemes. Apply `prisma/turso-init.sql` directly against the Turso
   database instead (via the Turso dashboard's SQL Shell, or `turso db shell`)
   to create the tables.
4. Run `npx prisma db seed` locally once — since seeding goes through the
   app's own Prisma Client (the JS driver adapter), it connects to `libsql://`
   fine and works normally.
5. If the schema ever changes again: update `schema.prisma`, generate a
   migration file the usual way for the migration history, but hand-write the
   equivalent SQL and run it against Turso directly (same reason as step 3).
