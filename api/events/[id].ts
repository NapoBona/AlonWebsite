import { redis, EVENTS_KEY } from "../_lib/redis.js";
import { isRateLimited, recordFailedAttempt, resetAttempts } from "../_lib/rateLimit.js";
import { getClientIp } from "../_lib/ip.js";
import type { EventItem } from "../_lib/types.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  const ip = getClientIp(req);

  if (await isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many attempts. Please try again in a few minutes." });
  }

  const { password } = req.body ?? {};

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    await recordFailedAttempt(ip);
    return res.status(401).json({ error: "Incorrect password" });
  }

  await resetAttempts(ip);

  const events = (await redis.get<EventItem[]>(EVENTS_KEY)) ?? [];
  const updated = events.filter((e) => e.id !== id);
  await redis.set(EVENTS_KEY, updated);
  return res.status(200).json(updated);
}
