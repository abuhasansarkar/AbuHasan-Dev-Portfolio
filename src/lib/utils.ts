import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function estimateReadingTime(markdown: string, wordsPerMinute = 200) {
  const words = markdown.replace(/[#*`>\-\[\]()!]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

export function formatDate(date: Date | string | null | undefined, opts?: Intl.DateTimeFormatOptions) {
  if (!date) return "";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...opts,
    }).format(d);
  } catch {
    return "";
  }
}

export function formatIsoDate(date: Date | string | null | undefined): string | undefined {
  if (!date) return undefined;
  try {
    const d = new Date(date);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  } catch {
    return undefined;
  }
}

export function truncate(text: string, length = 140) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}
