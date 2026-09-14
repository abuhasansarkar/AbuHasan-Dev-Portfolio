# AbuHasan Portfolio — Project Plan

> **Status:** Production-ready. All major features implemented and functional.

---

## Vision

A premium, award-quality single-page portfolio for **AbuHasan** — Full-Stack Web Developer ·
WordPress Developer · UI/UX Designer — that communicates within seconds:

> _"I don't just build websites. I build high-converting digital experiences that help businesses generate leads, sales, trust, and growth."_

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, React Server Components, Server Actions) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4, CSS custom property color system (dark-first) |
| UI Primitives | shadcn/ui (Radix UI) |
| Animation | GSAP + ScrollTrigger (scroll-driven, entrance, counters, horizontal pin) |
| Overlay motion | Framer Motion (nav, overlays, testimonial transitions) |
| 3D | Three.js via React Three Fiber + @react-three/drei |
| Database | PostgreSQL 14+ via Prisma ORM |
| Auth | bcrypt (password hashing) + jose (JWT session) + HTTP-only cookie + Edge middleware |
| Image uploads | Vercel Blob (production) · `public/uploads/` (development) |
| Icons | Lucide React |
| Blog rendering | react-markdown + rehype-highlight + remark-gfm |
| Analytics | Google Analytics 4 · Meta Pixel (both env-var gated, afterInteractive) |
| SEO | Next.js Metadata API · JSON-LD structured data · sitemap.xml · robots.txt |

---

## Architecture

```
portfolio/
├── prisma/
│   ├── schema.prisma          # All DB models
│   ├── seed.ts                # Idempotent seed runner
│   └── seed-data/             # projects · posts · services · testimonials · settings
│
├── public/
│   └── demo/                  # Replaceable demo SVG mockups
│       ├── projects/          # 6 project folders (cover.svg + inner.svg)
│       ├── blog/              # Blog post cover images
│       ├── avatars/           # Testimonial avatars
│       └── transformation/    # Before/after slider images
│
└── src/
    ├── app/
    │   ├── layout.tsx          # Root layout · JSON-LD · Analytics · OG meta
    │   ├── page.tsx            # Single-page site (all sections)
    │   ├── not-found.tsx       # Custom 404
    │   ├── sitemap.ts          # Dynamic sitemap.xml
    │   ├── robots.ts           # robots.txt
    │   ├── actions/            # Server Actions
    │   │   ├── auth.ts         # Login / logout
    │   │   ├── contact.ts      # Contact form submission
    │   │   └── admin/          # CRUD actions (projects, posts, testimonials,
    │   │                       #   services, settings, categories, submissions)
    │   ├── api/admin/upload/   # Image upload endpoint (Blob / local)
    │   └── admin/
    │       ├── login/          # Login page
    │       └── (dashboard)/    # Protected admin area
    │           ├── layout.tsx  # Sidebar + auth guard
    │           ├── page.tsx    # Dashboard overview
    │           ├── projects/   # CRUD (list, new, [id])
    │           ├── posts/      # CRUD (list, new, [id])
    │           ├── categories/ # CRUD (list, new, [id])
    │           ├── testimonials/ # CRUD (list, new, [id])
    │           ├── services/   # CRUD (list, new, [id])
    │           ├── submissions/ # List + detail + status management
    │           └── settings/   # Site settings editor
    │
    ├── components/
    │   ├── layout/             # CustomCursor · Analytics · CtaBanner · SectionHeading · EmptyState
    │   ├── navigation/         # Navbar · MobileMenu · ThemeToggle
    │   ├── hero/               # Hero · ScrollIndicator
    │   ├── about/              # About · SkillsMarquee · Stats · Why
    │   ├── services/           # Services · ServiceCard · ServiceIcon
    │   ├── expertise/          # Expertise · TechOrbit
    │   ├── portfolio/          # Work · WorkGrid · ProjectCard · Transformation · BeforeAfterSlider · BrowserFrame
    │   ├── case-study/         # CaseStudyOverlay
    │   ├── process/            # Process
    │   ├── testimonials/       # Testimonials
    │   ├── blog/               # Blog · BlogExplorer · PostCard · PostOverlay · Markdown
    │   ├── contact/            # Contact · ContactForm
    │   ├── footer/             # Footer · BackToTop
    │   ├── animations/         # Counter · Magnetic · Marquee · Reveal · TextReveal
    │   ├── three/              # HeroSceneLoader · HeroScene · SceneFallback
    │   ├── providers/          # AppProviders (ThemeProvider · Toaster)
    │   ├── admin/              # All admin UI components
    │   └── ui/                 # shadcn/ui primitives
    │
    ├── hooks/                  # useGsap · useActiveSection · useMediaQuery · useReducedMotion
    │
    └── lib/
        ├── db.ts               # Prisma singleton
        ├── env.ts              # Typed env validation (server + public)
        ├── site.ts             # Static site identity + nav links
        ├── utils.ts            # cn · slugify · formatDate · truncate · estimateReadingTime
        ├── gsap.ts             # GSAP + ScrollTrigger registration
        ├── auth/               # token · session
        ├── admin/              # action-state · form-data helpers
        ├── content/            # tech groups · process steps (static content)
        ├── data/               # DB query helpers (projects, posts, services, testimonials, tags)
        ├── settings/           # get-settings · schema (Zod)
        └── validation/         # admin Zod schemas
```

