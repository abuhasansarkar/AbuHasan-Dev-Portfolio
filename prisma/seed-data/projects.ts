/**
 * DEMO PORTFOLIO PROJECTS.
 * Titles reflect real project names from AbuHasan's work history; all descriptive copy,
 * metrics and images are placeholder content (isDemo: true) to be replaced from /admin.
 * Images live in public/demo/projects and are referenced by URL so they can be swapped freely.
 */
type SeedProjectImage = { url: string; alt: string; caption?: string };

export type SeedProject = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  category: string;
  excerpt: string;
  description: string;
  challenge: string;
  strategy: string;
  solution: string;
  results: string;
  keyImprovements: string[];
  technologies: string[];
  services: string[];
  projectUrl?: string;
  coverImage: string;
  accentColor?: string;
  year?: number;
  featured: boolean;
  published: boolean;
  isDemo: boolean;
  sortOrder: number;
  images: SeedProjectImage[];
};

export const projects: SeedProject[] = [
  {
    slug: "flipping-to-the-max",
    title: "Flipping To The Max",
    client: "Flipping To The Max",
    industry: "Real Estate Education",
    category: "Website Design & Development",
    excerpt: "A conversion-focused brand site and lead funnel for a real estate flipping coaching program.",
    description:
      "Flipping To The Max teaches investors how to find, fund and flip properties. The business needed a website that could carry an audience from curiosity to a booked strategy call without relying on a dozen disconnected tools.",
    challenge:
      "The previous site was a generic template with weak hierarchy, no clear next step, and slow load times on mobile where most of the traffic arrived from social content. Lead capture lived on third-party pages that broke the brand experience.",
    strategy:
      "Define one primary conversion (book a call) and one secondary (download the free guide), structure every section to support them, and bring lead capture on-site with a fast, branded funnel.",
    solution:
      "Designed and built a WordPress site with Elementor and ACF-driven program modules, a dedicated funnel with CartFlows, on-page SEO with Rank Math, and aggressive performance work: optimized media, trimmed plugins and server-level caching.",
    results:
      "Placeholder result: a faster, clearer site with a single, measurable funnel. Replace with real metrics once available (for example lead volume, call bookings or page speed scores).",
    keyImprovements: [
      "Single primary CTA repeated with intent across the page",
      "Mobile load time reduced through media and plugin optimization",
      "On-site lead funnel replacing external landing pages",
      "Structured program content editable by the client",
    ],
    technologies: ["WordPress", "Elementor", "ACF", "CartFlows", "Rank Math"],
    services: ["Website Design", "WordPress Development", "Landing Page Design", "SEO", "Performance Optimization"],
    projectUrl: "",
    coverImage: "/demo/projects/flipping-to-the-max/cover.svg",
    accentColor: "#f97316",
    year: 2025,
    featured: true,
    published: true,
    isDemo: true,
    sortOrder: 1,
    images: [
      { url: "/demo/projects/flipping-to-the-max/cover.svg", alt: "Flipping To The Max homepage mockup in a browser frame", caption: "Homepage hero and primary call to action" },
      { url: "/demo/projects/flipping-to-the-max/inner.svg", alt: "Flipping To The Max program page mockup", caption: "Program overview and lead funnel entry" },
    ],
  },
  {
    slug: "trenchless-today",
    title: "Trenchless Today",
    client: "Trenchless Today",
    industry: "Home Services",
    category: "Local Business Website",
    excerpt: "A local-SEO-ready service website for a trenchless pipe repair company, built to generate phone calls.",
    description:
      "Trenchless Today provides no-dig sewer and water line repair. Their customers are homeowners with an urgent problem, so the website had one job: make it obvious who they are, where they work, and how to call them right now.",
    challenge:
      "Technical service content is hard to explain, the old site buried the phone number, and service-area pages did not exist, which limited local search visibility.",
    strategy:
      "Lead with trust and speed: prominent click-to-call, clear service explanations with visuals, dedicated service and location pages for local SEO, and a lightweight build that performs on mobile networks.",
    solution:
      "WordPress build with Elementor and Crocoblock for dynamic service and service-area pages, Rank Math local SEO schema, review integration, and a sticky mobile call bar.",
    results:
      "Placeholder result: an easy-to-navigate service site with a mobile-first call flow and local SEO foundations. Replace with real outcomes when available.",
    keyImprovements: [
      "Sticky click-to-call bar on mobile",
      "Dynamic service-area pages for local search",
      "Plain-language explanation of trenchless technology",
      "LocalBusiness schema and review markup",
    ],
    technologies: ["WordPress", "Elementor", "Crocoblock", "Rank Math"],
    services: ["Website Design", "WordPress Development", "SEO", "Performance Optimization"],
    projectUrl: "",
    coverImage: "/demo/projects/trenchless-today/cover.svg",
    accentColor: "#0ea5e9",
    year: 2025,
    featured: true,
    published: true,
    isDemo: true,
    sortOrder: 2,
    images: [
      { url: "/demo/projects/trenchless-today/cover.svg", alt: "Trenchless Today homepage mockup", caption: "Homepage with click-to-call hero" },
      { url: "/demo/projects/trenchless-today/inner.svg", alt: "Trenchless Today service page mockup", caption: "Service page with process explanation" },
    ],
  },
  {
    slug: "lmk-technologies",
    title: "LMK Technologies",
    client: "LMK Technologies",
    industry: "B2B Technology",
    category: "Corporate Website",
    excerpt: "A credible, structured B2B website for a technology company selling to procurement-driven buyers.",
    description:
      "LMK Technologies needed a corporate site that could present a complex product and service catalog to technical buyers while still feeling modern and easy to navigate.",
    challenge:
      "Dense information, inconsistent product pages, and a design that did not reflect the company's credibility. Content updates required a developer for every change.",
    strategy:
      "Create a scalable content model for products, solutions and resources, simplify navigation around buyer intent, and give the marketing team a page-builder workflow with guardrails.",
    solution:
      "WordPress with ACF-powered product and solution post types, Elementor templates for consistent layouts, resource library with filtering, and a request-a-quote flow feeding the sales team.",
    results:
      "Placeholder result: a consistent, self-serviceable corporate site with clear quote pathways. Replace with real outcomes when available.",
    keyImprovements: [
      "Structured product and solution catalog",
      "Consistent templates editable without a developer",
      "Filterable resource library",
      "Quote request flow with lead routing",
    ],
    technologies: ["WordPress", "Elementor", "ACF", "Crocoblock", "Yoast SEO"],
    services: ["UI/UX Design", "WordPress Development", "Elementor Development", "SEO"],
    projectUrl: "",
    coverImage: "/demo/projects/lmk-technologies/cover.svg",
    accentColor: "#6366f1",
    year: 2024,
    featured: false,
    published: true,
    isDemo: true,
    sortOrder: 3,
    images: [
      { url: "/demo/projects/lmk-technologies/cover.svg", alt: "LMK Technologies homepage mockup", caption: "Corporate homepage" },
      { url: "/demo/projects/lmk-technologies/inner.svg", alt: "LMK Technologies product catalog mockup", caption: "Product catalog with filters" },
    ],
  },
  {
    slug: "nautisoft-wash",
    title: "Nautisoft Wash",
    client: "Nautisoft Wash",
    industry: "Marine Services",
    category: "Landing Page & Booking",
    excerpt: "A premium landing page and booking flow for a boat and yacht detailing service.",
    description:
      "Nautisoft Wash offers professional boat washing and detailing. Their customers value care and reliability, so the site had to feel premium while making it simple to book a service.",
    challenge:
      "No online presence beyond social media, bookings handled entirely by phone and DMs, and no way to communicate packages and pricing clearly.",
    strategy:
      "A focused single-page experience: strong visuals, transparent packages, social proof, and a booking request form that captures everything needed to confirm an appointment.",
    solution:
      "Elementor landing page with a package comparison section, before/after gallery, booking form with conditional fields, and a lightweight build optimized for mobile visitors coming from Instagram.",
    results:
      "Placeholder result: a branded booking destination replacing ad-hoc DMs. Replace with real outcomes when available.",
    keyImprovements: [
      "Clear package and pricing presentation",
      "Booking request form with conditional fields",
      "Before/after gallery as proof",
      "Fast mobile experience for social traffic",
    ],
    technologies: ["WordPress", "Elementor", "CartFlows", "Rank Math"],
    services: ["Landing Page Design", "WordPress Development", "UI/UX Design"],
    projectUrl: "",
    coverImage: "/demo/projects/nautisoft-wash/cover.svg",
    accentColor: "#14b8a6",
    year: 2024,
    featured: true,
    published: true,
    isDemo: true,
    sortOrder: 4,
    images: [
      { url: "/demo/projects/nautisoft-wash/cover.svg", alt: "Nautisoft Wash landing page mockup", caption: "Landing page hero" },
      { url: "/demo/projects/nautisoft-wash/inner.svg", alt: "Nautisoft Wash packages and booking mockup", caption: "Packages and booking form" },
    ],
  },
  {
    slug: "hinkley-aesthetics",
    title: "Hinkley Aesthetics",
    client: "Hinkley Aesthetics",
    industry: "Health & Beauty",
    category: "Clinic Website",
    excerpt: "An elegant, trust-building website for a medical aesthetics clinic with treatment pages and consultation booking.",
    description:
      "Hinkley Aesthetics offers non-surgical aesthetic treatments. Prospective clients research carefully before booking, so the site needed to educate, reassure and convert without feeling clinical or salesy.",
    challenge:
      "Treatments were listed without depth, there was no clear path to a consultation, and the visual design did not match the premium in-clinic experience.",
    strategy:
      "Design an editorial, calm interface; build detailed treatment pages answering the questions clients actually ask; place consultation CTAs at natural decision points.",
    solution:
      "WordPress and Elementor build with ACF treatment templates (overview, suitability, process, aftercare, FAQ), practitioner profiles, review integration, and a consultation booking form connected to the clinic's calendar.",
    results:
      "Placeholder result: a premium, informative clinic site with clear consultation pathways. Replace with real outcomes when available.",
    keyImprovements: [
      "Structured treatment page template",
      "Consultation CTAs at decision points",
      "Practitioner credibility section",
      "Soft, editorial visual system matching the clinic",
    ],
    technologies: ["WordPress", "Elementor", "ACF", "Rank Math", "Figma"],
    services: ["UI/UX Design", "Website Design", "WordPress Development", "SEO"],
    projectUrl: "",
    coverImage: "/demo/projects/hinkley-aesthetics/cover.svg",
    accentColor: "#e11d74",
    year: 2025,
    featured: true,
    published: true,
    isDemo: true,
    sortOrder: 5,
    images: [
      { url: "/demo/projects/hinkley-aesthetics/cover.svg", alt: "Hinkley Aesthetics homepage mockup", caption: "Homepage" },
      { url: "/demo/projects/hinkley-aesthetics/inner.svg", alt: "Hinkley Aesthetics treatment page mockup", caption: "Treatment page template" },
    ],
  },
  {
    slug: "english-explorers",
    title: "English Explorers",
    client: "English Explorers",
    industry: "Education",
    category: "Education Website & Enrollment",
    excerpt: "A friendly, high-clarity website with course catalog and enrollment flow for an English language program.",
    description:
      "English Explorers runs English courses for young learners. Parents needed to quickly understand levels, schedules and pricing, then enroll without back-and-forth emails.",
    challenge:
      "Course information was scattered across PDFs and social posts, enrollment was manual, and the site did not work well on the phones most parents used.",
    strategy:
      "Organize courses by age and level, make schedules and pricing transparent, and turn enrollment into a guided online flow with payment.",
    solution:
      "WordPress with WooCommerce for course enrollment and payments, custom course post types with ACF, Elementor templates for level pages, and a mobile-first layout with large touch targets and simple navigation.",
    results:
      "Placeholder result: self-service course discovery and online enrollment. Replace with real outcomes when available.",
    keyImprovements: [
      "Courses organized by age and level",
      "Online enrollment with payment via WooCommerce",
      "Transparent schedule and pricing blocks",
      "Mobile-first parent experience",
    ],
    technologies: ["WordPress", "WooCommerce", "Elementor", "ACF", "Yoast SEO"],
    services: ["Website Design", "WordPress Development", "WooCommerce", "UI/UX Design"],
    projectUrl: "",
    coverImage: "/demo/projects/english-explorers/cover.svg",
    accentColor: "#22c55e",
    year: 2024,
    featured: false,
    published: true,
    isDemo: true,
    sortOrder: 6,
    images: [
      { url: "/demo/projects/english-explorers/cover.svg", alt: "English Explorers homepage mockup", caption: "Homepage" },
      { url: "/demo/projects/english-explorers/inner.svg", alt: "English Explorers course catalog mockup", caption: "Course catalog and enrollment" },
    ],
  },
];
