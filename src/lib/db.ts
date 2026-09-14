import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Wraps a database read so that UI can render a friendly "database unavailable" state
 * instead of crashing the whole page.
 */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<{ data: T; error: boolean }> {
  try {
    return { data: await fn(), error: false };
  } catch (err) {
    console.error("[db] query failed:", err instanceof Error ? err.message : err);
    return { data: fallback, error: true };
  }
}
