import type { NewEventInput } from "./types.js";

function isLocalizedText(value: any): boolean {
  return (
    value &&
    typeof value === "object" &&
    typeof value.he === "string" &&
    typeof value.en === "string"
  );
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

/** Validates a candidate new-event payload server-side. Returns an error message, or null if valid. */
export function validateEvent(body: any): string | null {
  if (!body || typeof body !== "object") return "Missing event data";

  if (typeof body.date !== "string" || !isValidDate(body.date)) {
    return "Invalid or missing date (expected YYYY-MM-DD)";
  }
  if (!isLocalizedText(body.name) || !body.name.he.trim() || !body.name.en.trim()) {
    return "Invalid or missing name (he/en)";
  }
  if (body.location !== undefined && body.location !== null && typeof body.location !== "string") {
    return "Invalid location";
  }
  if (!isLocalizedText(body.description) || !body.description.he.trim() || !body.description.en.trim()) {
    return "Invalid or missing description (he/en)";
  }
  if (
    body.whatsappMessage !== undefined &&
    body.whatsappMessage !== null &&
    (!isLocalizedText(body.whatsappMessage) || !body.whatsappMessage.he.trim() || !body.whatsappMessage.en.trim())
  ) {
    return "Invalid whatsappMessage (he/en)";
  }
  if (
    body.price !== undefined &&
    body.price !== null &&
    (!isLocalizedText(body.price) || !body.price.he.trim() || !body.price.en.trim())
  ) {
    return "Invalid price (he/en)";
  }
  if (
    body.time !== undefined &&
    body.time !== null &&
    (!isLocalizedText(body.time) || !body.time.he.trim() || !body.time.en.trim())
  ) {
    return "Invalid time (he/en)";
  }
  if (body.subtitle !== undefined && body.subtitle !== null && !isLocalizedText(body.subtitle)) {
    return "Invalid subtitle";
  }
  if (body.details !== undefined && body.details !== null && !isLocalizedText(body.details)) {
    return "Invalid details";
  }
  if (body.locationLink !== undefined && body.locationLink !== null && typeof body.locationLink !== "string") {
    return "Invalid locationLink";
  }
  if (body.link !== undefined && body.link !== null && typeof body.link !== "string") {
    return "Invalid link";
  }
  if (body.image !== undefined && body.image !== null && typeof body.image !== "string") {
    return "Invalid image";
  }

  return null;
}

export function normalizeEvent(body: any): NewEventInput {
  return {
    date: body.date,
    name: body.name,
    subtitle: body.subtitle || undefined,
    location: body.location || undefined,
    locationLink: body.locationLink || undefined,
    description: body.description,
    details: body.details || undefined,
    longDescription: isLocalizedText(body.longDescription) ? body.longDescription : { he: "", en: "" },
    whatsappMessage: isLocalizedText(body.whatsappMessage) ? body.whatsappMessage : undefined,
    price: isLocalizedText(body.price) ? body.price : undefined,
    time: isLocalizedText(body.time) ? body.time : undefined,
    link: body.link || "#",
    image: body.image || undefined,
  };
}
