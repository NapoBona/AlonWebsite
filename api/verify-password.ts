import { isRateLimited, recordFailedAttempt, resetAttempts } from "./_lib/rateLimit";
import { getClientIp } from "./_lib/ip";

/**
 * Lightweight password check used only to reveal the add-event form in the UI.
 * Adding/removing events still requires the password again on the actual
 * POST/DELETE call — this endpoint does not issue a session or token.
 */
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

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
  return res.status(200).json({ ok: true });
}
