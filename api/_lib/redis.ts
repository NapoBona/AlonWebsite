import { Redis } from "@upstash/redis";

// Vercel's Upstash Marketplace integration provisions these as KV_REST_API_URL /
// KV_REST_API_TOKEN (NOT the UPSTASH_REDIS_REST_* names used by Redis.fromEnv()),
// so the client is constructed explicitly instead of relying on fromEnv().
const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;

if (!url || !token) {
  throw new Error(
    "Missing KV_REST_API_URL or KV_REST_API_TOKEN environment variables. " +
      "Run `vercel env pull .env.development.local` after connecting Upstash to the project.",
  );
}

export const redis = new Redis({ url, token });

export const EVENTS_KEY = "events";
