import { z } from "zod";
import { AUTH_SECRET_MIN_LENGTH } from "@/lib/auth/token";

/**
 * Server-only environment variables.
 * Parsed lazily so that `next build` does not fail when optional values are absent.
 */
const serverSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_URL_UNPOOLED: z.string().optional(),
  AUTH_SECRET: z
    .string()
    .min(AUTH_SECRET_MIN_LENGTH, `AUTH_SECRET must be at least ${AUTH_SECRET_MIN_LENGTH} characters`),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  ADMIN_NAME: z.string().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  IMAGEKIT_PRIVATE_KEY: z.string().optional(),
  IMAGEKIT_ID: z.string().optional(),
  IMAGEKIT_FOLDER_NAME: z.string().optional().default("Developer-Portfolio"),
  IMAGEKIT_FOLDER_ID: z.string().optional(),
  BREVO_API_KEY: z.string().optional(),
  BREVO_SENDER_EMAIL: z.string().email().optional().or(z.literal("")),
  BREVO_SENDER_NAME: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  /** Sentry error tracking DSN. Optional – SDK stays disabled without it. */
  SENTRY_DSN: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

let cached: z.infer<typeof serverSchema> | null = null;

export function getServerEnv() {
  if (cached) return cached;
  const parsed = serverSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED || undefined,
    AUTH_SECRET: process.env.AUTH_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || undefined,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || undefined,
    ADMIN_NAME: process.env.ADMIN_NAME || undefined,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN || undefined,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || undefined,
    IMAGEKIT_ID: process.env.IMAGEKIT_ID || undefined,
    IMAGEKIT_FOLDER_NAME: process.env.IMAGEKIT_FOLDER_NAME || undefined,
    IMAGEKIT_FOLDER_ID: process.env.IMAGEKIT_FOLDER_ID || undefined,
    BREVO_API_KEY: process.env.BREVO_API_KEY || undefined,
    BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL || undefined,
    BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME || undefined,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || undefined,
    SENTRY_DSN: process.env.SENTRY_DSN || undefined,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || undefined,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || undefined,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid environment configuration:\n${issues}\nSee .env.example for reference.`);
  }

  cached = parsed.data;
  return cached;
}

/** Public (browser-safe) configuration. Only NEXT_PUBLIC_* values belong here. */
/** Re-export so existing server-side imports keep working. */
export { publicEnv } from "./public-env";
