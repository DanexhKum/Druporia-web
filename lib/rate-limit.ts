// ============================================================
// lib/rate-limit.ts
// Fixed-window in-memory rate limiter. No external dependencies.
//
// SCOPE AND LIMITS — read before relying on this:
//   Counters live in the process memory of a single instance.
//   On Vercel that means each warm serverless instance keeps its
//   own tally, and every cold start resets to zero. An attacker
//   spread across enough instances gets a proportionally higher
//   effective limit.
//
//   This is a first line against casual abuse and accidental
//   loops, not a hard guarantee. If a route needs a real ceiling,
//   move it to Redis (@upstash/ratelimit) or a Postgres counter —
//   the call sites below won't need to change, only this module.
// ============================================================

export type RateLimitResult = {
  ok: boolean
  limit: number
  remaining: number
  resetAt: number
  retryAfterSeconds: number
}

type Bucket = { count: number; resetAt: number }

// Survives HMR module reloads in dev, same pattern as lib/prisma.ts.
const globalForRateLimit = globalThis as unknown as {
  rateLimitBuckets: Map<string, Bucket> | undefined
}

const buckets =
  globalForRateLimit.rateLimitBuckets ?? new Map<string, Bucket>()

if (process.env.NODE_ENV !== 'production') {
  globalForRateLimit.rateLimitBuckets = buckets
}

// Hard ceiling on tracked keys, so a flood of unique IPs can't grow
// the map without bound. Well above any legitimate concurrent load.
const MAX_TRACKED_KEYS = 10_000
const SWEEP_INTERVAL_MS = 60_000

let lastSweepAt = 0

function sweepExpired(now: number) {
  if (now - lastSweepAt < SWEEP_INTERVAL_MS) return
  lastSweepAt = now

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }

  // Still oversized after dropping expired entries: evict oldest-first.
  // Map preserves insertion order, so this sheds the stalest keys.
  if (buckets.size > MAX_TRACKED_KEYS) {
    const excess = buckets.size - MAX_TRACKED_KEYS
    let removed = 0
    for (const key of buckets.keys()) {
      buckets.delete(key)
      if (++removed >= excess) break
    }
  }
}

/**
 * Consume one unit against `key`. Call once per request.
 *
 * @param key      Namespaced identity, e.g. `contact:203.0.113.7`
 * @param limit    Requests permitted per window
 * @param windowMs Window length in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  sweepExpired(now)

  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs
    buckets.set(key, { count: 1, resetAt })
    return {
      ok: true,
      limit,
      remaining: limit - 1,
      resetAt,
      retryAfterSeconds: 0,
    }
  }

  existing.count += 1

  const over = existing.count > limit
  return {
    ok: !over,
    limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
    retryAfterSeconds: over
      ? Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
      : 0,
  }
}

/**
 * Best-effort client IP. Trusts `x-forwarded-for` because Vercel
 * sets it; behind any other proxy, confirm that header is
 * overwritten at the edge rather than passed through from the client.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return req.headers.get('x-real-ip') ?? 'unknown'
}

/** Standard rate-limit response headers for a result. */
export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  const headers: Record<string, string> = {
    'RateLimit-Limit': String(result.limit),
    'RateLimit-Remaining': String(result.remaining),
    'RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  }
  if (!result.ok) headers['Retry-After'] = String(result.retryAfterSeconds)
  return headers
}
