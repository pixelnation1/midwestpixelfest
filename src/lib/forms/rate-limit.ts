import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS = 8;
const MAX_KEYS = 4_000;

/**
 * In-process sliding window. Fine for stopping obvious rapid repeats on a
 * warm instance. This is NOT a reliable distributed rate limit on Vercel or
 * other serverless hosts: each isolate has its own Map, so a determined
 * client can retry across instances.
 *
 * For production-grade distributed limits, add an external store (Upstash
 * Redis, Vercel KV, etc.). Do not pretend this Map is sufficient at scale.
 *
 * Keys are hashed. Submission bodies are never stored.
 */
const hitsByKey = new Map<string, number[]>();

export type RateLimitResult = { ok: true } | { ok: false; code: "rate_limited" };

function prune(now: number) {
  if (hitsByKey.size <= MAX_KEYS) return;
  for (const [key, stamps] of hitsByKey) {
    const fresh = stamps.filter((stamp) => now - stamp < WINDOW_MS);
    if (fresh.length === 0) hitsByKey.delete(key);
    else hitsByKey.set(key, fresh);
  }
}

function consume(key: string): RateLimitResult {
  const now = Date.now();
  const previous = hitsByKey.get(key) ?? [];
  const recent = previous.filter((stamp) => now - stamp < WINDOW_MS);

  if (recent.length >= MAX_SUBMISSIONS) {
    hitsByKey.set(key, recent);
    return { ok: false, code: "rate_limited" };
  }

  recent.push(now);
  hitsByKey.set(key, recent);
  prune(now);
  return { ok: true };
}

function hashIdentifier(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function requestIdentifier(): Promise<string | null> {
  try {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const ip =
      forwarded?.split(",")[0]?.trim() ||
      headerList.get("x-real-ip")?.trim() ||
      headerList.get("cf-connecting-ip")?.trim() ||
      "";
    if (!ip) return null;
    return hashIdentifier(`ip:${ip}`);
  } catch {
    return null;
  }
}

/**
 * Best-effort limit. Missing IP (or headers() unavailable) fails open so
 * legitimate users are not blocked when the platform omits forwarding headers.
 */
export async function checkFormRateLimit(): Promise<RateLimitResult> {
  const key = await requestIdentifier();
  if (!key) return { ok: true };
  return consume(key);
}
