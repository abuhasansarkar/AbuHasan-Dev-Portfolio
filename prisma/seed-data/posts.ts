import { PostStatus } from "@prisma/client";

/**
 * DEMO BLOG CONTENT. Realistic but placeholder articles (isDemo: true).
 * Content is Markdown rendered by react-markdown with GFM and syntax highlighting.
 */
export const categories = [
  { slug: "wordpress", name: "WordPress", description: "Building, extending and maintaining WordPress the right way.", sortOrder: 1 },
  { slug: "web-design", name: "Web Design", description: "Design decisions that make websites clearer and more persuasive.", sortOrder: 2 },
  { slug: "ui-ux", name: "UI/UX", description: "Interfaces and journeys that reduce friction.", sortOrder: 3 },
  { slug: "seo", name: "SEO", description: "Technical and on-page SEO for real businesses.", sortOrder: 4 },
  { slug: "performance", name: "Performance", description: "Speed, Core Web Vitals and why they matter for revenue.", sortOrder: 5 },
  { slug: "freelancing", name: "Freelancing", description: "Working with clients and agencies as an independent developer.", sortOrder: 6 },
  { slug: "web-development", name: "Web Development", description: "Custom code, tooling and modern stacks.", sortOrder: 7 },
];

export type SeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  categorySlug: string;
  tags: string[];
  coverImage: string;
  author: string;
  publishedAt: Date;
  readingTime: number;
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
  status: PostStatus;
  featured: boolean;
  isDemo: boolean;
};

const author = "AbuHasan";

