/**
 * Technology stack shown in the Expertise section. Static by design; edit here.
 *
 * `color` is raw HSL channels ("H S% L%") used to colour each ecosystem's ring, its chips and
 * its legend entry, so every group is instantly readable as a family.
 */
export type TechGroup = {
  id: string;
  label: string;
  /** Compact label used in the orbit legend / core hub. */
  short: string;
  /** HSL channels, e.g. "205 92% 56%". */
  color: string;
  items: string[];
};

export const techGroups: TechGroup[] = [
  {
    id: "wordpress",
    label: "WordPress ecosystem",
    short: "WordPress",
    color: "205 92% 56%",
    items: ["WordPress", "Elementor", "WooCommerce", "Divi", "ACF", "Crocoblock", "CartFlows", "Rank Math", "Yoast SEO"],
  },
  {
    id: "design",
    label: "Design & visual development",
    short: "Design & no-code",
    color: "266 84% 66%",
    items: ["Figma", "Framer", "Webflow", "HTML", "CSS", "Tailwind CSS"],
  },
  {
    id: "code",
    label: "Custom development",
    short: "Custom code",
    color: "24 96% 56%",
    items: ["JavaScript", "React", "Next.js", "Node.js", "Express.js", "REST APIs"],
  },
];

export const allTech = techGroups.flatMap((g) => g.items);

