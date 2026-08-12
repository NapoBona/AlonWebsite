export interface LocalizedText {
  he: string;
  en: string;
}

export interface EventItem {
  id: string;
  date: string;
  name: LocalizedText;
  subtitle?: LocalizedText;
  location?: string;
  locationLink?: string;
  price?: LocalizedText;
  time?: LocalizedText;
  description: LocalizedText;
  details?: LocalizedText;
  longDescription: LocalizedText;
  whatsappMessage?: LocalizedText;
  link: string;
  image?: string;
}

export type NewEventInput = Omit<EventItem, "id">;

interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T;
}

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function fetchEvents(): Promise<EventItem[]> {
  const res = await fetch("/api/events");
  if (!res.ok) throw new Error("Failed to load events");
  return res.json();
}

export async function verifyPassword(password: string): Promise<ApiResult<{ error?: string }>> {
  const res = await fetch("/api/verify-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await parseJsonSafe(res);
  return { ok: res.ok, status: res.status, data };
}

export async function addEvent(
  password: string,
  event: NewEventInput,
): Promise<ApiResult<{ error?: string } | EventItem[]>> {
  const res = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, event }),
  });
  const data = await parseJsonSafe(res);
  return { ok: res.ok, status: res.status, data };
}

export async function deleteEvent(
  password: string,
  id: string,
): Promise<ApiResult<{ error?: string } | EventItem[]>> {
  const res = await fetch(`/api/events/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await parseJsonSafe(res);
  return { ok: res.ok, status: res.status, data };
}

export async function updateEvent(
  password: string,
  id: string,
  event: NewEventInput,
): Promise<ApiResult<{ error?: string } | EventItem[]>> {
  const res = await fetch(`/api/events/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, event }),
  });
  const data = await parseJsonSafe(res);
  return { ok: res.ok, status: res.status, data };
}
