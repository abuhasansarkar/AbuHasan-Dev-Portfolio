import "server-only";

/**
 * Next.js `unstable_cache` persists results through the data cache as JSON, so Prisma
 * `DateTime` columns are read back as **ISO strings** even though the generated client types
 * them as `Date`. Calling `Date` methods (`.toISOString()`, `.getTime()`, …) on such a value
 * throws at render time — which previously broke `next build` while prerendering
 * `/work/[slug]` and `/blog/[slug]`.
 *
 * Every cached getter is wrapped in `reviveDates()` so the declared `Date` types are truthful
 * again and consumers can safely use Date methods.
 */
const DATE_KEYS = new Set(["createdAt", "updatedAt", "publishedAt", "lastLoginAt"]);

export function reviveDates<T>(value: T): T {
  if (value instanceof Date) return value;

  if (Array.isArray(value)) {
    return value.map((item) => reviveDates(item)) as unknown as T;
  }

  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (typeof val === "string" && DATE_KEYS.has(key)) {
        const parsed = new Date(val);
        out[key] = Number.isNaN(parsed.getTime()) ? val : parsed;
      } else {
        out[key] = reviveDates(val);
      }
    }
    return out as T;
  }

  return value;
}
