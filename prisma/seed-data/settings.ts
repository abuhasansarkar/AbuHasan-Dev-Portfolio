/**
 * Site settings seed. Shape mirrors the zod schemas in src/lib/settings/schema.ts.
 * Everything here is editable from /admin › Site Settings.
 */
export const siteSettings = {
  profile: {
    name: "AbuHasan",
    role: "Full-Stack Web Developer · WordPress Developer",
    tagline: "Full-Stack Web Developer · WordPress · UI/UX",
    location: "Working with local and international clients",
    availability: "Available for new projects",
    avatar: "/demo/avatar.svg",
  },
  hero: {
    label: "Full-Stack Web Developer · WordPress · UI/UX",
    headline: "Building digital experiences that turn attention into action.",
    subheadline:
      "Full-Stack Web Developer, WordPress Designer & Developer, and UI/UX Designer helping businesses and agencies build fast, conversion-focused websites.",
    primaryCta: { label: "View My Work", href: "#work" },
    secondaryCta: { label: "Start a Project", href: "#contact" },
    tertiaryLink: { label: "Explore Services", href: "#services" },
  },
  about: {
    headline: "I build websites as business tools — not just pretty pages.",
    intro:
      "I'm AbuHasan, a Full-Stack Web Developer and WordPress Designer & Developer with 4+ years of experience building websites that are measured by what they do for a business, not just how they look.",
    body: [
      "Most websites fail quietly. They load slowly, confuse visitors, and bury the one action that matters. My work starts from the opposite direction: what should a visitor do, and what is stopping them from doing it?",
      "From that answer I design and build the site — WordPress, Elementor, WooCommerce, Framer, Webflow or fully custom code — with clean structure, fast performance and SEO built in from the first commit.",
      "I've worked with local businesses and international clients across service industries, e-commerce, education, health and technology, both directly and as a white-label partner for agencies.",
    ],
    focusAreas: [
      "Conversion-focused design",
      "WordPress",
      "Elementor",
      "WooCommerce",
      "UI/UX",
      "Landing pages",
      "SEO",
      "Performance optimization",
      "Framer",
      "Webflow",
      "Custom development",
    ],
    currentlyFocusedOn: [
      "High-converting landing page systems for service businesses",
      "WordPress performance and Core Web Vitals",
      "Next.js builds for clients who outgrow page builders",
    ],
  },
  stats: [
    { value: "4+", label: "Years Experience", numeric: 4, suffix: "+" },
    { value: "50+", label: "High-Conversion Websites & Landing Pages in Recent Work", numeric: 50, suffix: "+" },
    { value: "Multiple", label: "Industries & Business Types" },
    { value: "Local + International", label: "Client Experience" },
  ],
  social: {
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    upwork: "https://www.upwork.com/",
    dribbble: "",
    behance: "",
    email: "",
  },
  cta: {
    navLabel: "Let's Work Together",
    bannerHeadline: "Let's build something that performs.",
    bannerBody:
      "Whether you need a new website, a landing page that converts, or a WordPress site that finally loads fast — I can help.",
    bannerButton: "Start a Project",
  },
  contact: {
    headline: "Have a website that needs to perform better?",
    body: "Tell me what you're building, fixing, or improving.",
    buttonLabel: "Start a Conversation",
    projectTypes: [
      "New website",
      "Website redesign",
      "Landing page",
      "WordPress / Elementor",
      "WooCommerce store",
      "Framer / Webflow",
      "SEO & performance",
      "Troubleshooting / fixes",
      "Agency partnership",
      "Something else",
    ],
    budgetRanges: ["Under $500", "$500 – $1,500", "$1,500 – $3,000", "$3,000 – $6,000", "$6,000+", "Not sure yet"],
    responseTime: "I usually reply within one business day.",
  },
  seo: {
    title: "AbuHasan · Full-Stack Web Developer & WordPress Developer",
    description:
      "Conversion-focused websites, WordPress and Elementor development, WooCommerce, UI/UX, SEO and performance optimization for businesses and agencies.",
    keywords: [
      "WordPress developer",
      "Elementor developer",
      "full-stack web developer",
      "landing page designer",
      "WooCommerce developer",
      "UI/UX designer",
      "website performance optimization",
    ],
    ogImage: "/og-default.png",
  },
} as const;
