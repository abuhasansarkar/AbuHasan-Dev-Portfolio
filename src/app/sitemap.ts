import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/data/posts";
import { getPublishedProjects } from "@/lib/data/projects";
import { publicEnv } from "@/lib/env";

/**
 * The home page plus every crawlable `/work/[slug]` and `/blog/[slug]` route.
 * The `#project=` / `#post=` hash deep-links are intentionally left out — they
 * are client-side overlay state on `/`, not separate crawlable URLs.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = publicEnv.siteUrl;
  const [{ data: projects }, { data: posts }] = await Promise.all([getPublishedProjects(), getPublishedPosts()]);

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...(projects ?? []).map((project) => ({
      url: `${base}/work/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...(posts ?? []).map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
