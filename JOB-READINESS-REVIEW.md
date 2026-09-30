# Portfolio → Job-Ready: Review & Action Plan

**Reviewed:** 30 Sep 2026 · commit `3c2605d` (main) · Next.js 15 App Router · TypeScript · Prisma/Postgres
**Verified live:** dev server on `http://localhost:3000` → `/` 200 (674 KB HTML), `/admin/login` 200, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/abuhasan-cv.pdf` 200, dynamic OG image route, `npm run typecheck` passes clean.

---

## 0. Verdict

**As an engineering artifact: strong — above average for a mid-level application.**
Real deployable app, not a template: App Router + Server Actions, Prisma/Postgres with a migration + idempotent seed, admin CMS (projects / posts / services / testimonials / submissions / settings), auth with bcrypt + signed HTTP-only cookie + Edge middleware + rate limiting, zod validation on every action, SEO metadata + JSON-LD `@graph` + sitemap + robots + generated OG image, `prefers-reduced-motion` handling, skip link, form honeypot, security headers. This repo alone proves Next.js/TS/Prisma skill.

**As a *job-getting* artifact: it is currently working against you.** Two reasons:

1. **It is written for clients, not hiring managers.** "Start a Project", "Expected Budget (USD)", "Agency partnership", "Available for new projects". A recruiter hiring a full-time developer needs: target role, stack, employment history, verifiable proof, live links, résumé.
2. **Placeholder content is publicly visible.** The rendered homepage contains **23 occurrences of the word "Placeholder"**, 4 fabricated testimonials and 6 case studies whose `results` text literally begins with *"Placeholder result:"*. Fabricated social proof is the fastest way to lose an interview.

**Fix order:** P0 credibility → deploy with a real URL → reposition for hiring → add proof + history → polish.

---

## 1. P0 — Credibility blockers (do today)

### 1.1 Fake social proof is live
Verified in the rendered HTML of `/`:
- **4 testimonials** — e.g. `Jordan Mitchell … Owner · Demo · Home Services Business … ★★★★★ Verified Project`, each quote ending with the literal sentence *"Placeholder testimonial – replace with a real client quote."*
- **6 case studies** — every one has `results: "Placeholder result: … Replace with real metrics once available…"`
- **9 blog posts** — every article opens with *"Demo article. Placeholder content to demonstrate the blog system. Replace from the admin."*

**Do (Admin dashboard):**
| Content | Action | Why |
| --- | --- | --- |
| Testimonials (4, `isDemo=true`) | Delete, or turn `featured` off | The section renders a clean `EmptyState` when empty — better than fake |
| Projects (6, `isDemo=true`) | `published = false` | Removes fake metrics and fabricated domains |
| Posts (9, `isDemo=true`) | `status = DRAFT` | Removes "Demo article…" from the blog |

`isDemo` exists on `Project`, `BlogPost` and `Testimonial` in `prisma/schema.prisma`, so you can find every seeded row reliably. Then re-publish only content you can defend, one item at a time.

> Rule to apply: if you cannot name the client, link the live site, or show the metric, do not publish it.

### 1.2 The site has no public URL
`.env` has `NEXT_PUBLIC_SITE_URL=http://localhost:3000`, so everything derived from it is wrong for anyone but you: canonical/OG metadata (`src/lib/site.ts` → `src/app/layout.tsx:23`), JSON-LD `@id`s, `src/app/sitemap.ts`, the `Host:` line in `robots.txt`, and `public/abuhasan-cv.pdf` (which advertises "Portfolio: abuhasan.dev").

**Do:** deploy to Vercel → set `NEXT_PUBLIC_SITE_URL=https://<your-domain>` (custom domain, HTTPS), a **new** `AUTH_SECRET`, **new** `ADMIN_EMAIL`/`ADMIN_PASSWORD` (not the demo pair in `README.md`), then `npm run db:deploy` + `db:seed` against the production DB. Verify `/sitemap.xml`, `/robots.txt`, `/admin/login`, then add the domain to Google Search Console.

### 1.3 Three contact channels are dead
- `src/components/contact/contact.tsx:127` → `https://wa.me/8801700000000` — **placeholder phone number**, hardcoded in the component.
- Site settings `social` = `https://www.linkedin.com/`, `https://github.com/`, `https://www.upwork.com/` — the bare homepages, not your profiles. This is the #1 "not serious" signal after fake reviews.
- `social.email` is empty → the footer email link renders nothing (`src/components/footer/footer.tsx:74`), while `contact.tsx:21` silently falls back to a hardcoded `abuhasansarkar@gmail.com`.
- `https://calendly.com/abuhasansarkar/appointments` is hardcoded in `contact.tsx:20` and `scripts/create-cv.js` — confirm it resolves, or it is a third dead CTA.

