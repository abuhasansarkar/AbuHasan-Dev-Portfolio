"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import type { ActionState } from "@/lib/admin/action-state";
import { bool, fieldErrors, int, lines, optStr, str } from "@/lib/admin/form-data";
import { serviceSchema } from "@/lib/validation/admin";
import { slugify } from "@/lib/utils";
import { revalidatePublic } from "./revalidate";

export async function saveService(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();
  const title = str(fd, "title");
  const parsed = serviceSchema.safeParse({
    id: optStr(fd, "id"),
    title,
    slug: str(fd, "slug") || slugify(title),
    description: str(fd, "description"),
    details: str(fd, "details"),
    icon: str(fd, "icon"),
    features: lines(fd, "features"),
    sortOrder: int(fd, "sortOrder", 0),
    active: bool(fd, "active"),
  });
  if (!parsed.success) return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };

  const { id, ...data } = parsed.data;
  try {
    if (id) await prisma.service.update({ where: { id }, data });
    else await prisma.service.create({ data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") return { error: "That slug is already used.", fieldErrors: { slug: "Slug must be unique" } };
    console.error("[admin/services] save failed:", err instanceof Error ? err.message : err);
    return { error: "Could not save the service." };
  }
  revalidatePublic("services");
  redirect("/admin/services?saved=1");
}

export async function deleteService(fd: FormData) {
  await requireSession();
  const id = str(fd, "id");
  if (!id) return;
  try {
    await prisma.service.delete({ where: { id } });
  } catch {
    redirect("/admin/services?error=delete");
  }
  revalidatePublic("services");
  redirect("/admin/services?deleted=1");
}
