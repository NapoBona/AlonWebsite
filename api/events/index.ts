import { redis, EVENTS_KEY } from "../_lib/redis";
import { seedEvents } from "../_lib/seedEvents";
import { validateEvent, normalizeEvent } from "../_lib/validateEvent";
import { isRateLimited, recordFailedAttempt, resetAttempts } from "../_lib/rateLimit";
import { getClientIp } from "../_lib/ip";
import type { EventItem } from "../_lib/types";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    return handleGet(res);
  }
  if (req.method === "POST") {
    return handlePost(req, res);
  }
  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}

async function handleGet(res: any) {
  try {
    let events = await redis.get<EventItem[]>(EVENTS_KEY);
    if (!events) {
      await redis.set(EVENTS_KEY, seedEvents);
      events = seedEvents;
    }
    return res.status(200).json(events ?? []);
  } catch (err) {
    console.error("GET /api/events failed:", err);
    // Per spec: if Redis is unavailable/empty, fail soft with an empty list rather than an error.
    return res.status(200).json([]);
  }
}

async function handlePost(req: any, res: any) {
  const ip = getClientIp(req);

  if (await isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many attempts. Please try again in a few minutes." });
  }

  const { password, event } = req.body ?? {};

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    await recordFailedAttempt(ip);
    return res.status(401).json({ error: "Incorrect password" });
  }

  const validationError = validateEvent(event);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  await resetAttempts(ip);

  const events = (await redis.get<EventItem[]>(EVENTS_KEY)) ?? seedEvents;

  const normalized = normalizeEvent(event);
  const duplicate = events.some(
    (e) =>
      e.date === normalized.date &&
      e.name.en.trim().toLowerCase() === normalized.name.en.trim().toLowerCase(),
  );
  if (duplicate) {
    return res.status(409).json({ error: "An event with this title and date already exists" });
  }

  const newEvent: EventItem = {
    id: `${normalized.date}-${Math.random().toString(36).slice(2, 8)}`,
    ...normalized,
  };

  const updated = [...events, newEvent];
  await redis.set(EVENTS_KEY, updated);
  return res.status(200).json(updated);
}
