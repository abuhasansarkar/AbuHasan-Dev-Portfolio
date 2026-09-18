import "server-only";
import { prisma } from "@/lib/db";
import { hashPassword } from "./password";

/**
 * Guarantees that at least one admin exists.
 * If the Admin table is empty and ADMIN_EMAIL / ADMIN_PASSWORD are configured,
 * the account is created with a bcrypt-hashed password. Safe to call on every login attempt.
 */
export async function ensureInitialAdmin() {
  const count = await prisma.admin.count();
  if (count > 0) return;

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  // Hardening: never bootstrap a known demo account in production.
  const isDemoCredential = email === "admin@example.com" || password === "ChangeThisImmediately123!";
  if (process.env.NODE_ENV === "production" && isDemoCredential) {
    console.warn(
      "[auth] Refusing to create an admin account with known demo credentials in production. " +
        "Set real ADMIN_EMAIL / ADMIN_PASSWORD values in the environment first.",
    );
    return;
  }

  await prisma.admin.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      name: process.env.ADMIN_NAME?.trim() || "Admin",
    },
  });
  console.info(`[auth] Initial admin account created for ${email} from environment variables.`);
}
