"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ensureInitialAdmin } from "@/lib/auth/ensure-admin";
import { verifyPassword } from "@/lib/auth/password";
import { LOGIN_RATE_LIMIT, rateLimit } from "@/lib/auth/rate-limit";
import { createSession, destroySession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/admin";
import type { ActionState } from "@/lib/admin/action-state";

function safeNext(next: string | undefined) {
  if (!next || !next.startsWith("/admin") || next.startsWith("//")) return "/admin";
  return next;
}

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });
  if (!parsed.success) return { error: "Enter your email and password." };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const limit = await rateLimit(`login:${ip}`, LOGIN_RATE_LIMIT);
  if (!limit.ok) {
    return { error: `Too many sign-in attempts. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minute(s).` };
  }

  const email = parsed.data.email.toLowerCase();
  let sessionCreated = false;

  try {
    await ensureInitialAdmin();
    const admin = await prisma.admin.findUnique({ where: { email } });
    const valid = admin ? await verifyPassword(parsed.data.password, admin.passwordHash) : false;
    if (!admin || !valid) return { error: "Invalid email or password." };

    await createSession({ sub: admin.id, email: admin.email, name: admin.name });
    await prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
    sessionCreated = true;
  } catch (err) {
    console.error("[auth] login failed:", err instanceof Error ? err.message : err);
    return { error: "Sign-in is temporarily unavailable. Please try again shortly." };
  }

  if (sessionCreated) redirect(safeNext(parsed.data.next));
  return { error: "Unexpected error." };
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
