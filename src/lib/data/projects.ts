import "server-only";
import { unstable_cache } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma, safeQuery } from "@/lib/db";
import { reviveDates } from "./serialize";
import { TAGS } from "./tags";

export type ProjectWithImages = Prisma.ProjectGetPayload<{ include: { images: true } }>;

type ProjectListResult = { data: ProjectWithImages[]; error: boolean };
type ProjectResult = { data: ProjectWithImages | null; error: boolean };

/** Cached list of published projects. NOTE: dates are revived after the cache read (see ./serialize). */
const cachedPublishedProjects = unstable_cache(
  async () =>
    safeQuery<ProjectWithImages[]>(
      () =>
        prisma.project.findMany({
          where: { published: true },
          include: { images: { orderBy: { sortOrder: "asc" } } },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        }),
      [],
    ),
  ["projects-published"],
  { tags: [TAGS.projects], revalidate: 3600 },
);

export async function getPublishedProjects(): Promise<ProjectListResult> {
  return reviveDates(await cachedPublishedProjects());
}

/** Single published project for the crawlable `/work/[slug]` route. */
const cachedProjectBySlug = (slug: string) =>
  unstable_cache(
    async () =>
      safeQuery<ProjectWithImages | null>(
        () =>
          prisma.project.findFirst({
            where: { slug, published: true },
            include: { images: { orderBy: { sortOrder: "asc" } } },
          }),
        null,
      ),
    ["project-by-slug", slug],
    { tags: [TAGS.projects], revalidate: 3600 },
  );

export async function getPublishedProjectBySlug(slug: string): Promise<ProjectResult> {
  return reviveDates(await cachedProjectBySlug(slug)());
}

