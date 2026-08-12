import { redis, EVENTS_KEY } from "../_lib/redis.js";
import { validateEvent, normalizeEvent } from "../_lib/validateEvent.js";
import { isRateLimited, recordFailedAttempt, resetAttempts } from "../_lib/rateLimit.js";
import { getClientIp } from "../_lib/ip.js";
import type { EventItem } from "../_lib/types.js";

export default async function handler(req: any, res: any) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    return handleDelete(req, res, id);
  }
  if (req.method === "PUT") {
    return handlePut(req, res, id);
  }
  res.setHeader("Allow", "DELETE, PUT");
  return res.status(405).json({ error: "Method not allowed" });
}

async function handleDelete(req: any, res: any, id: string) {
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

async function handlePut(req: any, res: any, id: string) {
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

  const events = (await redis.get<EventItem[]>(EVENTS_KEY)) ?? [];
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Event not found" });
  }

  const normalized = normalizeEvent(event);
  const duplicate = events.some(
    (e, i) =>
      i !== index &&
      e.date === normalized.date &&
      e.name.en.trim().toLowerCase() === normalized.name.en.trim().toLowerCase(),
  );
  if (duplicate) {
    return res.status(409).json({ error: "An event with this title and date already exists" });
  }

  const updated = [...events];
  updated[index] = { id, ...normalized };
  await redis.set(EVENTS_KEY, updated);
  return res.status(200).json(updated);
}
