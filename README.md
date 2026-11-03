# Apex Furnishing Rwanda

Catalogue website with WhatsApp ordering and an admin dashboard.
Next.js (App Router) + TypeScript + Tailwind CSS + Supabase.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the Supabase values
npm run dev
```

## Structure

- `src/app/(public)`: public pages (home, about, shop, contact)
- `src/app/admin`: protected dashboard
- `src/components`: reusable UI grouped by feature
- `src/lib`: constants, WhatsApp builder, validation schemas, Supabase clients
- `src/services`: data access (server-side)
- `src/actions`: server actions for admin writes
- `supabase/migrations`: SQL schema and policies

## Security rules

- Only `NEXT_PUBLIC_*` variables reach the browser. The service role key stays server-side.
- Public reads and all admin writes are enforced by Row Level Security, not only by the UI.
- Business details live in one place: `src/lib/constants.ts`.

## Roadmap

1. Scaffold (done)  2. Database  3. Homepage  4. Public pages  5. Admin  6. QA  7. Deploy

## Admin dashboard

- Sign in at `/admin/login` (there is also a small "Admin" link in the website footer).
- The first administrator is created in Supabase, see `supabase/README.md`.
- Products, categories, image uploads, publishing and password change are all in the dashboard.
