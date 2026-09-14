import "server-only";
import { unstable_cache } from "next/cache";
import type { BlogCategory, Prisma } from "@prisma/client";
import { prisma, safeQuery } from "@/lib/db";
import { TAGS } from "./tags";

export type PostWithCategory = Prisma.BlogPostGetPayload<{ include: { category: true } }>;

/** Public list: published posts only, newest first. Content included so overlays open instantly without a second request. */
export const getPublishedPosts = unstable_cache(
  async () =>
    safeQuery<PostWithCategory[]>(
      () =>
        prisma.blogPost.findMany({
          where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
          include: { category: true },
          orderBy: [{ publishedAt: "desc" }],
        }),
      [],
    ),
  ["posts-published"],
  { tags: [TAGS.posts], revalidate: 3600 },
);

export const getBlogCategories = unstable_cache(
  async () => safeQuery<BlogCategory[]>(() => prisma.blogCategory.findMany({ orderBy: { sortOrder: "asc" } }), []),
  ["blog-categories"],
  { tags: [TAGS.posts], revalidate: 3600 },
);
