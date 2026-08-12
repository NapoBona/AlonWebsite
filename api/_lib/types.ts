export interface LocalizedText {
  he: string;
  en: string;
}

export interface EventItem {
  id: string;
  date: string; // "YYYY-MM-DD"
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
