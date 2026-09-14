import type { z } from "zod";

export const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
export const optStr = (fd: FormData, key: string) => str(fd, key) || undefined;
export const bool = (fd: FormData, key: string) => fd.get(key) === "on" || fd.get(key) === "true";
export const int = (fd: FormData, key: string, fallback = 0) => {
  const n = Number.parseInt(str(fd, key), 10);
  return Number.isFinite(n) ? n : fallback;
};
export const optInt = (fd: FormData, key: string) => {
  const s = str(fd, key);
  if (!s) return undefined;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : undefined;
};
/** Newline-separated list */
export const lines = (fd: FormData, key: string) =>
  str(fd, key)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
/** Comma-separated list */
export const csv = (fd: FormData, key: string) =>
  str(fd, key)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

/** Set a nested value using dot notation ("hero.primaryCta.label") */
export function setPath(target: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split(".");
  let cur: Record<string, unknown> = target;
  parts.forEach((p, i) => {
    if (i === parts.length - 1) {
      cur[p] = value;
    } else {
      if (typeof cur[p] !== "object" || cur[p] === null) cur[p] = {};
      cur = cur[p] as Record<string, unknown>;
    }
  });
}

export function getPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, p) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[p] : undefined), source);
}
