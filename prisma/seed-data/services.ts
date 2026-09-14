import type { Prisma } from "@prisma/client";

/** Icon names map to lucide-react icons resolved in src/components/services/service-icon.tsx */
export const services: Prisma.ServiceCreateInput[] = [
  {
    slug: "website-design",
    title: "Website Design",
    description: "Conversion-focused website design for businesses, startups and agencies.",
    details:
      "Every layout decision is tied to a goal: a call, a booking, a purchase, a quote request. I design the structure, hierarchy and messaging first, then the visual layer, so the finished site looks premium and moves visitors toward action.",
    icon: "layout-template",
    features: ["Conversion-led information architecture", "Visual hierarchy & messaging", "Mobile-first layouts", "Design systems that scale"],
    sortOrder: 1,
  },
  {
    slug: "wordpress-development",
    title: "WordPress Development",
    description: "Custom WordPress websites, Elementor development, theme customization and complex WordPress solutions.",
    details:
      "From clean marketing sites to custom post types, ACF-driven content models and integrations, I build WordPress the maintainable way: lean plugins, documented settings, and no mystery code your team can't touch later.",
    icon: "blocks",
    features: ["Custom themes & child themes", "ACF, custom post types & taxonomies", "Plugin integration & clean-up", "Migrations & rebuilds"],
    sortOrder: 2,
  },
  {
    slug: "elementor-development",
    title: "Elementor Development",
    description: "Pixel-perfect Elementor implementation from Figma or custom designs.",
    details:
      "I translate Figma, XD or Sketch designs into Elementor builds that match the source to the pixel, stay responsive on every breakpoint, and avoid the bloat that makes most Elementor sites slow.",
    icon: "pencil-ruler",
    features: ["Figma to Elementor", "Global styles & reusable templates", "Theme Builder headers, footers & archives", "Performance-minded builds"],
    sortOrder: 3,
  },
  {
    slug: "landing-pages",
    title: "Landing Page Design",
    description: "High-converting landing pages focused on leads, sales and campaign performance.",
    details:
      "Single-goal pages for ads, launches and lead generation. Clear offer, strong proof, one CTA, fast load. Built to be tested and iterated, not set-and-forget.",
    icon: "target",
    features: ["Offer & message clarity", "Above-the-fold optimization", "Form & CTA design", "A/B-test ready structure"],
    sortOrder: 4,
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    description: "Modern interfaces, user journeys, wireframes, visual systems and conversion-oriented UX.",
    details:
      "Research-light, decision-heavy UX. I map the user journey, wireframe the flow, and design interfaces that reduce friction at every step, then hand off (or build) with a component system that stays consistent.",
    icon: "pen-tool",
    features: ["User journeys & wireframes", "High-fidelity UI in Figma", "Component libraries", "Usability & conversion reviews"],
    sortOrder: 5,
  },
  {
    slug: "woocommerce",
    title: "WooCommerce",
    description: "E-commerce stores, product pages, checkout optimization and conversion improvements.",
    details:
      "Stores that are easy to run and easy to buy from: clear product pages, trust signals where doubt appears, streamlined checkout, and the speed a shop needs to keep customers from bouncing.",
    icon: "shopping-bag",
    features: ["Store setup & product architecture", "Product page & checkout optimization", "CartFlows funnels & upsells", "Payments, shipping & tax configuration"],
    sortOrder: 6,
  },
  {
    slug: "framer-webflow",
    title: "Framer & Webflow",
    description: "Modern no-code/visual website development.",
    details:
      "When a client wants speed, motion and easy editing without WordPress, I build in Framer or Webflow with clean CMS structures, polished interactions and production-grade SEO settings.",
    icon: "sparkles",
    features: ["Framer & Webflow builds", "CMS collections & dynamic pages", "Interactions & animation", "SEO & performance configuration"],
    sortOrder: 7,
  },
  {
    slug: "seo",
    title: "SEO",
    description: "Technical SEO, on-page SEO and structured data that help the right people find you.",
    details:
      "Search visibility is engineered, not sprinkled on. I fix crawl and indexing issues, structure content and headings properly, implement schema, and configure Rank Math or Yoast the right way.",
    icon: "search",
    features: ["Technical SEO audits", "On-page & content structure", "Schema / structured data", "Rank Math & Yoast configuration"],
    sortOrder: 8,
  },
  {
    slug: "performance-optimization",
    title: "Performance Optimization",
    description: "Website speed optimization, Core Web Vitals and performance improvements.",
    details:
      "Slow sites lose leads. I diagnose what actually causes slowness (render-blocking scripts, unoptimized media, heavy plugins, poor hosting) and fix it in priority order, measured against Core Web Vitals.",
    icon: "gauge",
    features: ["Core Web Vitals (LCP, INP, CLS)", "Image, font & script optimization", "Caching, CDN & hosting tuning", "Plugin & database clean-up"],
    sortOrder: 9,
  },
  {
    slug: "troubleshooting",
    title: "Website Troubleshooting",
    description: "WordPress bugs, responsive issues, layout problems, plugin conflicts and performance problems.",
    details:
      "Something broke, looks wrong on mobile, or slowed to a crawl after an update. I find the root cause quickly, fix it properly, and tell you what to avoid next time.",
    icon: "wrench",
    features: ["Bug fixing & error resolution", "Responsive & layout fixes", "Plugin & theme conflicts", "Security clean-up & hardening"],
    sortOrder: 10,
  },
];
