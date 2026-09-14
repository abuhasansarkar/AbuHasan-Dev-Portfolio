import "server-only";
import { unstable_cache } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma, safeQuery } from "@/lib/db";
import { TAGS } from "./tags";

export type ProjectWithImages = Prisma.ProjectGetPayload<{ include: { images: true } }>;

export const getPublishedProjects = unstable_cache(
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
