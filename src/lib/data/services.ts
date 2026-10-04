import "server-only";
import { unstable_cache } from "next/cache";
import type { Service } from "@prisma/client";
import { prisma, safeQuery } from "@/lib/db";
import { reviveDates } from "./serialize";
import { TAGS } from "./tags";

const cachedActiveServices = unstable_cache(
  async () => safeQuery<Service[]>(() => prisma.service.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }), []),
  ["services-active"],
  { tags: [TAGS.services], revalidate: 3600 },
);

export async function getActiveServices() {
  return reviveDates(await cachedActiveServices());
}