---

## Database Schema

```
Admin               – email, passwordHash, name, lastLoginAt
Project             – slug, title, client, industry, category, description,
                      challenge, strategy, solution, results, keyImprovements[],
                      technologies[], services[], coverImage, accentColor,
                      year, featured, published, isDemo, sortOrder
ProjectImage        – url, alt, caption, sortOrder → Project
BlogCategory        – slug, name, description, sortOrder
BlogPost            – slug, title, excerpt, content, category, tags[],
                      coverImage, author, publishedAt, readingTime,
                      seoTitle, seoDescription, ogImage,
                      status (DRAFT|PUBLISHED), featured, isDemo
Testimonial         – quote, name, role, company, avatar, rating,
                      featured, isDemo, sortOrder
Service             – slug, title, description, details, icon,
                      features[], sortOrder, active
ContactSubmission   – name, email, projectType, budget, message,
                      status (NEW|CONTACTED|IN_PROGRESS|COMPLETED|ARCHIVED),
                      notes, userAgent
SiteSetting         – key (string), value (JSON)  [key/value store]
```

All settings (hero, about, stats, social, CTA, contact, SEO, profile) are stored
as typed JSON blobs in `SiteSetting` and validated with Zod on read.

---

## Sections (single-page experience)

| # | Section | ID | Notes |
|---|---|---|---|
| — | Navbar | — | Sticky · blur-on-scroll · active section indicator |
| 1 | Hero | `#hero` | GSAP entrance · Three.js particle sphere · scroll parallax |
| 2 | Skills Marquee | — | Animated horizontal ticker |
| 3 | About | `#about` | Storytelling · focus areas · identity card |
| 4 | Stats | — | Animated counters (GSAP) |
| 5 | Services | `#services` | 9 interactive cards with hover expand |
| 6 | Expertise | `#expertise` | Tech orbit (desktop) · chip groups (mobile) |
| 7 | Selected Work | `#work` | Asymmetric grid · case study overlay |
| 8 | Before/After | `#transformation` | Drag slider |
| 9 | Process | `#process` | Horizontal scroll pin (desktop) · vertical timeline (mobile) |
| 10 | Why Work With Me | `#why` | Bold editorial statements |
| 11 | Testimonials | `#testimonials` | Drag carousel · autoplay |
| 12 | Blog / Insights | `#blog` | Search · category filter · post overlay |
| 13 | FAQ | `#faq` | Animated accordion |
| 14 | CTA Banner | — | Full-width conversion strip |
| 15 | Contact | `#contact` | Form · social links · validation · status states |
| — | Footer | — | Social · back-to-top |

