import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";

/**
 * Projects and blog posts open in client-side overlays on this single-page
 * site, so there are no crawlable per-item routes. Emitting the same /#work
 * or /#blog anchor once per item adds duplicate URLs that crawlers discard,
 * so only real routes are listed here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicEnv.siteUrl;
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