**Do:** put real URLs into Admin → Site Settings (Social + Profile), set a real phone/WhatsApp, set `social.email`, and move the hardcoded Calendly/email values from the component into settings.

### 1.4 The résumé PDF is the weakest asset you own
`public/abuhasan-cv.pdf` is 2,417 bytes, hand-written by `scripts/create-cv.js`: name, title, email, "PROFESSIONAL SUMMARY", 4 skill lines, 3 bullets, availability. It has **no employment history, no companies, no dates, no education, no certifications, no clickable links**, no ATS-friendly structure, and it carries risky claim language ("90+ score guarantee", "100% 5-star … rating"). Recruiters download this *after* the site — it must be the second-strongest asset, not the weakest.

**Do:** rewrite a proper 1-page résumé — header with **clickable** site/GitHub/LinkedIn/email → 3-line summary → grouped skills (Frontend / Backend / CMS / Tooling) → **Experience** (company · title · dates · 3–4 bullets in "action → tool → result" form) → 2–3 projects with live links → Education/Certifications.

---

## 2. P1 — Reposition the site for hiring managers

### 2.1 One identity everywhere
The site says **"AbuHasan · Full-Stack Web Developer & WordPress Developer"** (`src/lib/site.ts`, settings seed); the contact section and CV say **"Abu Hasan Sarkar · Full-Stack Web Developer & WordPress Specialist"** and add "UI/UX Designer" in other places. Recruiters Google your name — make name, title and location identical across: site settings, JSON-LD (`src/app/layout.tsx:60-113`), OG image (`src/app/opengraph-image.tsx`), CV, LinkedIn headline, GitHub bio.
Recommended single line: `Abu Hasan Sarkar — Full-Stack Web Developer (Next.js / React / WordPress)`.

### 2.2 Add the missing "Experience" section (highest-impact content change)
There is no employment history anywhere on the site, and there is no data model for one (`prisma/schema.prisma` has Project / BlogPost / Testimonial / Service / ContactSubmission / SiteSetting only). A hiring manager's first question — "where has he worked, for how long, doing what?" — is currently unanswered.

Simplest implementation that matches your existing conventions (static content in `src/lib/content/*`, server component in `src/components/*`):
1. Create `src/lib/content/experience.ts` (same shape as `src/lib/content/process.ts`):
```ts
export type ExperienceItem = {
  company: string; role: string; period: string; location?: string;
  summary: string; bullets: string[]; stack: string[];
};
export const experience: ExperienceItem[] = [ /* newest first, real entries */ ];
export const education: { title: string; org: string; period: string; note?: string }[] = [ /* … */ ];
```
2. Create `src/components/experience/experience.tsx` (timeline, reuse `Section`, `SectionHeading`, `Reveal`, `Badge`).
3. Render it in `src/app/page.tsx` right after `<About />` and add `"experience"` to `sectionIds` + a nav link in `src/lib/site.ts`.

### 2.3 Add a recruiter fast-path block under the hero
30–60 seconds is all you get. Directly under the hero CTAs, show a compact strip (or a `/hire` page linked as the primary CTA):
- **Target roles:** Front-End Developer · WordPress Developer · Full-Stack (Next.js/React)
- **Core stack:** Next.js 15, React 19, TypeScript, Tailwind, Node, Prisma/PostgreSQL, WordPress/Elementor/WooCommerce, Figma
- **Availability:** open to full-time remote roles · Dhaka, Bangladesh (UTC+6, 4+ h overlap with EU/US)
- **Notice period / start date**, **languages**, **work authorisation or remote-only**
- Buttons: **Download Résumé · GitHub · LinkedIn · Email**

### 2.4 Reword the client language
| Current | Change to |
| --- | --- |
| `profile.availability`: "Available for new projects" | "Open to full-time roles & select freelance work" |
| `hero.secondaryCta`: "Start a Project" | "Hire Me" / "Book a 15-min intro call" |
| `cta.navLabel`: "Let's Work Together" | "Hire Me" |
| `cta.bannerHeadline`: "Let's build something that performs." | Keep — but add "…or join your team." |
| Badge in `src/components/layout/cta-banner.tsx:33`: "Available For Next Quarter" | "Open to full-time roles — immediate start" (a hardcoded, stale-looking badge) |
| Contact copy "Tell me what you're building, fixing, or improving." | "Tell me about the role, team, or project." |

All of the above except the hardcoded CTA-banner badge are editable from **Admin → Site Settings** (no code changes needed).

