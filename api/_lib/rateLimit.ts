import { redis } from "./redis.js";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 5 * 60; // 5 minutes

function attemptsKey(ip: string) {
  return `login_attempts:${ip}`;
}

/** Returns true if this IP is currently locked out from too many failed password attempts. */
export async function isRateLimited(ip: string): Promise<boolean> {
  const attempts = await redis.get<number>(attemptsKey(ip));
  return (attempts ?? 0) >= MAX_ATTEMPTS;
}

/** Records a failed password attempt for this IP, starting/refreshing the lockout TTL. */
export async function recordFailedAttempt(ip: string): Promise<void> {
  const key = attemptsKey(ip);
  const attempts = await redis.incr(key);
  if (attempts === 1) {
    await redis.expire(key, LOCKOUT_SECONDS);
  }
}

/** Clears failed attempts for this IP after a successful password check. */
export async function resetAttempts(ip: string): Promise<void> {
  await redis.del(attemptsKey(ip));
}
