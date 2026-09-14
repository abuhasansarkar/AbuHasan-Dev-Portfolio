import type { Prisma } from "@prisma/client";

/**
 * DEMO TESTIMONIALS – placeholder content only.
 * Every entry is flagged isDemo: true and the company field says "Demo" so nothing here
 * can be mistaken for a real client statement. Replace from /admin › Testimonials.
 */
export const testimonials: Prisma.TestimonialCreateManyInput[] = [
  {
    quote:
      "Our old site looked fine but nobody called. The rebuild made the offer obvious, the page loads instantly, and quote requests went up within the first month. Placeholder testimonial – replace with a real client quote.",
    name: "Jordan Mitchell",
    role: "Owner",
    company: "Demo · Home Services Business",
    avatar: "/demo/avatars/01.svg",
    rating: 5,
    featured: true,
    isDemo: true,
    sortOrder: 1,
  },
  {
    quote:
      "We hand him Figma files and get back Elementor builds that match to the pixel and don't fall apart on mobile. He's become our go-to WordPress partner. Placeholder testimonial – replace with a real client quote.",
    name: "Priya Raman",
    role: "Creative Director",
    company: "Demo · Design Agency",
    avatar: "/demo/avatars/02.svg",
    rating: 5,
    featured: true,
    isDemo: true,
    sortOrder: 2,
  },
  {
    quote:
      "Checkout was where we lost people. After the WooCommerce optimization, abandoned carts dropped and the store finally feels premium. Placeholder testimonial – replace with a real client quote.",
    name: "Daniel Okafor",
    role: "Founder",
    company: "Demo · E-commerce Brand",
    avatar: "/demo/avatars/03.svg",
    rating: 5,
    featured: true,
    isDemo: true,
    sortOrder: 3,
  },
  {
    quote:
      "Clear communication, realistic timelines, and he explains the why behind every recommendation. Our Core Web Vitals went from red to green. Placeholder testimonial – replace with a real client quote.",
    name: "Sofia Berg",
    role: "Marketing Manager",
    company: "Demo · B2B Technology Company",
    avatar: "/demo/avatars/04.svg",
    rating: 5,
    featured: true,
    isDemo: true,
    sortOrder: 4,
  },
];
