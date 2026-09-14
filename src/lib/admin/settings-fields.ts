import type { SettingsKey } from "@/lib/settings/schema";

export type FieldDef = {
  /** Dot path inside the section object. Empty string means the whole section (used by "stats"). */
  path: string;
  label: string;
  type: "text" | "textarea" | "lines" | "stats";
  hint?: string;
};

export type SettingsSection = { key: SettingsKey; title: string; description: string; fields: FieldDef[] };

const link = (path: string, label: string): FieldDef[] => [
  { path: `${path}.label`, label: `${label} label`, type: "text" },
  { path: `${path}.href`, label: `${label} link`, type: "text", hint: "Use #section for on-page anchors." },
];

export const settingsSections: SettingsSection[] = [
  {
    key: "profile",
    title: "Profile",
    description: "Name and role used in the navigation, about card and footer.",
    fields: [
      { path: "name", label: "Name", type: "text" },
      { path: "role", label: "Role", type: "text" },
      { path: "tagline", label: "Footer tagline", type: "text" },
      { path: "location", label: "Location / based", type: "text" },
      { path: "availability", label: "Availability", type: "text", hint: "Shown as a status pill. Leave empty to hide." },
      { path: "avatar", label: "Avatar image", type: "text" },
    ],
  },
  {
    key: "hero",
    title: "Hero",
    description: "The first thing visitors read.",
    fields: [
      { path: "label", label: "Small label", type: "text" },
      { path: "headline", label: "Headline", type: "textarea" },
      { path: "subheadline", label: "Supporting text", type: "textarea" },
      ...link("primaryCta", "Primary button"),
      ...link("secondaryCta", "Secondary button"),
      ...link("tertiaryLink", "Text link"),
    ],
  },
  {
    key: "about",
    title: "About",
    description: "Storytelling section and focus areas.",
    fields: [
      { path: "headline", label: "Headline", type: "textarea" },
      { path: "intro", label: "Intro paragraph", type: "textarea" },
      { path: "body", label: "Body paragraphs", type: "lines", hint: "One paragraph per line." },
      { path: "focusAreas", label: "Focus areas", type: "lines", hint: "One per line. Also feeds the marquee." },
      { path: "currentlyFocusedOn", label: "Currently focused on", type: "lines", hint: "One per line." },
    ],
  },
  {
    key: "stats",
    title: "Stats",
    description: "Animated metrics. Keep claims realistic.",
    fields: [{ path: "", label: "Stats", type: "stats", hint: "One per line: value | label | numeric (optional, enables counting) | suffix (optional). Example: 4+ | Years Experience | 4 | +" }],
  },
  {
    key: "social",
    title: "Social links",
    description: "Empty fields are hidden on the site.",
    fields: [
      { path: "linkedin", label: "LinkedIn", type: "text" },
      { path: "github", label: "GitHub", type: "text" },
      { path: "upwork", label: "Upwork", type: "text" },
      { path: "dribbble", label: "Dribbble", type: "text" },
      { path: "behance", label: "Behance", type: "text" },
      { path: "email", label: "Public email", type: "text", hint: "Shown in the contact section. Leave empty to hide." },
    ],
  },
  {
    key: "cta",
    title: "Calls to action",
    description: "Navigation button and the banner above the contact form.",
    fields: [
      { path: "navLabel", label: "Navigation button", type: "text" },
      { path: "bannerHeadline", label: "Banner headline", type: "textarea" },
      { path: "bannerBody", label: "Banner text", type: "textarea" },
      { path: "bannerButton", label: "Banner button", type: "text" },
    ],
  },
  {
    key: "contact",
    title: "Contact form",
    description: "Copy and dropdown options.",
    fields: [
      { path: "headline", label: "Headline", type: "textarea" },
      { path: "body", label: "Supporting copy", type: "text" },
      { path: "buttonLabel", label: "Submit button", type: "text" },
      { path: "projectTypes", label: "Project types", type: "lines", hint: "One per line." },
      { path: "budgetRanges", label: "Budget ranges", type: "lines", hint: "One per line." },
      { path: "responseTime", label: "Response time note", type: "text" },
    ],
  },
  {
    key: "seo",
    title: "SEO",
    description: "Default metadata for the homepage.",
    fields: [
      { path: "title", label: "Title", type: "text" },
      { path: "description", label: "Meta description", type: "textarea" },
      { path: "keywords", label: "Keywords", type: "lines", hint: "One per line." },
      { path: "ogImage", label: "Default Open Graph image", type: "text", hint: "Leave empty to use the generated image." },
    ],
  },
];

type Stat = { value: string; label: string; numeric?: number; suffix?: string; prefix?: string };

export function statsToText(stats: Stat[]) {
  return stats.map((s) => [s.value, s.label, s.numeric ?? "", s.suffix ?? ""].join(" | ").replace(/(\s\|\s)+$/, "")).join("\n");
}

export function textToStats(text: string): Stat[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [value = "", label = "", numeric = "", suffix = ""] = line.split("|").map((s) => s.trim());
      const n = Number(numeric);
      return { value, label, ...(numeric && Number.isFinite(n) ? { numeric: n } : {}), ...(suffix ? { suffix } : {}) };
    });
}
