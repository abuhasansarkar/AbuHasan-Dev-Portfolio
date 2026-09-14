import "server-only";
import { unstable_cache } from "next/cache";
import type { Service } from "@prisma/client";
import { prisma, safeQuery } from "@/lib/db";
import { TAGS } from "./tags";

export const getActiveServices = unstable_cache(
  async () => safeQuery<Service[]>(() => prisma.service.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }), []),
  ["services-active"],
  { tags: [TAGS.services], revalidate: 3600 },
);
