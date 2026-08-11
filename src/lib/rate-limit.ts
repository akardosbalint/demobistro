import "server-only";
import type { NextRequest } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

// Egyszerű, memóriabeli sliding-window rate limiter a publikus POST végpontokhoz
// (foglalás létrehozása, vélemény beküldése), hogy egy szkriptelt spam/DoS ne tudjon
// korlátlanul foglalásokat/e-maileket/SMS-eket generálni.
//
// FONTOS KORLÁT: ez PÉLDÁNYONKÉNT (per szerverless instance) véd, nem globálisan —
// nagy forgalmú, sokszorosan skálázott production környezetben egy megosztott store
// (pl. Upstash Redis vagy Vercel KV) ad csak valódi, elosztott védelmet. Ez a memóriabeli
// megoldás alapszintű, "jobb mint a semmi" védelmi réteg, nem helyettesíti azt.
const buckets = new Map<string, Bucket>();

let lastSweep = Date.now();
function sweepExpired(now: number) {
  if (now - lastSweep < 5 * 60 * 1000) return;
  lastSweep = now;
  Array.from(buckets.entries()).forEach(([key, bucket]) => {
    if (bucket.resetAt <= now) buckets.delete(key);
  });
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweepExpired(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

// A kliens IP-je Vercel mögött az x-forwarded-for fejlécben érkezik.
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
