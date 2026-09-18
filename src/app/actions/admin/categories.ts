"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import type { ActionState } from "@/lib/admin/action-state";
import { str, optStr } from "@/lib/admin/form-data";
import { slugify } from "@/lib/utils";
import { revalidatePublic } from "./revalidate";

export async function saveCategory(fd: FormData) {
  await requireSession();

  const id = optStr(fd, "id");
  const name = str(fd, "name");
  const description = optStr(fd, "description") ?? null;

  if (!name) redirect("/admin/categories?error=name-required");

  const slug = id
    ? (await prisma.blogCategory.findUnique({ where: { id } }))?.slug ?? slugify(name)
    : slugify(name);

  try {
    if (id) {
      await prisma.blogCategory.update({
        where: { id },
        data: { name, description },
      });
    } else {
      await prisma.blogCategory.create({
        data: { slug, name, description },
      });
    }
  } catch (err) {
    console.error("[admin/categories] save failed:", err instanceof Error ? err.message : err);
    redirect(id ? `/admin/categories/${id}?error=save` : "/admin/categories/new?error=save");
  }

  revalidatePublic("blog");
  redirect("/admin/categories?saved=1");
}

export async function deleteCategory(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();

  const id = str(fd, "id");
  if (!id) return { error: "Missing category id." };

  try {
    await prisma.blogCategory.delete({ where: { id } });
  } catch {
    return { error: "Could not delete the category. It may have already been removed – refresh the list." };
  }

  revalidatePublic("blog");
  redirect("/admin/categories?deleted=1");
}