### 2.5 Make the contact form recruiter-friendly
`src/lib/validation/contact.ts` + `src/components/contact/contact-form.tsx`:
- `settings.contact.projectTypes` has **no employment option** — add `"Full-time role / Hiring"` and `"Contract / Part-time role"`.
- **Expected Budget (USD)** is the second thing a recruiter sees. `budget` is already optional in the zod schema (defaults to "Flexible / Discussion") — so hide the budget + timeline block when `projectType` starts with "Full-time"/"Contract" (client-side conditional; no schema change needed).
- Rename "Service Selection" → "What brings you here?" and "PROJECT / FIGMA / REFERENCE LINK" → "Job post / company link (optional)".
- Small bug: the service `<select>` sets `defaultValue={services[0]}` while also rendering a disabled `"Select service..."` option (`contact-form.tsx:152-160`) — so the placeholder never shows and "New website" is preselected. Default to `""`.
- Response-time promise is hardcoded in two places (`contact.responseTime` in settings = "one business day" vs `contact-form.tsx:270` fallback "within 24 hours"). Keep one source.

### 2.6 Nothing emails you when a recruiter writes
There is no mail dependency in `package.json` and `src/app/actions/contact.ts` only writes to `ContactSubmission`. If a recruiter submits the form and you do not open `/admin/submissions`, the lead is lost.
**Do:** add a notification (Resend/Postmark server action or a Vercel Cron that emails new `NEW` submissions once a day), or — the 2-minute version — set up a free uptime/webhook service against `/admin`. Also add your email to the form's success message as a fallback: "If you prefer email, write to …".

---

## 3. P1 — Proof & shareability

### 3.1 Case studies and posts have no URLs (biggest SEO + sharing loss)
There are no `/work/[slug]` or `/blog/[slug]` routes — `src/app` contains only `page.tsx` plus `/admin` and `/api`. Case studies and articles open in modals (`src/components/case-study/case-study-overlay.tsx`, `src/components/blog/post-overlay.tsx`). Consequences:
- You cannot send a recruiter a link to *one* project. You can only send the homepage and say "click Work, then the third card".
- Nothing is indexable: `/sitemap.xml` returns a **single URL** (the homepage).
- No per-project OG image → sharing your best project on LinkedIn shows a generic card.

**Do:** add `src/app/work/[slug]/page.tsx` and `src/app/blog/[slug]/page.tsx` with `generateStaticParams` + `generateMetadata` (+ `opengraph-image`), include both in `src/app/sitemap.ts`, and keep the overlay as an enhancement (link navigates to the page; JS may still open the modal). This is roughly one day of work for a large payoff.

### 3.2 Every image is a synthetic SVG mockup and the browser chrome shows invented domains
`prisma/seed-data/projects.ts` → all 6 projects have `projectUrl: ""` and images from `public/demo/projects/<slug>/cover.svg`. When `projectUrl` is empty, `project-card.tsx:57` and `case-study-overlay.tsx:153` render the fake host `` `${project.slug}.com` `` in the browser frame — i.e. `flipping-to-the-max.com`, `trenchless-today.com`. Mockups inside fake browser chrome read as "these sites may not exist" to a sceptical reviewer.

**Do:** for each project you keep, add one of: a real live URL, a real screenshot of the live site, or an explicit label ("Anonymised — screenshots on request", "Concept / personal project"). Change the frame URL to fall back to your own domain, or hide it when `projectUrl` is empty.

### 3.3 Numbers or nothing
| Now | Problem | Replace with |
| --- | --- | --- |
| hero badge "100% Client Satisfaction" | unverifiable, generic | years + delivery count, only if true |
| hero badge "50+ High-Performance Websites" | unverifiable | "15 WooCommerce stores", "LCP 4.2s → 0.8s on a 12k-page site" |
| stats "Multiple — Industries & Business Types" + "Local + International — Client Experience" | 2 of 4 stat cards say nothing measurable | sourced facts: projects shipped, avg. Core Web Vitals score, years with agencies |
| CV "90+ score guarantee", "100% 5-star rating" | guarantees look amateur; the rating maps to the fake testimonials | historical ranges + links to public case studies |
| "4+ years of experience" | fine — keep the same number everywhere (site, CV, LinkedIn) | identical figure on all profiles |

Also remove the "Verified Project" badge on testimonials (`src/components/testimonials/testimonials.tsx`) unless it is literally verifiable.

---

## 4. P2 — Technical polish

