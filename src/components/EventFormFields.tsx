import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/data/i18n";
import type { EventItem, NewEventInput } from "@/lib/eventsApi";

export interface EventFormValues {
  date: string;
  nameHe: string;
  nameEn: string;
  location: string;
  locationLink: string;
  descriptionHe: string;
  descriptionEn: string;
  whatsappHe: string;
  whatsappEn: string;
  image: string;
}

export const emptyEventForm: EventFormValues = {
  date: "",
  nameHe: "",
  nameEn: "",
  location: "",
  locationLink: "",
  descriptionHe: "",
  descriptionEn: "",
  whatsappHe: "",
  whatsappEn: "",
  image: "",
};

export function eventToFormValues(event: EventItem): EventFormValues {
  return {
    date: event.date,
    nameHe: event.name.he,
    nameEn: event.name.en,
    location: event.location ?? "",
    locationLink: event.locationLink ?? "",
    descriptionHe: event.description.he,
    descriptionEn: event.description.en,
    whatsappHe: event.whatsappMessage?.he ?? "",
    whatsappEn: event.whatsappMessage?.en ?? "",
    image: event.image ?? "",
  };
}

export function formValuesToNewEventInput(form: EventFormValues): NewEventInput {
  return {
    date: form.date,
    name: { he: form.nameHe, en: form.nameEn },
    location: form.location.trim() || undefined,
    locationLink: form.locationLink || undefined,
    description: { he: form.descriptionHe, en: form.descriptionEn },
    longDescription: { he: "", en: "" },
    whatsappMessage:
      form.whatsappHe.trim() && form.whatsappEn.trim()
        ? { he: form.whatsappHe, en: form.whatsappEn }
        : undefined,
    link: "#",
    image: form.image || undefined,
  };
}

export function isEventFormValid(form: EventFormValues): boolean {
  const whatsappFilled = form.whatsappHe.trim() || form.whatsappEn.trim();
  const isWhatsappValid = !whatsappFilled || (form.whatsappHe.trim() && form.whatsappEn.trim());
  return Boolean(
    form.date && form.nameHe && form.nameEn && form.descriptionHe && form.descriptionEn && isWhatsappValid,
  );
}

interface EventFormFieldsProps {
  form: EventFormValues;
  onChange: (next: EventFormValues) => void;
  idPrefix: string;
}

const EventFormFields: React.FC<EventFormFieldsProps> = ({ form, onChange, idPrefix }) => {
  const { t } = useLanguage();
  const set = (patch: Partial<EventFormValues>) => onChange({ ...form, ...patch });

  return (
    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-date`}>{t(translations.admin.dateLabel)}</Label>
        <Input
          id={`${idPrefix}-date`}
          type="date"
          value={form.date}
          onChange={(e) => set({ date: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-name-he`}>{t(translations.admin.nameHeLabel)}</Label>
        <Input
          id={`${idPrefix}-name-he`}
          value={form.nameHe}
          onChange={(e) => set({ nameHe: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-name-en`}>{t(translations.admin.nameEnLabel)}</Label>
        <Input
          id={`${idPrefix}-name-en`}
          value={form.nameEn}
          onChange={(e) => set({ nameEn: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-location`}>{t(translations.admin.locationLabel)}</Label>
        <Input
          id={`${idPrefix}-location`}
          value={form.location}
          onChange={(e) => set({ location: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-location-link`}>{t(translations.admin.locationLinkLabel)}</Label>
        <Input
          id={`${idPrefix}-location-link`}
          value={form.locationLink}
          onChange={(e) => set({ locationLink: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-description-he`}>{t(translations.admin.descriptionHeLabel)}</Label>
        <Textarea
          id={`${idPrefix}-description-he`}
          value={form.descriptionHe}
          onChange={(e) => set({ descriptionHe: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-description-en`}>{t(translations.admin.descriptionEnLabel)}</Label>
        <Textarea
          id={`${idPrefix}-description-en`}
          value={form.descriptionEn}
          onChange={(e) => set({ descriptionEn: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-whatsapp-he`}>{t(translations.admin.whatsappHeLabel)}</Label>
        <Textarea
          id={`${idPrefix}-whatsapp-he`}
          value={form.whatsappHe}
          onChange={(e) => set({ whatsappHe: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-whatsapp-en`}>{t(translations.admin.whatsappEnLabel)}</Label>
        <Textarea
          id={`${idPrefix}-whatsapp-en`}
          value={form.whatsappEn}
          onChange={(e) => set({ whatsappEn: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-image`}>{t(translations.admin.imageLabel)}</Label>
        <Input
          id={`${idPrefix}-image`}
          value={form.image}
          onChange={(e) => set({ image: e.target.value })}
        />
      </div>
    </div>
  );
};

export default EventFormFields;
