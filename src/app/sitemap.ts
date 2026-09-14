import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { publicEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = publicEnv.siteUrl;

  const [projects, posts] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { sortOrder: "asc" },
    }).catch(() => []),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    }).catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Projects are viewed via case-study overlay on the single-page site.
  // We include canonical anchor URLs so crawlers can discover them.
  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/#work`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Blog posts open in an overlay; include the base blog anchor.
  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/#blog`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Deduplicate (overlay URLs are all the same anchor; keep one per type)
  const seen = new Set<string>();
  const all = [...staticRoutes, ...projectRoutes, ...postRoutes].filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });

  return all;
}