1. **Performance risk.** `/` returns 674 KB of HTML with 198 `<script>` tags: Three.js hero + GSAP/ScrollTrigger + Lenis smooth scroll + Framer Motion + custom cursor + decorative dot layers. Run PageSpeed Insights on the deployed URL and target **mobile LCP < 2.5 s, INP < 200 ms**. If it fails: keep the code-split `HeroSceneLoader` but gate the 3D scene behind an IntersectionObserver + `next/dynamic`, reduce decorative animated dots on mobile, and disable the custom cursor on touch devices.
2. **Analytics are off.** `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_META_PIXEL_ID` are empty, so you have no data on whether recruiters reach the résumé button. Enable GA4 (or privacy-friendly Plausible) and track: hero → Work → Résumé download → Contact.
3. **Accessibility pass before shipping.** Baseline is good (skip link `page.tsx:38`, labelled sections, focus rings, `prefers-reduced-motion` respected everywhere). Still verify: keyboard-only tab through the whole page (custom cursor and modals are the usual traps), contrast of `text-muted-foreground/70` on dark cards, and that overlays trap focus and close on `Esc`. Run Lighthouse a11y + axe once.
4. **Security before launch.** Replace the demo admin credentials published in `README.md`, rotate `AUTH_SECRET`, keep `.env` gitignored (verified — never committed), and set the Upstash vars for serverless deploys (otherwise rate limiting silently falls back to per-instance memory: `src/lib/auth/rate-limit.ts:101`).
5. **Small cleanups.** `profile.avatar` (`/demo/avatar.svg`) is stored but never rendered — add a real photo (it lifts trust noticeably). `settings.seo.ogImage` = `/og-default.png` **404s** (the dynamic `opengraph-image.tsx` covers OG, so clear the setting). Response-time copy is duplicated between settings and `contact-form.tsx:270`.

---

## 5. GitHub repo hygiene (recruiters do click GitHub)

Repo: `github.com/abuhasansarkar/AbuHasan-Dev-Portfolio`

- **`scratch_test_ik.ts` is committed** and performs live ImageKit uploads + deletes (plus the `test:imagekit` script). It reads credentials from env so nothing leaked, but a public scratch file looks careless — move it to `scripts/verify-imagekit.ts` or delete it.
- **`neon.ts`** is tracked while `.neon` is gitignored — if the Neon CLI config is not part of the product, move it under `scripts/`.
- **`.kilo/worktrees/possible-riddle/`** is a full duplicate of the repo inside the project folder and is **not** gitignored. Add `.kilo/` to `.gitignore` so it can never be committed.
- **No LICENSE** → add MIT (or an explicit "All rights reserved") so terms are clear.
- **No CI** → add `.github/workflows/ci.yml` running `npm ci`, `npm run typecheck`, `npm run lint`, `npm run build`. A green check on your own repo is visible proof you work with pipelines.
- **`README.md:34` clones from GitLab** (`gitlab.com/abuhasan-dev/portfolio.git`) — point it at the GitHub repo, and add at the top: live demo link, 2–3 screenshots, one-line pitch. Also remove the demo admin email/password block from the public README.
- Your commit style (`feat:`, `refactor:`) is already recruiter-friendly — keep it.

---

## 6. How to use it to actually get hired

**Application kit (keep it to 3 links):** portfolio URL · GitHub profile · LinkedIn. Plus the 1-page PDF résumé when a form demands an upload.

1. **Tailor per application.** Pick the 2–3 case studies that match the job post (a WooCommerce role → the store rebuild; a WordPress role → the Elementor/Figma build; a React role → this portfolio repo itself) and reorder them with `sortOrder` in the admin. Once 3.1 is done you can link the exact case study in the cover letter.
2. **Lead with the repo for engineering roles.** For Front-End/Full-Stack roles the strongest asset is not the design — it is that this is a real Next.js 15 + TypeScript + Prisma app with server actions, auth, validation, migrations and testable checks. Say it explicitly: *"the portfolio itself is a Next.js 15 / TypeScript / Prisma app — repo: …"*.
3. **Write 3 real articles instead of 9 demo ones.** Keep the best three topics (WordPress performance checklist, Figma → WordPress workflow, Elementor vs custom dev) and rewrite them from your own projects with real numbers and screenshots. Dated, published writing is a differentiator most applicants do not have.
4. **Cover-letter structure that matches this site:** 1 line role + role-fit stack → 3 bullets (one measurable problem solved, one WordPress/Elementor example, one React/Next.js example, each with a case-study link) → 1 line availability + time-zone overlap + résumé link.
5. **Where to apply with this profile:** remote-first boards (We Work Remotely, Remote OK, Dynamite Jobs), WordPress-specific boards (WP Career, Codeable), agencies hiring white-label WordPress developers (your existing strength), and contract-to-hire on Upwork — note that on Upwork your profile needs the same *real* samples, since the fabricated metrics would be checked there.
6. **Weekly rhythm:** 10 tailored applications, 5 recruiter follow-ups, 2 LinkedIn posts (one project teardown with before/after Core Web Vitals, one "how I built this portfolio" breakdown), 1 blog article rewritten from a real project.
7. **Interview prep from your own site:** expect "walk me through the hero 3D scene and why it does not hurt LCP" and "why overlays instead of routes, and what changed after?" — have honest answers ready, including the fix from 3.1.

