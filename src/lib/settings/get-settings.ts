import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { siteSettings as defaults } from "../../../prisma/seed-data/settings";
import { settingsSchema, type SiteSettings } from "./schema";

export const SETTINGS_TAG = "site-settings";

const defaultSettings: SiteSettings = settingsSchema.parse(defaults);

/** Uncached: reads settings from the database and merges them over seed defaults, key by key. */
export async function loadSettingsUncached(): Promise<SiteSettings> {
  try {
    const rows = await prisma.siteSetting.findMany();
    const merged: Record<string, unknown> = { ...defaultSettings };
    for (const row of rows) merged[row.key] = row.value;

    const parsed = settingsSchema.safeParse(merged);
    if (parsed.success) return parsed.data;

    console.warn("[settings] invalid stored settings, falling back per-key", parsed.error.flatten().fieldErrors);
    const result = { ...defaultSettings } as Record<string, unknown>;
    for (const key of Object.keys(settingsSchema.shape) as (keyof SiteSettings)[]) {
      const single = settingsSchema.shape[key].safeParse(merged[key]);
      if (single.success) result[key] = single.data;
    }
    return result as SiteSettings;
  } catch (err) {
    console.error("[settings] database unavailable, using defaults:", err instanceof Error ? err.message : err);
    return defaultSettings;
  }
}

/** Cached for the public site. Invalidated by admin saves via SETTINGS_TAG. */
export const getSiteSettings = unstable_cache(loadSettingsUncached, ["site-settings"], { tags: [SETTINGS_TAG], revalidate: 3600 });

export { defaultSettings };
