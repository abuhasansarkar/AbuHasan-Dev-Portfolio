export type ProcessStep = { title: string; description: string; deliverables: string[] };

export const processSteps: ProcessStep[] = [
  {
    title: "Discover",
    description: "Understand the business, the audience, the offer and what a successful website has to do for you.",
    deliverables: ["Kickoff call", "Goals & KPIs", "Content and competitor audit"],
  },
  {
    title: "Strategy",
    description: "Define the conversion goals, page structure and messaging priorities before a single pixel is placed.",
    deliverables: ["Sitemap", "Page-level goals", "Conversion map"],
  },
  {
    title: "UX / Wireframe",
    description: "Lay out the flow and hierarchy in low fidelity so decisions are about clarity, not colors.",
    deliverables: ["Wireframes", "User flows", "Content outline"],
  },
  {
    title: "Design",
    description: "A visual system that fits the brand, feels premium and makes the next step obvious on every screen size.",
    deliverables: ["Figma design", "Component library", "Responsive views"],
  },
  {
    title: "Development",
    description: "Pixel-perfect build in WordPress, Framer, Webflow or custom code, with performance and SEO handled from the start.",
    deliverables: ["Staging build", "CMS setup", "Integrations & forms"],
  },
  {
    title: "Optimize & Launch",
    description: "QA across devices, Core Web Vitals, technical SEO, analytics, then launch and a proper handover.",
    deliverables: ["QA checklist", "Performance pass", "Launch & training"],
  },
];
