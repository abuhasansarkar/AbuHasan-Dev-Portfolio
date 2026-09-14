"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import type { ActionState } from "@/lib/admin/action-state";
import { fieldErrors, setPath, str } from "@/lib/admin/form-data";
import { settingsSections, textToStats } from "@/lib/admin/settings-fields";
import { SETTINGS_TAG, loadSettingsUncached } from "@/lib/settings/get-settings";
import { settingsSchema, type SettingsKey } from "@/lib/settings/schema";

export async function saveSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();

  const key = str(fd, "key") as SettingsKey;
  const section = settingsSections.find((s) => s.key === key);
  if (!section) return { error: "Unknown settings section." };

  const current = await loadSettingsUncached();
  let next: unknown;

  if (section.fields.length === 1 && section.fields[0]?.type === "stats") {
    next = textToStats(str(fd, "stats"));
  } else {
    const obj = structuredClone(current[key]) as Record<string, unknown>;
    for (const field of section.fields) {
      const raw = str(fd, field.path);
      const value = field.type === "lines" ? raw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : raw;
      setPath(obj, field.path, value);
    }
    next = obj;
  }

  const parsed = settingsSchema.shape[key].safeParse(next);
  if (!parsed.success) return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };

  try {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: parsed.data as Prisma.InputJsonValue },
      create: { key, value: parsed.data as Prisma.InputJsonValue },
    });
  } catch (err) {
    console.error("[admin/settings] save failed:", err instanceof Error ? err.message : err);
    return { error: "Could not save settings. Please try again." };
  }

  revalidateTag(SETTINGS_TAG);
  revalidatePath("/");
  return { ok: true, message: `${section.title} saved.` };
}