---

## 7. 14-day execution plan

**Days 1–2 — stop the bleeding (P0)**
- [ ] Unpublish/delete all `isDemo` testimonials, projects, posts (1.1)
- [ ] Deploy to Vercel + custom domain, set `NEXT_PUBLIC_SITE_URL`, new `AUTH_SECRET`/admin credentials (1.2)
- [ ] Real LinkedIn/GitHub/Upwork URLs, real WhatsApp/phone, `social.email` (1.3), verify the Calendly link (1.3)

**Days 3–5 — résumé + GitHub (P0/P2)**
- [ ] Rewrite the résumé (1.4) and re-export `public/abuhasan-cv.pdf`
- [ ] Delete `scripts/create-cv.js`, move `scratch_test_ik.ts` → `scripts/`, add `.kilo/` to `.gitignore` (5)
- [ ] README: live link, screenshots, correct clone URL, remove demo credentials (5)
- [ ] Add `LICENSE` + `.github/workflows/ci.yml` (5)

**Days 6–9 — reposition for hiring (P1)**
- [ ] Experience + Education section (2.2)
- [ ] Recruiter fast-path block or `/hire` page (2.3)
- [ ] Rewrite availability, CTAs and contact copy (2.4)
- [ ] Contact form: "Full-time role / Hiring" option, conditional budget block, select placeholder fix (2.5)
- [ ] Email notification for new submissions (2.6)

**Days 10–14 — proof + sharing (P1/P2)**
- [ ] `/work/[slug]` + `/blog/[slug]` routes, sitemap entries, per-page OG images (3.1)
- [ ] Real screenshots / live URLs / honest labels for every project (3.2)
- [ ] Replace unverifiable stats and hero badges (3.3)
- [ ] Mobile PageSpeed pass, GA4 enabled, Lighthouse a11y (4)
- [ ] Rewrite 3 blog articles from real projects (6.3)
- [ ] Submit sitemap to Search Console, publish 2 LinkedIn teardowns (6.6)

---

## 8. File map for the changes above

| Change | File(s) |
| --- | --- |
| Availability, CTAs, contact copy, social links, budget ranges | Admin → Site Settings (stored in `SiteSetting`); seed defaults in `prisma/seed-data/settings.ts` |
| Remove demo content | Admin → Testimonials / Projects / Posts; or `prisma/seed.ts` + `prisma/seed-data/*` |
| WhatsApp number, Calendly, email fallback | `src/components/contact/contact.tsx:20-127` |
| CTA-banner badge | `src/components/layout/cta-banner.tsx:33` |
| Experience section | new `src/lib/content/experience.ts`, new `src/components/experience/experience.tsx`, `src/app/page.tsx`, `src/lib/site.ts` |
| Contact form (roles, budget, select default) | `src/components/contact/contact-form.tsx`, `src/lib/validation/contact.ts` |
| Contact email notification | `src/app/actions/contact.ts` |
| Case study / blog routes + sitemap + OG | new `src/app/work/[slug]/page.tsx`, new `src/app/blog/[slug]/page.tsx`, `src/app/sitemap.ts` |
| Browser-frame fake domain | `src/components/portfolio/project-card.tsx:57`, `src/components/case-study/case-study-overlay.tsx:153` |
| Résumé | `public/abuhasan-cv.pdf`, delete `scripts/create-cv.js` |
| Repo hygiene | `.gitignore`, `README.md`, new `LICENSE`, new `.github/workflows/ci.yml`, move `scratch_test_ik.ts` |

---

### What is already done well (do not change)
Real DB + admin CMS with typed settings; auth using hashed passwords, signed cookies, Edge middleware and rate limiting; zod validation with field-level errors; server actions with revalidation; SEO foundation (metadata templates, JSON-LD Person/ProfessionalService/WebSite, sitemap, robots, manifest, dynamic OG image, security headers); design system in `src/components/ui` with CSS-variable light/dark theming; animation layer that respects `prefers-reduced-motion`; reusable section primitives (`Section`, `SectionHeading`, `EmptyState`, `Reveal`); graceful empty/error states when the DB is unreachable; strict TypeScript with a clean `npm run typecheck`.



