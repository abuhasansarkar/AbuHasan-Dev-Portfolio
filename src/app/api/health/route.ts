import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Liveness/readiness probe: `SELECT 1` against Postgres.
 * 200 = database reachable, 503 = not. Returns no data, so it is safe to expose.
 * Point your UptimeRobot/BetterStack health check here.
 */
export async function GET() {
  const startedAt = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      database: "up",
      latencyMs: Date.now() - startedAt,
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[health] database check failed:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { status: "degraded", database: "down", timestamp: new Date().toISOString() },
      { status: 503 },
    );
  }
}