---

## Admin Dashboard

| Page | Path |
|---|---|
| Overview | `/admin` |
| Projects | `/admin/projects` |
| Blog posts | `/admin/posts` |
| Categories | `/admin/categories` |
| Testimonials | `/admin/testimonials` |
| Services | `/admin/services` |
| Submissions | `/admin/submissions` |
| Site settings | `/admin/settings` |

Authentication: bcrypt-hashed password · 7-day signed JWT in HTTP-only cookie ·
Edge middleware protects all `/admin/*` routes · login rate limiting.

---

## SEO Implementation

- Next.js Metadata API (title, description, OG, Twitter cards, robots)
- JSON-LD structured data: `Person` + `ProfessionalService` + `WebSite`
- Dynamic `sitemap.xml` from DB
- `robots.txt` (allow public, disallow admin/api)
- `googleSiteVerification` env var → meta tag
- Semantic HTML throughout (single H1 per view, landmark roles, ARIA only where needed)

---

## Analytics

Configured via environment variables — nothing hardcoded:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=   # Google Analytics 4
NEXT_PUBLIC_META_PIXEL_ID=       # Meta Pixel
```

Scripts load `afterInteractive` and only render when the variable is non-empty.

---

## Performance Strategy

- React Server Components for all data-fetching sections
- `next/image` for all images (lazy load, responsive sizes)
- GSAP loaded only in `useGsap` hook (client-side)
- Three.js scene loaded with dynamic import + Suspense fallback
- `prefers-reduced-motion` respected: all animations disabled when active
- Mobile: Three.js scene simplified (particle count reduced), animations reduced
- Font: `display: swap` for both Google Fonts
- Code-split per route (Next.js App Router default)

---

## Local Development

```bash
git clone <repo>
cd portfolio
npm install
cp .env.example .env
# Edit .env: set AUTH_SECRET (openssl rand -base64 32)

docker compose up -d          # Postgres on :5432
npm run db:migrate            # Create schema
npm run db:seed               # Seed demo data + admin account

npm run dev                   # http://localhost:3000
```

**Demo admin login (development only — change before production):**

```
Email:    admin@example.com
Password: ChangeThisImmediately123!
```

---

## Production Deployment

1. Provision a PostgreSQL 14+ database (Neon / Supabase / Railway / Vercel Postgres)
2. Set all environment variables (see `.env.example`)
3. Generate a strong `AUTH_SECRET`: `openssl rand -base64 32`
4. Change `ADMIN_EMAIL` / `ADMIN_PASSWORD` to real credentials
5. Run migrations + seed against the production DB
6. Deploy (Vercel recommended — zero-config for Next.js 15)
7. Optionally configure Vercel Blob for image uploads (`BLOB_READ_WRITE_TOKEN`)

### Security checklist
- [ ] `ADMIN_EMAIL` / `ADMIN_PASSWORD` changed from demo values
- [ ] `AUTH_SECRET` is unique and ≥ 32 chars
- [ ] `NEXT_PUBLIC_SITE_URL` is the real HTTPS domain
- [ ] Demo projects / posts / testimonials replaced or unflagged in admin
- [ ] Site settings, social links and SEO metadata reviewed in admin

---

## Content Management

All public-facing copy is managed from `/admin`:

- **Profile, hero, about, stats, social, CTA, contact options, SEO** → Site Settings
- **Portfolio projects** → Projects (with images, technologies, services, case study content)
- **Blog** → Posts (rich Markdown, categories, tags, featured, SEO metadata)
- **Testimonials** → Testimonials (quote, person, rating, featured toggle)
- **Services** → Services (title, description, icon, features, sort order)
- **Leads** → Submissions (view, status, notes, email reply shortcut)

All seeded content is flagged `isDemo: true` and labelled as placeholder on the live site.
Replace content from `/admin` before going live.

---

_Built by AbuHasan · Full-Stack Web Developer & WordPress Developer_
