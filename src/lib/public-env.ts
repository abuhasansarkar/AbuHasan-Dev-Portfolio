/**
 * Browser-safe configuration.
 *
 * Kept in its own module (no zod, no server schema) so client components can import it
 * without pulling server-only env validation into the bundle. Only NEXT_PUBLIC_* values
 * may live here.
 */
const rawSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/**
 * Guard against the classic production mistake of shipping the localhost URL: it is baked
 * into canonical tags, JSON-LD, sitemap and robots. We warn (never throw) so that preview
 * deployments can still build.
 */
if (process.env.NODE_ENV === "production" && /localhost|127\.0\.0\.1/.test(rawSiteUrl)) {
  console.warn(
    `[env] NEXT_PUBLIC_SITE_URL is "${rawSiteUrl}". Set it to your real HTTPS domain before ` +
      "building for production, otherwise canonical URLs, sitemap.xml, robots.txt and OG tags will be wrong.",
  );
}

export const publicEnv = {
  siteUrl: rawSiteUrl,
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  /** Cloudflare Turnstile site key. Empty = the contact form runs without a challenge. */
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
  /** Sentry client DSN. Empty = the SDK is disabled in the browser bundle. */
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  imagekit: {
    // Browser-safe values only. No credentials are hardcoded – these must be
    // provided via NEXT_PUBLIC_* environment variables (see .env.example).
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    folderName: process.env.IMAGEKIT_FOLDER_NAME || "Developer-Portfolio",
  },
} as const;
