/** Technology stack shown in the Expertise section. Static by design; edit here. */
export type TechGroup = { id: string; label: string; items: string[] };

export const techGroups: TechGroup[] = [
  {
    id: "wordpress",
    label: "WordPress ecosystem",
    items: ["WordPress", "Elementor", "WooCommerce", "Divi", "ACF", "Crocoblock", "CartFlows", "Rank Math", "Yoast SEO"],
  },
  {
    id: "design",
    label: "Design & visual development",
    items: ["Figma", "Framer", "Webflow", "HTML", "CSS", "Tailwind CSS"],
  },
  {
    id: "code",
    label: "Custom development",
    items: ["JavaScript", "React", "Next.js", "Node.js", "Express.js", "REST APIs"],
  },
];

export const allTech = techGroups.flatMap((g) => g.items);
