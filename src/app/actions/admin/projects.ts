"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import type { ActionState } from "@/lib/admin/action-state";
import { bool, csv, fieldErrors, int, lines, optInt, optStr, str } from "@/lib/admin/form-data";
import { projectSchema } from "@/lib/validation/admin";
import { slugify } from "@/lib/utils";
import { revalidatePublic } from "./revalidate";

function parseImages(fd: FormData) {
  // One image per line: url | alt text | optional caption
  return lines(fd, "images").map((line) => {
    const [url = "", alt = "", caption = ""] = line.split("|").map((s) => s.trim());
    return { url, alt, caption: caption || undefined };
  });
}

export async function saveProject(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();

  const title = str(fd, "title");
  const parsed = projectSchema.safeParse({
    id: optStr(fd, "id"),
    title,
    slug: str(fd, "slug") || slugify(title),
    client: str(fd, "client"),
    industry: str(fd, "industry"),
    category: str(fd, "category"),
    excerpt: str(fd, "excerpt"),
    description: str(fd, "description"),
    challenge: str(fd, "challenge"),
    strategy: str(fd, "strategy"),
    solution: str(fd, "solution"),
    results: str(fd, "results"),
    keyImprovements: lines(fd, "keyImprovements"),
    technologies: csv(fd, "technologies"),
    services: csv(fd, "services"),
    projectUrl: str(fd, "projectUrl"),
    coverImage: str(fd, "coverImage"),
    accentColor: str(fd, "accentColor"),
    year: optInt(fd, "year"),
    featured: bool(fd, "featured"),
    published: bool(fd, "published"),
    isDemo: bool(fd, "isDemo"),
    sortOrder: int(fd, "sortOrder", 0),
    images: parseImages(fd),
  });

  if (!parsed.success) return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };

  const { id, images, ...data } = parsed.data;
  const payload = { ...data, projectUrl: data.projectUrl || null, accentColor: data.accentColor || null, year: data.year ?? null };

  try {
    if (id) {
      await prisma.$transaction([
        prisma.project.update({ where: { id }, data: payload }),
        prisma.projectImage.deleteMany({ where: { projectId: id } }),
        prisma.projectImage.createMany({ data: images.map((img, i) => ({ ...img, projectId: id, sortOrder: i })) }),
      ]);
    } else {
      await prisma.project.create({ data: { ...payload, images: { create: images.map((img, i) => ({ ...img, sortOrder: i })) } } });
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { error: "That slug is already used by another project.", fieldErrors: { slug: "Slug must be unique" } };
    }
    console.error("[admin/projects] save failed:", err instanceof Error ? err.message : err);
    return { error: "Could not save the project. Please try again." };
  }

  revalidatePublic("projects");
  redirect("/admin/projects?saved=1");
}

export async function deleteProject(fd: FormData) {
  await requireSession();
  const id = str(fd, "id");
  if (!id) return;
  try {
    await prisma.project.delete({ where: { id } });
  } catch (err) {
    console.error("[admin/projects] delete failed:", err instanceof Error ? err.message : err);
    redirect("/admin/projects?error=delete");
  }
  revalidatePublic("projects");
  redirect("/admin/projects?deleted=1");
}
