"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import type { ActionState } from "@/lib/admin/action-state";
import { bool, fieldErrors, int, optInt, optStr, str } from "@/lib/admin/form-data";
import { testimonialSchema } from "@/lib/validation/admin";
import { revalidatePublic } from "./revalidate";

export async function saveTestimonial(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();
  const parsed = testimonialSchema.safeParse({
    id: optStr(fd, "id"),
    quote: str(fd, "quote"),
    name: str(fd, "name"),
    role: str(fd, "role"),
    company: str(fd, "company"),
    avatar: str(fd, "avatar"),
    rating: optInt(fd, "rating"),
    featured: bool(fd, "featured"),
    isDemo: bool(fd, "isDemo"),
    sortOrder: int(fd, "sortOrder", 0),
  });
  if (!parsed.success) return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };

  const { id, ...data } = parsed.data;
  const payload = { ...data, avatar: data.avatar || null, rating: data.rating ?? null };
  try {
    if (id) await prisma.testimonial.update({ where: { id }, data: payload });
    else await prisma.testimonial.create({ data: payload });
  } catch (err) {
    console.error("[admin/testimonials] save failed:", err instanceof Error ? err.message : err);
    return { error: "Could not save the testimonial." };
  }
  revalidatePublic("testimonials");
  redirect("/admin/testimonials?saved=1");
}

export async function deleteTestimonial(fd: FormData) {
  await requireSession();
  const id = str(fd, "id");
  if (!id) return;
  try {
    await prisma.testimonial.delete({ where: { id } });
  } catch {
    redirect("/admin/testimonials?error=delete");
  }
  revalidatePublic("testimonials");
  redirect("/admin/testimonials?deleted=1");
}
