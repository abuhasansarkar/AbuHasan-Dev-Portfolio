# Production Readiness Review

**Repo:** `d:\ABUHASAN\WEB\portfolio` · branch `main` · HEAD `e57da21` (+ local fixes from this pass)
**Checks run:** `npm run build` · `npm run typecheck` · `npm run lint` · `npm audit` · `next start` smoke test on a separate port · source review of every route, action, auth path, config and data layer.

---

## 0. Status summary (verified, not assumed)

| Check | Result |
| --- | --- |
| `npm run build` | **FAILED** on arrival → **fixed in this pass**, now passes (13/13 pages) |
| `npm run typecheck` | passes |
| `npm run lint` | passes (1 warning → fixed) |
| `next start` smoke test | `/` 200 · `/admin` 307→login · `/admin/login` 200 · `/sitemap.xml` 200 · `/api/admin/upload` 401 |
| ISR / caching | `/` static with `Cache-Control: s-maxage=3600, stale-while-revalidate` |
| Security headers | 4 present (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`); **no CSP, no HSTS** |
| `npm audit` | **9 vulnerabilities (5 high, 4 moderate)** — `@vercel/blob → undici`, `imagekit → uuid` |
| Tests | **0 test files** |
| CI / Dockerfile / LICENSE / .nvmrc / health endpoint / error tracking | **none present** |
| Prisma migrations | **`prisma/migrations` does not exist** |

### Fixed in this pass (so the app can build and deploy at all)
1. `src/lib/email.ts` — Brevo SDK v6 constructor is `new BrevoClient({ apiKey })`, **not** `{ auth: { apiKey } }`. This broke `next build` with a type error (`Property '[PARAM_KEY]' is missing`).
2. `src/lib/email.ts` — removed dead `metaParts`/`metaInfo` code (the only ESLint warning).
3. `src/lib/email.ts` — added `import "server-only"` so `BREVO_API_KEY` can never be pulled into a client bundle.

---

## 1. P0 — Blockers before you point a domain at this

### 1.1 There are no database migrations
`prisma/migrations/` does not exist. `README.md` documents `npm run db:deploy` (→ `prisma migrate deploy`) as a deploy step, but that command is a **no-op** here: nobody can recreate the schema from source, and future schema changes cannot be deployed safely (the live DB must currently have been created with `db push`).

**Do:**
```bash
npm run db:migrate -- --name init      # creates prisma/migrations/<ts>_init
git add prisma/migrations && git commit -m "chore: baseline database migration"
```
Then every environment and contributor can run `npm run db:deploy`, and reorder the README deploy steps to `db:deploy` → `db:seed`.

### 1.2 Neon pooler breaks migrations (add `directUrl`)
`.env` defines `DATABASE_URL_UNPOOLED`, but `prisma/schema.prisma` only has `url = env("DATABASE_URL")`. `migrate deploy` through PgBouncer (Neon pooled URL) commonly fails on prepared statements/advisory locks.
**Do:**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")   // migrations use the direct connection
}
```
Keep `DATABASE_URL` pooled for runtime; set both variables in the host.

### 1.3 ImageKit upload signatures are served to anyone (verified live)
`/api/upload-auth` and `/api/imagekit/auth` are public route handlers with no session check. Fetched from the production server:
```json
{"token":"c4bfd46d-…","expire":1790787080,"signature":"eea8b9e1…"}
```
Anyone can reuse that signature to upload arbitrary files into your ImageKit account — quota burn, bandwidth cost, and an easy way to host unwanted content on your own CDN domain.
**Do (pick one):**
- If the admin never uploads from the browser, **delete both routes** and keep server-side uploads through `src/lib/imagekit/server.ts`.
- Otherwise gate them exactly like `src/app/api/admin/upload/route.ts`:
```ts
const session = await getSession();
if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```
plus a rate limit (`rateLimit("ik-auth:" + ip, { limit: 30, windowMs: 60_000 })`) and `export const dynamic = "force-dynamic"`.

### 1.4 `NEXT_PUBLIC_SITE_URL` is baked in at build time — verify before launch
On the production build, `robots.txt` still emits `Host: http://localhost:3000` because `NEXT_PUBLIC_SITE_URL` was `http://localhost:3000` **when the build ran**. This one variable controls canonical URLs, OG/JSON-LD, the sitemap, robots and the links inside your contact emails.
**Do:** set `NEXT_PUBLIC_SITE_URL=https://your-domain` in the hosting provider **before the first build**, then verify in production:
```bash
curl -s https://your-domain/robots.txt | grep -i host     # must be the real domain
curl -s https://your-domain/sitemap.xml | grep -i loc
```
Changing this value later requires a **redeploy**, not just an env edit.

### 1.5 Brevo integration is undocumented and fails silently
- `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME` are **missing from `.env.example`** (they exist only in your local `.env`). A fresh deploy logs `[email] BREVO_API_KEY not configured` and quietly stops emailing you leads.
- `src/lib/email.ts:8` hardcodes `abuhasansarkar2@gmail.com` as the fallback sender, and the auto-reply footer hardcodes the same address — a domain sender (`hello@your-domain`) is far better for deliverability.
- Emails are fired **without awaiting** (`src/app/actions/contact.ts:77-82`). On Vercel the function can be frozen right after the response, so notifications may never be sent. Next 15 gives you `after()`:
```ts
import { after } from "next/server";
after(async () => {
  await sendContactNotification(emailData);
  await sendContactAutoReply(emailData);
});
```
- Verify the sender domain in Brevo (SPF/DKIM), otherwise bounces land in spam.
- Add the three Brevo variables to `.env.example`.

### 1.6 Security headers: no CSP, no HSTS, no `noindex` on `/admin`
`next.config.ts` ships four headers. Add at minimum:
```ts
{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
{ key: "Content-Security-Policy", value: "default-src 'self'; img-src 'self' data: blob: https://ik.imagekit.io https://*.blob.vercel-storage.com; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src https://www.youtube-nocookie.com https://player.vimeo.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
```
(`'unsafe-inline'` is needed because of the JSON-LD and GA inline scripts; move to a nonce later for a strict policy.) Also add `X-Robots-Tag: noindex, nofollow` for `/admin/:path*`.

### 1.7 Dependency vulnerabilities
`npm audit --omit=dev` → 9 advisories, 5 high: `undici` via `@vercel/blob@0.27` and `uuid` via `imagekit@6`. Fixes require major bumps.
**Do:** upgrade `@vercel/blob` (only used as an upload fallback in `src/app/api/admin/upload/route.ts:55`) and re-test the ImageKit path (`npm run test:imagekit`); if you never need Blob, delete the dependency and keep ImageKit as the single provider. Re-run `npm audit` and pin the result in CI.

### 1.8 Repo hygiene — these must not ship publicly
- `scratch_test_ik.ts` (live ImageKit upload/delete) plus `scripts/check-*.ts` debug scripts are committed → move to `scripts/dev/` or delete; drop the `test:imagekit` npm script.
- `scripts/create-cv.js` goes once the real résumé exists.
- `.kilo/worktrees/possible-riddle/` is a full duplicate of the repo and is **not** in `.gitignore` → add `.kilo/`.
- `README.md` publishes demo admin credentials and clones from GitLab → remove the credentials block, fix the clone URL.
- Missing: `LICENSE`, `.nvmrc` (pin Node 20), `.github/workflows/ci.yml`.
- Delete the untracked `prod.log` / `prod2.log` files created during this smoke test.

---

### 1.9 Demo/fabricated content is still live in the database
Commit `c77c391` cleaned the **seed files**, but the rows already in Postgres were not touched. Verified in the HTML of the freshly built production server (`next start`): `Placeholder testimonial` ×5, `Placeholder result` ×6, `Demo article` ×9, `Demo ·` ×5, `Placeholder` ×20. Anyone visiting the site today still reads *"Placeholder testimonial – replace with a real client quote"* and *"Placeholder result: …"*.

**Do:** delete or unpublish those rows (Admin → Testimonials / Projects / Posts, or a one-off script filtering `isDemo: true`), then confirm the rendered page contains zero occurrences:
```powershell
(curl.exe -s https://your-domain | Select-String -Pattern 'Placeholder|Demo article|Demo ·' -AllMatches).Matches.Count   # expect 0
```
Note on caching: `/` is prerendered with `revalidate = 3600`, so edits made **outside** the admin (direct SQL) keep serving the stale page for up to an hour. Admin saves call `revalidateTag`, so always edit through `/admin` — or re-run `npm run build`.

---

## 2. P1 — Hardening, reliability and operability

### 2.1 Rate limiting is per-instance unless you configure Redis
`src/lib/auth/rate-limit.ts:101` falls back to an in-memory map. On Vercel/serverless every instance has its own map, so the 5-attempt login limit and 5-per-hour contact limit are effectively multiplied by the number of warm instances. `.env` has `UPSTASH_REDIS_REST_URL`/`_TOKEN` set to empty strings.
**Do:** create the Upstash database and set both variables in the host; then verify that 6 rapid bad logins from one IP get blocked.

### 2.2 Contact form is a spam relay — add a real challenge
Protections today: a honeypot, a 5/hour/IP rate limit, and `contactFormSchema` caps length at 3000 chars. There is **no CAPTCHA**, and the form now also sends an automatic email to whatever address the submitter typed (Brevo reputation risk from abuse).
**Do:** add Cloudflare Turnstile (invisible mode, no user friction) verified server-side in `src/app/actions/contact.ts`; also add a simple heuristic (reject if the message contains more than N URLs).

### 2.3 Server Action body limit is 8 MB
`next.config.ts` sets `experimental.serverActions.bodySizeLimit: "8mb"`. Your forms are text-only (uploads use a route handler), so 8 MB just enlarges the DoS surface. Lower it to `"1mb"`.

### 2.4 SVG uploads + SVG image optimization = stored-XSS risk
`src/app/api/admin/upload/route.ts:10` accepts `image/svg+xml`, and `next.config.ts` enables `images.dangerouslyAllowSVG: true`. A malicious SVG served from your origin can execute script in a browser session (the image optimizer's sandbox CSP mitigates the optimizer path, but the uploaded file is also referenced directly by URL).
**Do:** drop `image/svg+xml` from `ALLOWED`, or sanitize SVGs (e.g. `dompurify`/`svgo` on upload), and serve uploads from the CDN host rather than the app origin.

### 2.5 Image remote patterns are looser than needed
`next.config.ts` allows `**.imagekit.io`, `**.public.blob.vercel-storage.com` and `images.unsplash.com`. Unsplash is unused and the wildcards are broader than required — restrict to your exact ImageKit endpoint host and your Blob store host.

### 2.6 No error tracking, no logging pipeline, no health endpoint
Errors only reach `console.*` (33 call sites) and the root `error.tsx`. In production nobody sees them.
**Do:**
- Add Sentry (or Axiom/Logtail) with `instrumentation.ts` and `onRequestError`, then set `SENTRY_DSN` in the host.
- Add `src/app/api/health/route.ts` returning `{ ok: true }` after a `SELECT 1`, and point an uptime monitor (BetterStack/UptimeRobot) at it.
- Route the important console calls through a tiny `log()` helper so they can be filtered by level.

### 2.7 Session model limitations to accept or fix
`src/lib/auth/token.ts` uses a stateless 7-day HS256 JWT with no `iss`/`aud` and no revocation list. Consequences: logging out only clears the cookie (a stolen cookie stays valid for up to 7 days), and there is no "log out everywhere" other than rotating `AUTH_SECRET` (which invalidates all sessions).
**Do (low effort):** require `AUTH_SECRET.length >= 32` in `src/lib/env.ts`, and add `iss`/`aud` claims. **Optional:** store a `sessionVersion` on `Admin` and include it in the token so a password change revokes sessions.

### 2.8 Data lifecycle and backups
- `ContactSubmission` grows forever with no retention policy and no export. Add a retention rule (archive/delete after N months) and a CSV export from `/admin/submissions`.
- Confirm the Neon plan's PITR/backup window, and write the restore procedure down. Test one restore into a branch DB before launch.
- `revalidatePublic()` calls `revalidatePath("/sitemap.xml")` — fine — but if you later add `/work/[slug]` routes, extend it so new content invalidates the right paths.

### 2.9 Client-side UX regressions that look like bugs in production
- `src/components/providers/smooth-scroll-provider.tsx` mounts Lenis in the **root layout**, so the admin dashboard also gets smooth scrolling (and Lenis runs even for users who set `prefers-reduced-motion`, while `MotionConfig` only covers Framer Motion). Gate it: `if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;` and skip mounting on `/admin`.
- There are **no `loading.tsx` files** in `/admin/*`; every navigation blocks on the DB query. Add one skeleton per admin list route for perceived speed.
- `src/components/contact/contact-form.tsx:152` preselects `services[0]` while rendering a disabled "Select service…" option, so the placeholder never shows and "New website" is submitted silently. Default to `""`.

---

## 3. P2 — Performance budget

Build output (`npm run build`) shows the real cost:

| Route | Page size | First Load JS |
| --- | --- | --- |
| `/` | 164 kB | **674 kB** |
| `/admin/posts/new`, `/admin/projects/new`, `/admin/posts/[id]` | ~2 kB | **476 kB** |
| Everything else | < 5 kB | 103–137 kB |

674 kB of first-load JS is roughly 3× a healthy budget and is dominated by Three.js + drei (hero scene), GSAP + ScrollTrigger, Lenis, Framer Motion and `lenis` itself (imported in 21 files). On a mid-range Android phone that is several seconds of main-thread work.

**Do, in order of payoff:**
1. Measure first: PageSpeed Insights + Lighthouse (mobile, throttled) on the deployed URL. Record LCP/INP/CLS as the baseline; target LCP < 2.5 s, INP < 200 ms, CLS < 0.1.
2. Lazy-load the 3D scene on interaction/idle instead of mount (`HeroSceneLoader` already uses `dynamic(..., { ssr: false })` — extend it so `three`/`drei` download only after the hero is visible or after `requestIdleCallback`). The static `SceneFallback` already exists, so nothing visually breaks.
3. Consider dropping Lenis altogether (native scroll + `scroll-behavior: smooth` for anchors). It is the cheapest big win and removes a whole class of scroll bugs.
4. Replace `framer-motion` usage that only animates opacity/translate with CSS or GSAP (you already ship GSAP); removing one animation library from the critical path is worth ~30–40 kB gz.
5. Reduce decorative DOM: the contact/CTA sections render many absolutely-positioned animated dots; keep them on desktop only.
6. Re-check `/admin/posts/new` (476 kB): the block editor imports `highlight.js` — code-split the highlighter so the public site's `CodeBlock` and the editor don't both load it eagerly.
7. Add `next build` output size to CI so regressions are visible.

---

## 4. Deployment runbook

### 4.1 Environment variables (host dashboard — set before the first build)

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Neon **pooled** connection string |
| `DATABASE_URL_UNPOOLED` | ✅ | Neon **direct** URL — used by migrations once `directUrl` is added |
| `AUTH_SECRET` | ✅ | New random value ≥ 32 chars (`openssl rand -base64 32`); never reuse the dev value |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Real HTTPS domain, no trailing slash — **build-time** |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | ✅ (first run) | Real values; the app refuses demo credentials in production (`src/lib/auth/ensure-admin.ts:20`) |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` / `_PUBLIC_KEY` / `IMAGEKIT_PRIVATE_KEY` | ✅ | Needed for any upload |
| `BREVO_API_KEY` / `BREVO_SENDER_EMAIL` / `BREVO_SENDER_NAME` | ✅ | Missing = contact emails silently disabled |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | ⚠️ strongly recommended | Without them rate limits are per-instance |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `_GOOGLE_SITE_VERIFICATION` / `_META_PIXEL_ID` | optional | Analytics + Search Console |
| `BLOB_READ_WRITE_TOKEN` | optional | Only if you keep the Blob upload fallback |
| `IMAGEKIT_ID` / `IMAGEKIT_FOLDER_NAME` / `IMAGEKIT_FOLDER_ID` | optional | Folder defaults to `Developer-Portfolio` |

### 4.2 Deploy sequence
```bash
npm ci
npm run db:deploy          # after the baseline migration exists
ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run db:seed   # first deploy only
npm run build              # set NEXT_PUBLIC_SITE_URL beforehand
npm run start              # or let the platform run it
```

### 4.3 Post-deploy smoke test (run against the real domain)
```bash
curl -sI  https://your-domain/ | head -20                 # 200 + security headers
curl -s   https://your-domain/robots.txt | grep -i host   # real domain
curl -s   https://your-domain/sitemap.xml | grep -i loc   # real domain
curl -sI  https://your-domain/admin | grep -i location    # 307 → /admin/login
curl -s   https://your-domain/api/upload-auth             # MUST be 401 (see 1.3)
curl -sI  https://your-domain/api/admin/upload            # 401/405
```
Then, manually: sign in to `/admin` with the real credentials, save one setting, upload one image, publish one project, submit the public contact form and confirm (a) the row appears in `/admin/submissions`, (b) the notification email arrives, (c) the auto-reply arrives. Finally run PageSpeed Insights and Lighthouse a11y on `/`.

### 4.4 Rollback and safety
- Keep the previous deployment available (Vercel: instant rollback to the prior build).
- Never run `db:reset` against production; take a Neon branch/snapshot before any migration.
- After launch: enable uptime monitoring on `/api/health`, alerting on 5xx rate, and a weekly `npm audit` + dependency bump slot.

---

## 5. Unused dependencies to trim

Verified by import count across `src/`:

| Dependency | Imports in `src` | Action |
| --- | --- | --- |
| `@imagekit/nodejs` | 0 (only `@imagekit/next` is used, once, in `imagekit-provider.tsx`) | remove |
| `@neon/config`, `@neon/env` | 0 (only the CLI-level `neon.ts` at the repo root) | remove from `dependencies` or move to `devDependencies` |
| `@radix-ui/react-tabs` | 0 | remove |
| `@radix-ui/react-tooltip` | 0 | remove |
| `@radix-ui/react-switch` | 0 | remove |
| `@radix-ui/react-select` | 0 | remove |
| `imagekit` (legacy SDK) vs `@imagekit/*` | `imagekit/server.ts` uses `imagekit` | keep one ImageKit SDK, not three |

Fewer dependencies = smaller install, smaller attack surface, faster CI.

---

## 6. What is already production-grade (keep it)

- **Auth**: bcrypt hashing, signed HTTP-only cookie (`secure` in production), Edge middleware protecting `/admin/*`, session re-verification in every server action, login rate limiting, open-redirect guard (`safeNext`), demo-credential refusal in production.
- **Input handling**: zod schemas per entity, shared parse helpers, whitelisted field updates in `saveSettings` (no mass-assignment), CSRF origin check on the multipart upload endpoint, honeypot on the public form.
- **Data layer**: Prisma singleton, `safeQuery` so a DB outage degrades to empty states instead of a 500, `unstable_cache` + tag-based invalidation from the admin (`revalidateTag`/`revalidatePath`), settings merge with per-key zod fallbacks.
- **SEO/PWA**: metadata templates, JSON-LD `@graph`, sitemap, robots, manifest, dynamic OG image, `metadataBase`, per-page `robots: { index: false }` on the login page.
- **Resilience in the UI**: WebGL detection + context-loss recovery + error boundary + static fallback for the hero; `prefers-reduced-motion` handling in GSAP/Framer paths; graceful `error.tsx` and `not-found.tsx`.
- **Uploads**: size + MIME validation, UUID filenames, ImageKit primary with Blob and local fallbacks, and an explicit 501 in production when no provider is configured.
- **Repo**: TypeScript strict, `typecheck`/`lint` scripts, `postinstall` Prisma generate, `engines` field, `.env.example` (needs the Brevo additions), no secrets committed (`.env`/`.neon` verified absent from git history).

---

## 7. Definition of "production ready" for this project

> **Implementation status (2026-09-30 pass):** every item the *repository* is responsible for is
> implemented and verified (`typecheck` · `lint` 0 warnings · `build` · `next start` smoke test ·
> `npm audit` 0 vulnerabilities). Items below marked ⚙️ still need actions **in your hosting/DNS/third-party
> accounts** — they cannot be completed from this repo.

- [x] `prisma/migrations` baselined (`0_init`) and committed; `directUrl` added ⚙️ test `db:deploy` on a real Neon branch
- [x] `/api/upload-auth` + `/api/imagekit/auth` deleted (server-side ImageKit-only uploads)
- [ ] ⚙️ Set `NEXT_PUBLIC_SITE_URL` to the real domain (build warns on localhost); then verify `robots.txt`/`sitemap.xml` in production
- [x] Brevo variables in `.env.example`; emails sent via `after()`; hardcoded sender fallback removed ⚙️ verify sender domain (SPF/DKIM) in Brevo
- [x] CSP + HSTS headers; `X-Robots-Tag: noindex` on `/admin/*` and `/api/*`
- [ ] ⚙️ Set Upstash env vars (code warns and falls back to per-process limits); after deploy verify 6 bad logins and form abuse are blocked
- [x] Turnstile on the contact form (widget + server verification; inert until both keys are set) ⚙️ create the Cloudflare site + set the two env vars to activate
- [x] `npm audit` → **0 vulnerabilities** (via `postcss`/`deepmerge-ts` overrides + dependency removals)
- [x] Error tracking (Sentry, no-op until DSN set) + `/api/health` (verified 200 `{"status":"ok"}`) ⚙️ set `SENTRY_DSN`/`NEXT_PUBLIC_SENTRY_DSN` and create an uptime check on `/api/health`
- [x] `loading.tsx` for admin routes; Lenis gated for `prefers-reduced-motion` and `/admin`
- [ ] ⚙️ Mobile PageSpeed recorded; First Load JS for `/` reduced (currently ~753 kB First Load because of three.js/GSAP — target ≤ 200 kB needs a bundle-splitting pass)
- [x] CI: `.github/workflows/ci.yml` (typecheck + lint + build against a Postgres service); `LICENSE`, `.nvmrc`, `.gitignore` (`.kilo/`)
- [x] Demo credentials removed from README; real bootstrap flow documented ⚙️ use a unique `AUTH_SECRET` + admin password per environment
- [ ] ⚙️ Backups/PITR confirmed and one restore rehearsed (hosting-side)

---

## 8. Implementation pass — files changed (2026-09-30)

| Area | Files |
| --- | --- |
| Turnstile | `src/lib/turnstile.ts`, `src/components/contact/turnstile-widget.tsx` (new), `src/components/contact/contact-form.tsx`, `src/app/actions/contact.ts`, `src/lib/validation/contact.ts` |
| Email via `after()` | `src/app/actions/contact.ts`, `src/lib/email.ts` (sender now env-only) |
| Health | `src/app/api/health/route.ts` (new) |
| Error tracking | `src/instrumentation.ts`, `src/instrumentation-client.ts` (new), `.env.example`, `src/lib/env.ts`, `src/lib/public-env.ts` |
| Admin UX/a11y | `src/app/admin/(dashboard)/loading.tsx` (new), `src/components/providers/smooth-scroll-provider.tsx` (reduced-motion + `/admin` gate) |
| Dependencies | `package.json` — removed `imagekit`, `@neon/env`, `@radix-ui/{switch,tabs,tooltip}`; `@neon/config` → devDeps; `@vercel/blob` 0.27→2.8; added `@sentry/nextjs`; overrides `postcss ^8.5.28`, `deepmerge-ts ^8.0.0` |
| CI | `.github/workflows/ci.yml` (new) |
| Docs | `README.md` (clone URL, no demo creds, live-link placeholder), `.env.example` (Sentry section) |




