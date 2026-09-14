"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import type { ActionState } from "@/lib/admin/action-state";
import { bool, csv, fieldErrors, optInt, optStr, str } from "@/lib/admin/form-data";
import { categorySchema, postSchema } from "@/lib/validation/admin";
import { estimateReadingTime, slugify } from "@/lib/utils";
import { revalidatePublic } from "./revalidate";

export async function savePost(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();

  const title = str(fd, "title");
  const content = str(fd, "content");
  const status = str(fd, "status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const publishedRaw = str(fd, "publishedAt");
  let publishedAt = publishedRaw ? new Date(publishedRaw) : undefined;
  if (publishedAt && Number.isNaN(publishedAt.getTime())) publishedAt = undefined;
  if (status === "PUBLISHED" && !publishedAt) publishedAt = new Date();

  const parsed = postSchema.safeParse({
    id: optStr(fd, "id"),
    title,
    slug: str(fd, "slug") || slugify(title),
    excerpt: str(fd, "excerpt"),
    content,
    categoryId: str(fd, "categoryId"),
    tags: csv(fd, "tags"),
    coverImage: str(fd, "coverImage"),
    author: str(fd, "author") || "AbuHasan",
    publishedAt,
    readingTime: optInt(fd, "readingTime") ?? (content ? estimateReadingTime(content) : undefined),
    seoTitle: optStr(fd, "seoTitle"),
    seoDescription: optStr(fd, "seoDescription"),
    ogImage: str(fd, "ogImage"),
    status,
    featured: bool(fd, "featured"),
    isDemo: bool(fd, "isDemo"),
  });

  if (!parsed.success) return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };

  const { id, categoryId, ...data } = parsed.data;
  const payload = {
    ...data,
    coverImage: data.coverImage || null,
    ogImage: data.ogImage || null,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    publishedAt: data.publishedAt ?? null,
    readingTime: data.readingTime ?? 5,
    category: { connect: { id: categoryId } },
  };

  try {
    if (id) await prisma.blogPost.update({ where: { id }, data: payload });
    else await prisma.blogPost.create({ data: payload });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { error: "That slug is already used by another post.", fieldErrors: { slug: "Slug must be unique" } };
    }
    console.error("[admin/posts] save failed:", err instanceof Error ? err.message : err);
    return { error: "Could not save the post. Please try again." };
  }

  revalidatePublic("posts");
  redirect("/admin/posts?saved=1");
}

export async function deletePost(fd: FormData) {
  await requireSession();
  const id = str(fd, "id");
  if (!id) return;
  try {
    await prisma.blogPost.delete({ where: { id } });
  } catch (err) {
    console.error("[admin/posts] delete failed:", err instanceof Error ? err.message : err);
    redirect("/admin/posts?error=delete");
  }
  revalidatePublic("posts");
  redirect("/admin/posts?deleted=1");
}

export async function createCategory(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();
  const name = str(fd, "name");
  const parsed = categorySchema.safeParse({ name, slug: str(fd, "slug") || slugify(name), description: optStr(fd, "description") });
  if (!parsed.success) return { error: "Please check the category fields.", fieldErrors: fieldErrors(parsed.error) };
  try {
    const count = await prisma.blogCategory.count();
    await prisma.blogCategory.create({ data: { ...parsed.data, sortOrder: count + 1 } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") return { error: "A category with that slug already exists." };
    console.error("[admin/posts] category create failed:", err instanceof Error ? err.message : err);
    return { error: "Could not create the category." };
  }
  revalidatePublic("posts");
  return { ok: true, message: `Category “${parsed.data.name}” created.` };
}

export async function deleteCategory(fd: FormData) {
  await requireSession();
  const id = str(fd, "id");
  if (!id) return;
  const inUse = await prisma.blogPost.count({ where: { categoryId: id } });
  if (inUse > 0) redirect("/admin/posts?error=category-in-use");
  await prisma.blogCategory.delete({ where: { id } }).catch(() => redirect("/admin/posts?error=delete"));
  revalidatePublic("posts");
  redirect("/admin/posts?deleted=1");
}
