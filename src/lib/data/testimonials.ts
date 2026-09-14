import "server-only";
import { unstable_cache } from "next/cache";
import type { Testimonial } from "@prisma/client";
import { prisma, safeQuery } from "@/lib/db";
import { TAGS } from "./tags";

export const getFeaturedTestimonials = unstable_cache(
  async () => safeQuery<Testimonial[]>(() => prisma.testimonial.findMany({ where: { featured: true }, orderBy: { sortOrder: "asc" } }), []),
  ["testimonials-featured"],
  { tags: [TAGS.testimonials], revalidate: 3600 },
);
