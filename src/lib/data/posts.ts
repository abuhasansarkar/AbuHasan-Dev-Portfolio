import "server-only";
import { unstable_cache } from "next/cache";
import type { BlogCategory, Prisma } from "@prisma/client";
import { prisma, safeQuery } from "@/lib/db";
import { reviveDates } from "./serialize";
import { TAGS } from "./tags";

export type PostWithCategory = Prisma.BlogPostGetPayload<{ include: { category: true } }>;

type PostListResult = { data: PostWithCategory[]; error: boolean };
type PostResult = { data: PostWithCategory | null; error: boolean };

/** Public list: published posts only, newest first. Content included so overlays open instantly without a second request. */
const cachedPublishedPosts = unstable_cache(
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

export async function getPublishedPosts(): Promise<PostListResult> {
  return reviveDates(await cachedPublishedPosts());
}

export const getBlogCategories = unstable_cache(
  async () => safeQuery<BlogCategory[]>(() => prisma.blogCategory.findMany({ orderBy: { sortOrder: "asc" } }), []),
  ["blog-categories"],
  { tags: [TAGS.posts], revalidate: 3600 },
);

/** Single published post for the crawlable `/blog/[slug]` route. */
const cachedPostBySlug = (slug: string) =>
  unstable_cache(
    async () =>
      safeQuery<PostWithCategory | null>(
        () =>
          prisma.blogPost.findFirst({
            where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } },
            include: { category: true },
          }),
        null,
      ),
    ["post-by-slug", slug],
    { tags: [TAGS.posts], revalidate: 3600 },
  );

export async function getPublishedPostBySlug(slug: string): Promise<PostResult> {
  return reviveDates(await cachedPostBySlug(slug)());
}

