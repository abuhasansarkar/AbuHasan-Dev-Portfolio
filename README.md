# AbuHasan · Portfolio

Premium, animated, single-page portfolio for **AbuHasan** – Full-Stack Web Developer · WordPress Developer · UI/UX Designer.

Built as a real, deployable application: dynamic portfolio, blog, testimonials and services managed from a secure admin dashboard, contact submissions stored in PostgreSQL, complete SEO, GSAP + Three.js hero experience.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, Server Actions), TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui primitives, CSS variable color system (dark-first, light mode supported) |
| Animation | GSAP + ScrollTrigger, Framer Motion (layout/overlay transitions only) |
| 3D | Three.js via React Three Fiber + drei |
| Database | PostgreSQL + Prisma ORM |
| Auth | bcrypt password hashing, signed HTTP-only session cookie (jose), Edge middleware route protection, login rate limiting |
| Icons | Lucide |
| Media & Uploads | ImageKit.io (primary CDN, real-time optimization & transforms) / Vercel Blob / local fallback |

---

## Local development

### 1. Requirements

- Node.js **20.9+**
- Docker (for the local Postgres) **or** any PostgreSQL 14+ connection string

### 2. Install

```bash
git clone https://gitlab.com/abuhasan-dev/portfolio.git
cd portfolio
npm install
cp .env.example .env
```

Open `.env` and set `AUTH_SECRET` (e.g. `openssl rand -base64 32`).

### 3. Database

```bash
docker compose up -d        # starts Postgres on localhost:5432
npm run db:migrate          # creates the schema (prompts for a migration name on first run)
npm run db:seed             # seeds admin, projects, posts, services, testimonials, settings
```

### 4. Run

```bash
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin

### Demo admin login (development only)

```
Email:    admin@example.com
Password: ChangeThisImmediately123!
```

These values come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` and are only used to create the **first** admin account. **Change them before any production deployment.** The password is never stored in plain text; the seed script and the first-login bootstrap hash it with bcrypt.

---

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Generate Prisma client + production build |
| `npm run start` | Serve production build |
| `npm run lint` / `npm run typecheck` | Quality checks |
| `npm run db:migrate` | Create/apply migrations in development |
| `npm run db:deploy` | Apply migrations in production |
| `npm run db:seed` | Seed demo content (idempotent; preserves admin edits) |
| `npm run db:reset` | Drop, re-migrate and re-seed (destructive) |
| `npm run db:studio` | Prisma Studio |

---

## Environment variables

See [`.env.example`](.env.example) for the full annotated list.

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `AUTH_SECRET` | yes | 32+ char secret used to sign admin sessions |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | first run | Bootstrap admin account (hashed on creation) |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical URL used for metadata, sitemap, OG tags |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | no | Google Analytics 4 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | no | Search Console verification token |
| `NEXT_PUBLIC_META_PIXEL_ID` | no | Meta Pixel |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | yes | ImageKit endpoint URL (e.g. `https://ik.imagekit.io/<id>`) |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | yes | ImageKit Public API key |
| `IMAGEKIT_PRIVATE_KEY` | yes | ImageKit Private API key for server upload signatures & media API |
| `IMAGEKIT_ID` | no | ImageKit account identifier |
| `IMAGEKIT_FOLDER_NAME` | no | ImageKit upload folder name (default: `Developer-Portfolio`) |
| `IMAGEKIT_FOLDER_ID` | no | ImageKit folder ID |
| `BLOB_READ_WRITE_TOKEN` | no | Enables Vercel Blob uploads as fallback |

No credentials or tracking IDs are hardcoded anywhere in the codebase.

---

## Production deployment

### Vercel (recommended)

1. Create a PostgreSQL database (Neon, Supabase, Vercel Postgres, Railway).
2. Import the repository into Vercel.
3. Add all environment variables from the table above. Use a **new** `ADMIN_EMAIL` / strong `ADMIN_PASSWORD` and a fresh `AUTH_SECRET`.
4. Set the build command to `npm run build` (default) and add a post-deploy step or run once locally against the production DB:

   ```bash
   DATABASE_URL="<prod url>" npm run db:deploy
   DATABASE_URL="<prod url>" ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run db:seed
   ```

5. Optionally create a Vercel Blob store and set `BLOB_READ_WRITE_TOKEN` for image uploads.
6. Deploy. Verify `/robots.txt`, `/sitemap.xml`, and `/admin/login`.

### Any Node host (Docker, VPS, Railway, Render)

```bash
npm ci
npm run build
npm run db:deploy
npm run start
```

Serve behind HTTPS; session cookies are marked `Secure` in production.

### Security checklist before going live

- [ ] Replaced demo `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- [ ] Generated a unique `AUTH_SECRET`
- [ ] `NEXT_PUBLIC_SITE_URL` points at the real domain (HTTPS)
- [ ] Replaced demo testimonials, projects and posts (each is flagged `isDemo` in the admin)
- [ ] Reviewed `/admin › Site Settings` copy, social links and SEO metadata

---

## Project structure

```
prisma/                 schema, migrations, seed script and seed data
public/demo/            replaceable demo mockup images
src/app/                App Router routes (site, /admin, API, sitemap, robots)
src/components/
  layout/ navigation/ hero/ about/ services/ portfolio/ case-study/
  process/ testimonials/ blog/ contact/ footer/ animations/ three/ admin/ ui/
src/lib/                db, auth, env, settings schema, validation, utilities
src/hooks/              reusable client hooks (GSAP, media queries, reduced motion)
```

---

## Content notes

- All seeded projects, blog posts and testimonials are **demo/placeholder content** marked with `isDemo: true`. Replace them from `/admin` before publishing.
- Demo mockup images live in `public/demo/` and are referenced by URL, so any project or post image can be swapped from the admin without code changes.
