import { z } from "zod";

const link = z.object({ label: z.string().min(1), href: z.string().min(1) });

export const profileSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  tagline: z.string().min(1),
  location: z.string().default(""),
  availability: z.string().default(""),
  avatar: z.string().default(""),
});

export const heroSchema = z.object({
  label: z.string().min(1),
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  primaryCta: link,
  secondaryCta: link,
  tertiaryLink: link,
});

export const aboutSchema = z.object({
  headline: z.string().min(1),
  intro: z.string().min(1),
  body: z.array(z.string()).default([]),
  focusAreas: z.array(z.string()).default([]),
  currentlyFocusedOn: z.array(z.string()).default([]),
});

export const statSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  numeric: z.number().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
});
export const statsSchema = z.array(statSchema);

export const socialSchema = z.object({
  linkedin: z.string().default(""),
  github: z.string().default(""),
  upwork: z.string().default(""),
  dribbble: z.string().default(""),
  behance: z.string().default(""),
  email: z.string().default(""),
});

export const ctaSchema = z.object({
  navLabel: z.string().min(1),
  bannerHeadline: z.string().min(1),
  bannerBody: z.string().default(""),
  bannerButton: z.string().min(1),
});

export const contactSchema = z.object({
  headline: z.string().min(1),
  body: z.string().default(""),
  buttonLabel: z.string().min(1),
  projectTypes: z.array(z.string().min(1)).min(1),
  budgetRanges: z.array(z.string().min(1)).min(1),
  responseTime: z.string().default(""),
});

export const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  keywords: z.array(z.string()).default([]),
  ogImage: z.string().default(""),
});

export const settingsSchema = z.object({
  profile: profileSchema,
  hero: heroSchema,
  about: aboutSchema,
  stats: statsSchema,
  social: socialSchema,
  cta: ctaSchema,
  contact: contactSchema,
  seo: seoSchema,
});

export type SiteSettings = z.infer<typeof settingsSchema>;
export type SettingsKey = keyof SiteSettings;
export const settingsKeys = Object.keys(settingsSchema.shape) as SettingsKey[];
