# Druporia

Portfolio and digital-product marketplace.

**Stack:** Next.js 15 (App Router) · React 18 · TypeScript · Tailwind CSS
· Prisma · Supabase (Postgres + Storage) · Clerk

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run db:push              # create tables
npm run storage:init         # create the private downloads bucket
npm run db:seed              # optional sample content
npm run dev
```

Then apply `prisma/migrations/002_fix_rls.sql` in the Supabase SQL editor
to enable row-level security. Do **not** run `001_enable_rls.sql` — it is
superseded and cannot apply. See the header of each file.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (runs `prisma generate` first) |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:push` | Push the Prisma schema to the database |
| `npm run db:studio` | Prisma Studio |
| `npm run db:seed` | Seed reviews, team, services, FAQs |
| `npm run storage:init` | Create the private Supabase downloads bucket |

## Admin access

The `ADMIN_EMAIL` environment variable grants the `ADMIN` role on first
sign-in, matched exactly against the Clerk account's primary email. If it
is unset, no admin is ever provisioned — `lib/auth.ts` logs a warning.

Admin routes are gated by a database role check in `requireAdmin()`.
**No second factor is enforced.** See the note in `lib/auth.ts` for what
adding one requires.

## Notes

- `npm run lint` requires ESLint config that this project does not yet
  have; `next lint` will offer to create it interactively.
- Payment checkout is not implemented. Free products download directly;
  paid products require a `COMPLETED` order that nothing currently creates.
