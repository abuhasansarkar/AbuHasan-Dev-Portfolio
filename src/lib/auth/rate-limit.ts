import "server-only";

/**
 * Rate limiter with two backends sharing one interface:
 *
 *  - Upstash Redis (HTTP REST, no SDK needed) when UPSTASH_REDIS_REST_URL +
 *    UPSTASH_REDIS_REST_TOKEN are set. Uses a fixed-window counter so it works
 *    correctly across serverless instances / regions (Vercel, etc.).
 *  - In-memory sliding-window fallback for local development and
 *    single-instance deployments.
 *
 * Both limits live in the same process only when Redis is not configured –
 * for production serverless deployments always set the Upstash env vars.
 */
export type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/* ---------- In-memory fallback (single instance / dev) ---------- */

const memoryStore = new Map<string, number[]>();

function memoryRateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const hits = (memoryStore.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    memoryStore.set(key, hits);
    const oldest = hits[0] ?? now;
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }

  hits.push(now);
  memoryStore.set(key, hits);

  // Opportunistic cleanup to keep memory bounded.
  if (memoryStore.size > 5000) {
    for (const [k, v] of memoryStore) {
      if (v.every((t) => now - t >= windowMs)) memoryStore.delete(k);
    }
  }

  return { ok: true, remaining: limit - hits.length, retryAfterSeconds: 0 };
}

/* ---------- Upstash Redis (multi-instance / serverless) ---------- */

const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const redisEnabled = Boolean(REST_URL && REST_TOKEN);

async function redisCommand(args: (string | number)[]): Promise<number> {
  const res = await fetch(REST_URL as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash REST responded with ${res.status}`);
  const data = (await res.json()) as { result?: unknown };
  return Number(data.result ?? 0);
}

async function redisFixedWindow(key: string, { limit, windowMs }: RateLimitOptions): Promise<RateLimitResult> {
  const now = Date.now();
  const windowIndex = Math.floor(now / windowMs);
  const redisKey = `ratelimit:${key}:${windowIndex}`;

  const count = await redisCommand(["INCR", redisKey]);
  if (count === 1) {
    // Set the TTL only on the first hit so the window boundary stays fixed.
    await redisCommand(["PEXPIRE", redisKey, String(windowMs)]);
  }

  const resetMs = (windowIndex + 1) * windowMs - now;
  return {
    ok: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds: Math.max(1, Math.ceil(resetMs / 1000)),
  };
}

/* ---------- Public API ---------- */

let redisDisabled = false;

export async function rateLimit(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
  if (redisEnabled && !redisDisabled) {
    try {
      return await redisFixedWindow(key, options);
    } catch (err) {
      // Never block legitimate traffic because Redis is down – degrade to memory.
      redisDisabled = true;
      console.warn(
        "[rate-limit] Redis backend failed, falling back to in-memory for this process:",
        err instanceof Error ? err.message : err,
      );
    }
  }
  return memoryRateLimit(key, options);
}

export const LOGIN_RATE_LIMIT: RateLimitOptions = { limit: 5, windowMs: 15 * 60 * 1000 };
export const CONTACT_RATE_LIMIT: RateLimitOptions = { limit: 5, windowMs: 60 * 60 * 1000 };
