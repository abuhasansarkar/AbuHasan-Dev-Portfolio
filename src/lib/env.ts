import { z } from "zod";

/**
 * Server-only environment variables.
 * Parsed lazily so that `next build` does not fail when optional values are absent.
 */
const serverSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 characters"),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  ADMIN_NAME: z.string().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  IMAGEKIT_PRIVATE_KEY: z.string().optional(),
  IMAGEKIT_ID: z.string().optional(),
  IMAGEKIT_FOLDER_NAME: z.string().optional().default("Developer-Portfolio"),
  IMAGEKIT_FOLDER_ID: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

let cached: z.infer<typeof serverSchema> | null = null;

export function getServerEnv() {
  if (cached) return cached;
  const parsed = serverSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || undefined,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || undefined,
    ADMIN_NAME: process.env.ADMIN_NAME || undefined,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN || undefined,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || undefined,
    IMAGEKIT_ID: process.env.IMAGEKIT_ID || undefined,
    IMAGEKIT_FOLDER_NAME: process.env.IMAGEKIT_FOLDER_NAME || undefined,
    IMAGEKIT_FOLDER_ID: process.env.IMAGEKIT_FOLDER_ID || undefined,
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
export const publicEnv = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  imagekit: {
    // Browser-safe values only. No credentials are hardcoded – these must be
    // provided via NEXT_PUBLIC_* environment variables (see .env.example).
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    folderName: process.env.IMAGEKIT_FOLDER_NAME || "Developer-Portfolio",
  },
} as const;
