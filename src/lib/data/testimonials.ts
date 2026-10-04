import "server-only";
import { unstable_cache } from "next/cache";
import type { Testimonial } from "@prisma/client";
import { prisma, safeQuery } from "@/lib/db";
import { reviveDates } from "./serialize";
import { TAGS } from "./tags";

const cachedFeaturedTestimonials = unstable_cache(
  async () => safeQuery<Testimonial[]>(() => prisma.testimonial.findMany({ where: { featured: true }, orderBy: { sortOrder: "asc" } }), []),
  ["testimonials-featured"],
  { tags: [TAGS.testimonials], revalidate: 3600 },
);

export async function getFeaturedTestimonials() {
  return reviveDates(await cachedFeaturedTestimonials());
}
