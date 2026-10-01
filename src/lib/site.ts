import { publicEnv } from "@/lib/env";

/** Static site identity. Editable copy lives in SiteSetting (admin › Site Settings). */
export const siteConfig = {
  name: "AbuHasan",
  shortTitle: "AbuHasan · Full-Stack Web Developer & WordPress Developer",
  description:
    "Full-Stack Web Developer, WordPress Designer & Developer, and UI/UX Designer helping businesses and agencies build fast, conversion-focused websites.",
  url: publicEnv.siteUrl,
  locale: "en_US",
  twitterHandle: "",
} as const;

/**
 * Section links are root-absolute (`/#section`) so they work from the
 * single-page home view *and* from the crawlable `/work/[slug]` and
 * `/blog/[slug]` detail routes. From a detail route the browser performs a
 * full navigation back to the home section; the smooth-scroll provider only
 * intercepts them when the home page is already loaded.
 */
export const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Process", href: "/#process" },
  { label: "Blog", href: "/#blog" },
  { label: "Contact", href: "/#contact" },
] as const;

export const sectionIds = [
  "hero",
  "about",
  "services",
  "expertise",
  "work",
  "transformation",
  "process",
  "why",
  "testimonials",
  "blog",
  "faq",
  "contact",
] as const;

export type SectionId = (typeof sectionIds)[number];