export const posts: SeedPost[] = [
  {
    slug: "how-to-build-a-high-converting-wordpress-landing-page",
    title: "How to Build a High-Converting WordPress Landing Page",
    excerpt:
      "A landing page has one job. Here is the structure, content order and technical setup I use to make WordPress landing pages convert.",
    categorySlug: "wordpress",
    tags: ["landing pages", "conversion", "elementor"],
    coverImage: "/demo/blog/landing-page.svg",
    author,
    publishedAt: new Date("2026-08-28T09:00:00Z"),
    readingTime: 7,
    seoTitle: "How to Build a High-Converting WordPress Landing Page",
    seoDescription: "Structure, copy order and technical setup for WordPress landing pages that generate leads and sales.",
    status: PostStatus.PUBLISHED,
    featured: true,
    isDemo: true,
    content: `> Demo article. Placeholder content to demonstrate the blog system. Replace from the admin.

A landing page is not a smaller homepage. It exists to move one specific visitor toward one specific action. Everything that does not support that action is friction.

## Start with the offer, not the layout

Before opening Elementor, write three lines:

1. **Who** is this page for?
2. **What** do they get if they act?
3. **Why** should they believe you?

If you cannot answer these clearly, no amount of design will fix the page.

## The section order that works

- **Hero**: headline that names the outcome, one supporting sentence, one CTA.
- **Proof**: logos, numbers or a short testimonial. Doubt appears early, so answer it early.
- **Problem and shift**: describe the visitor's situation in their words, then the better way.
- **How it works**: three to five steps. Reduce perceived effort.
- **Offer details**: what is included, what it costs (or how pricing works), what happens next.
- **Objections**: FAQ that answers the real reasons people hesitate.
- **Final CTA**: repeat the primary action with a reason to act now.

## Technical setup on WordPress

- Use a blank canvas template so the theme header and footer do not distract.
- Keep one form plugin, load it only on this page, and send submissions somewhere you will actually see them.
- Compress every image, serve WebP, and set explicit dimensions to avoid layout shift.
- Add a UTM-aware hidden field so you know which campaign produced the lead.

## Measure, then iterate

Install analytics before launch and define the conversion event. Then change one thing at a time: the headline, the CTA label, the form length. Small changes compound when you measure them.`,
  },
  {
    slug: "why-website-speed-directly-impacts-conversions",
    title: "Why Website Speed Directly Impacts Conversions",
    excerpt: "Speed is not a technical vanity metric. It changes how much people trust you and whether they finish what they started.",
    categorySlug: "performance",
    tags: ["core web vitals", "conversion", "speed"],
    coverImage: "/demo/blog/speed.svg",
    author,
    publishedAt: new Date("2026-08-14T09:00:00Z"),
    readingTime: 5,
    seoTitle: "Why Website Speed Directly Impacts Conversions",
    seoDescription: "How load time, interaction delay and layout shift affect trust, engagement and revenue, and what to fix first.",
    status: PostStatus.PUBLISHED,
    featured: false,
    isDemo: true,
    content: `> Demo article. Placeholder content to demonstrate the blog system. Replace from the admin.

When a page is slow, visitors do not think "this server is under-provisioned." They think "this company is not on top of things." Speed is a trust signal before it is a technical one.

## Three ways slowness costs you

1. **Abandonment before the first impression.** A meaningful share of mobile visitors leave before a slow page ever paints. Your headline never had a chance.
2. **Hesitation at the moment of action.** Sluggish forms and delayed button responses feel broken. People stop clicking things that feel broken.
3. **Weaker search visibility.** Core Web Vitals are part of how Google evaluates page experience, which affects who sees you in the first place.

## What actually matters

Focus on the metrics that map to user experience:

- **LCP (Largest Contentful Paint)**: how fast the main content shows up.
- **INP (Interaction to Next Paint)**: how quickly the page responds when someone taps or clicks.
- **CLS (Cumulative Layout Shift)**: whether things jump around while loading.

## Fix in priority order

- Oversized hero images and videos
- Render-blocking scripts from plugins and third-party tags
- Fonts loading without \`font-display: swap\`
- Missing caching and CDN
- Bloated page builders with unused widgets

A fast site is a competitive advantage most local businesses still ignore. That is exactly why it works.`,
  },
  {
    slug: "elementor-vs-custom-development",
    title: "Elementor vs Custom Development: Which One Does Your Project Actually Need?",
    excerpt: "Neither option is universally better. The right choice depends on who edits the site, how often, and what it has to do.",
    categorySlug: "web-development",
    tags: ["elementor", "custom code", "decision making"],
    coverImage: "/demo/blog/elementor-vs-custom.svg",
    author,
    publishedAt: new Date("2026-07-30T09:00:00Z"),
    readingTime: 6,
    seoTitle: "Elementor vs Custom Development: Which Do You Need?",
    seoDescription: "A practical framework for choosing between Elementor and custom development based on editing needs, performance and complexity.",
    status: PostStatus.PUBLISHED,
    featured: false,
    isDemo: true,
    content: `> Demo article. Placeholder content to demonstrate the blog system. Replace from the admin.

I build with both, so this is not a sales pitch for either. Here is how I actually decide.

## Choose Elementor when

- The marketing team needs to edit layouts, not just text.
- The site is mostly content and landing pages.
- Budget and timeline are tight and the design is achievable with standard patterns.
- You already run WordPress and want to stay in that ecosystem.

Elementor done well is fast enough for most businesses. Elementor done carelessly is where the bad reputation comes from.

## Choose custom development when

- Performance is a business requirement, not a nice-to-have.
- The site has application-like features: dashboards, complex filtering, integrations.
- You need a design system that stays pixel-consistent across hundreds of pages.
- You want full control over the front end (for example Next.js with a headless CMS).

## The hybrid most clients end up with

A custom WordPress theme with a lean set of Elementor templates, ACF for structured content, and hand-written CSS for the parts that need precision. Editors keep flexibility, and the code stays maintainable.

## The question to ask

"Who will touch this site in six months, and what will they need to change?" Answer that honestly and the platform decision usually makes itself.`,
  },
  {
    slug: "website-design-mistakes-that-hurt-local-businesses",
    title: "Website Design Mistakes That Hurt Local Businesses",
    excerpt: "Most local business websites lose customers for the same handful of reasons. All of them are fixable.",
    categorySlug: "web-design",
    tags: ["local business", "conversion", "design"],
    coverImage: "/demo/blog/local-business.svg",
    author,
    publishedAt: new Date("2026-07-16T09:00:00Z"),
    readingTime: 5,
    seoTitle: "Website Design Mistakes That Hurt Local Businesses",
    seoDescription: "Common local business website mistakes, from hidden phone numbers to weak mobile experiences, and how to fix each.",
    status: PostStatus.PUBLISHED,
    featured: false,
    isDemo: true,
    content: `> Demo article. Placeholder content to demonstrate the blog system. Replace from the admin.

A local business website has a simpler job than most: prove you are real, show you are good, and make contact effortless. Here is where it usually goes wrong.

## 1. The phone number is hidden

On mobile, a visible, tappable phone number in the header is the highest-value element on the page. Do not bury it in the footer.

## 2. No service area

If visitors cannot tell whether you serve their town in the first five seconds, they leave. Say it in the hero. Then build service-area pages for search.

## 3. Stock photos instead of real proof

Photos of your team, your work and your vehicles beat any stock image. Pair them with reviews that mention specific outcomes.

## 4. A homepage that tries to say everything

Rank the three things that matter most to your customers and design the page around them. Everything else can live one click deeper.

## 5. Slow, heavy pages

Many local sites run twenty plugins and a slider nobody watches. Remove the slider, cut the plugins, compress the images.

## 6. Weak or missing calls to action

"Learn more" is not a call to action. "Get a free quote" or "Book an inspection" is.

Fix these six and most local sites will outperform their competitors without a full redesign.`,
  },
  {
    slug: "how-better-ux-can-improve-lead-generation",
    title: "How Better UX Can Improve Lead Generation",
    excerpt: "Lead generation is a UX problem before it is a marketing problem. Reduce friction and the same traffic produces more leads.",
    categorySlug: "ui-ux",
    tags: ["ux", "lead generation", "forms"],
    coverImage: "/demo/blog/ux-leads.svg",
    author,
    publishedAt: new Date("2026-07-02T09:00:00Z"),
    readingTime: 6,
    seoTitle: "How Better UX Improves Lead Generation",
    seoDescription: "Practical UX improvements that increase form completions and inquiries without buying more traffic.",
    status: PostStatus.PUBLISHED,
    featured: false,
    isDemo: true,
    content: `> Demo article. Placeholder content to demonstrate the blog system. Replace from the admin.

Buying more traffic is expensive. Making the traffic you already have convert is usually cheaper, and it starts with the experience.

## Map the path to the lead

Write down every step between landing and submitting: reading, scrolling, deciding, clicking, filling, confirming. Each step is a place to lose someone.

## Reduce form friction

- Ask only for what you need to respond. Everything else can wait for the call.
- Use clear labels, not placeholders that disappear.
- Show validation inline as people type, not after they submit.
- Make the button describe the outcome: "Send my request", not "Submit".

## Answer objections where they occur

Pricing questions belong near pricing. Timeline questions belong near the process. A FAQ at the bottom is fine, but the strongest objection handling is contextual.

## Design for the anxious visitor

People hesitate because they are unsure what happens next. Tell them: "You will hear back within one business day. No sales pressure."

## Make the next step obvious on every screen

The visitor should never have to look for the CTA. Sticky buttons on mobile and repeated CTAs after each major section keep the action within reach.

Good UX is not decoration. It is the removal of every reason not to act.`,
  },
  {
    slug: "wordpress-performance-optimization-checklist",
    title: "WordPress Performance Optimization Checklist",
    excerpt: "The exact order I work through when a WordPress site is slow, from hosting to fonts.",
    categorySlug: "performance",
    tags: ["wordpress", "performance", "checklist"],
    coverImage: "/demo/blog/wp-performance.svg",
    author,
    publishedAt: new Date("2026-06-18T09:00:00Z"),
    readingTime: 8,
    seoTitle: "WordPress Performance Optimization Checklist",
    seoDescription: "A step-by-step checklist for speeding up WordPress: hosting, caching, images, scripts, fonts, database and plugins.",
    status: PostStatus.PUBLISHED,
    featured: false,
    isDemo: true,
    content: `> Demo article. Placeholder content to demonstrate the blog system. Replace from the admin.

Work top to bottom. Fixing fonts on a site with terrible hosting is wasted effort.

## 1. Hosting and PHP

- Modern PHP version enabled
- Server-level caching or a managed WordPress host
- HTTP/2 or HTTP/3 with a CDN in front

## 2. Caching

- Page caching for anonymous visitors
- Object caching if the site is dynamic
- Sensible cache lifetimes and purge rules

## 3. Images and media

- WebP or AVIF for everything
- Correct dimensions for each breakpoint
- Lazy load below the fold, eager load the hero
- No autoplaying background video on mobile

## 4. Scripts and styles

- Remove unused plugins and their assets
- Defer non-critical JavaScript
- Load third-party tags after interaction where possible

## 5. Fonts

Self-host, subset, and swap:

\`\`\`css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-var.woff2") format("woff2");
  font-display: swap;
  font-weight: 100 900;
}
\`\`\`

## 6. Database

- Clean post revisions, transients and spam
- Remove tables left behind by uninstalled plugins

## 7. Page builder hygiene

- Disable unused Elementor widgets and features
- Avoid nested containers where a single container works
- Use global styles instead of per-element overrides

Re-test with real-user metrics after each block, not just lab scores.`,
  },
  {
    slug: "figma-to-wordpress-workflow",
    title: "Figma to WordPress Workflow: From Design File to Pixel-Perfect Build",
    excerpt: "How I move from a Figma design to a WordPress site that matches it, stays responsive and remains editable.",
    categorySlug: "web-design",
    tags: ["figma", "elementor", "workflow"],
    coverImage: "/demo/blog/figma-wordpress.svg",
    author,
    publishedAt: new Date("2026-06-04T09:00:00Z"),
    readingTime: 6,
    seoTitle: "Figma to WordPress Workflow",
    seoDescription: "A repeatable process for converting Figma designs into pixel-perfect, responsive WordPress and Elementor builds.",
    status: PostStatus.PUBLISHED,
    featured: false,
    isDemo: true,
    content: `> Demo article. Placeholder content to demonstrate the blog system. Replace from the admin.

Pixel-perfect is a process, not a talent. This is the one I use.

## 1. Audit the file before building

- Confirm breakpoints exist (or agree on them).
- Extract the type scale, spacing scale and color tokens.
- Flag anything that will not translate to the web as drawn.

## 2. Set up global styles first

In Elementor (or the theme), define global colors, fonts and container widths from the Figma tokens. Every element then inherits correctly, and later changes happen in one place.

## 3. Build the templates, not the pages

Header, footer, section patterns and reusable blocks come first. Pages are assembled from them. This keeps hundreds of pages consistent.

## 4. Build desktop, then refine down

Desktop establishes the structure. Tablet and mobile are deliberate redesigns of spacing, order and hierarchy, not shrunken copies.

## 5. Compare side by side

Overlay screenshots against the design at each breakpoint. Fix spacing and alignment before moving on.

## 6. Hand off with guardrails

Document which elements are meant to be edited, lock the ones that are not, and record a short walkthrough for the client's team.`,
  },
  {
    slug: "how-agencies-can-scale-website-production",
    title: "How Agencies Can Scale Website Production Without Losing Quality",
    excerpt: "Agencies hit a ceiling when every site is a one-off. Systems and the right partners break through it.",
    categorySlug: "freelancing",
    tags: ["agencies", "white label", "process"],
    coverImage: "/demo/blog/agency-scale.svg",
    author,
    publishedAt: new Date("2026-05-21T09:00:00Z"),
    readingTime: 5,
    seoTitle: "How Agencies Can Scale Website Production",
    seoDescription: "Practical systems and partnership models that help agencies deliver more websites at consistent quality.",
    status: PostStatus.PUBLISHED,
    featured: false,
    isDemo: true,
    content: `> Demo article. Placeholder content to demonstrate the blog system. Replace from the admin.

I work with agencies as a white-label development partner. The ones that scale smoothly share a few habits.

## Standardize the inputs

A build brief template, a design checklist and a content checklist mean development starts with everything it needs. Most delays come from missing inputs, not slow developers.

## Build on a base

A maintained starter (theme, plugin stack, global styles, performance defaults) removes a day or two from every project and makes quality predictable.

## Separate design from production

Designers design, developers build, QA tests. When one person does all three under deadline, quality is the first thing to slip.

## Use dedicated partners, not marketplaces

A partner who knows your standards, your stack and your clients delivers faster than a new freelancer for each project. Consistency compounds.

## Define QA as a stage

Cross-browser, responsive, accessibility, performance and SEO checks belong in a checklist run before the client ever sees a link.

Scaling is less about hiring and more about removing the decisions that have to be made from scratch every time.`,
  },
  {
    slug: "technical-seo-basics-every-wordpress-site-needs",
    title: "Technical SEO Basics Every WordPress Site Needs",
    excerpt: "Before content and backlinks, make sure search engines can crawl, understand and trust your site.",
    categorySlug: "seo",
    tags: ["seo", "wordpress", "rank math"],
    coverImage: "/demo/blog/technical-seo.svg",
    author,
    publishedAt: new Date("2026-05-07T09:00:00Z"),
    readingTime: 6,
    seoTitle: "Technical SEO Basics Every WordPress Site Needs",
    seoDescription: "The technical SEO foundations for WordPress: indexing, sitemaps, schema, headings, canonical URLs and speed.",
    status: PostStatus.PUBLISHED,
    featured: false,
    isDemo: true,
    content: `> Demo article. Placeholder content to demonstrate the blog system. Replace from the admin.

Technical SEO is the plumbing. Nobody praises it, but nothing works without it.

## Crawling and indexing

- Confirm the site is not set to discourage search engines.
- Submit an XML sitemap (Rank Math or Yoast generates one).
- Noindex thin pages: tag archives, author archives, search results.

## One H1, clear hierarchy

Each page gets one H1 that states the topic. H2s structure the sections. Headings are for structure, not for styling.

## Canonical URLs

Pick one version of every URL (trailing slash, www, https) and redirect the rest. Duplicate URLs split your authority.

## Structured data

Add \`LocalBusiness\` or \`Organization\` schema on the homepage, \`Article\` schema on posts, and \`FAQPage\` where you have FAQs. Validate with Google's Rich Results Test.

## Speed and mobile

Core Web Vitals are part of page experience. A slow, shifting mobile page is an SEO problem, not only a UX one.

## Internal linking

Link from your strongest pages to the pages you want to rank, using descriptive anchor text.

Get these right and every piece of content you publish afterward works harder.`,
  },
];
