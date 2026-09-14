import "server-only";

/**
 * Simple in-memory sliding-window rate limiter.
 * Suitable for a single-instance deployment or low-traffic admin login protection.
 * For multi-region serverless, swap the store for Redis/Upstash while keeping this interface.
 */
type Bucket = { hits: number[]; };

const store = new Map<string, Bucket>();

export type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0] ?? now;
    store.set(key, bucket);
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }

  bucket.hits.push(now);
  store.set(key, bucket);

  // Opportunistic cleanup to keep memory bounded.
  if (store.size > 5000) {
    for (const [k, v] of store) {
      if (v.hits.every((t) => now - t >= windowMs)) store.delete(k);
    }
  }

  return { ok: true, remaining: limit - bucket.hits.length, retryAfterSeconds: 0 };
}

export const LOGIN_RATE_LIMIT: RateLimitOptions = { limit: 5, windowMs: 15 * 60 * 1000 };
export const CONTACT_RATE_LIMIT: RateLimitOptions = { limit: 5, windowMs: 60 * 60 * 1000 };
