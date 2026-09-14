"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { z } from "zod";

const statusSchema = z.enum(["NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]);

export async function updateSubmissionStatus(fd: FormData) {
  await requireSession();

  const id = String(fd.get("id") ?? "").trim();
  const parsed = statusSchema.safeParse(String(fd.get("status") ?? "").trim());

  if (!id || !parsed.success) {
    redirect("/admin/submissions?error=invalid");
  }

  try {
    await prisma.contactSubmission.update({
      where: { id },
      data: { status: parsed.data },
    });
  } catch (err) {
    console.error("[admin/submissions] status update failed:", err instanceof Error ? err.message : err);
    redirect(`/admin/submissions/${id}?error=update`);
  }

  redirect(`/admin/submissions/${id}?saved=1`);
}

export async function addSubmissionNote(fd: FormData) {
  await requireSession();

  const id = String(fd.get("id") ?? "").trim();
  const notes = String(fd.get("notes") ?? "").trim() || null;

  if (!id) redirect("/admin/submissions?error=invalid");

  try {
    await prisma.contactSubmission.update({
      where: { id },
      data: { notes },
    });
  } catch (err) {
    console.error("[admin/submissions] note update failed:", err instanceof Error ? err.message : err);
    redirect(`/admin/submissions/${id}?error=update`);
  }

  redirect(`/admin/submissions/${id}?saved=1`);
}

export async function archiveSubmission(fd: FormData) {
  await requireSession();

  const id = String(fd.get("id") ?? "").trim();
  if (!id) return;

  try {
    await prisma.contactSubmission.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });
  } catch {
    redirect("/admin/submissions?error=archive");
  }

  redirect("/admin/submissions?archived=1");
}
