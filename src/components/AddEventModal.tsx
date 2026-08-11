import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdmin } from "@/contexts/AdminContext";
import { translations } from "@/data/i18n";
import { addEvent, type NewEventInput } from "@/lib/eventsApi";

const emptyForm = {
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

const AddEventModal = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAdmin, unlock, lock } = useAdmin();

  const [open, setOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetAndClose = () => {
    setOpen(false);
    setPasswordInput("");
    setPasswordError("");
    setForm(emptyForm);
  };

  const handleUnlock = async () => {
    if (!passwordInput) return;
    setIsVerifying(true);
    setPasswordError("");
    const result = await unlock(passwordInput);
    setIsVerifying(false);
    if (!result.ok) {
      if (result.status === 429) {
        setPasswordError(t(translations.admin.tooManyAttempts));
      } else {
        setPasswordError(t(translations.admin.wrongPassword));
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const event: NewEventInput = {
      date: form.date,
      name: { he: form.nameHe, en: form.nameEn },
      location: form.location,
      locationLink: form.locationLink || undefined,
      description: { he: form.descriptionHe, en: form.descriptionEn },
      longDescription: { he: "", en: "" },
      whatsappMessage: { he: form.whatsappHe, en: form.whatsappEn },
      link: "#",
      image: form.image || undefined,
    };

    const { ok, status, data } = await addEvent(passwordInput, event);
    setIsSubmitting(false);

    if (ok) {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ description: t(translations.admin.success) });
      resetAndClose();
      return;
    }

    if (status === 401) {
      lock();
      setPasswordError(t(translations.admin.wrongPassword));
      return;
    }
    if (status === 429) {
      lock();
      setPasswordError(t(translations.admin.tooManyAttempts));
      return;
    }
    if (status === 409) {
      toast({ variant: "destructive", description: t(translations.admin.duplicate) });
      return;
    }
    if (status === 400) {
      toast({ variant: "destructive", description: t(translations.admin.validationError) });
      return;
    }
    toast({ variant: "destructive", description: t(translations.admin.genericError) });
  };

  const isFormValid =
    form.date && form.nameHe && form.nameEn && form.location && form.descriptionHe && form.descriptionEn && form.whatsappHe && form.whatsappEn;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetAndClose();
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t(translations.admin.manageEvents)}
        className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
      >
        <Settings size={14} />
      </button>

      <DialogContent className="max-w-md">
        {!isAdmin ? (
          <>
            <DialogHeader>
              <DialogTitle>{t(translations.admin.manageEvents)}</DialogTitle>
              <DialogDescription>{t(translations.admin.passwordPlaceholder)}</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="admin-password">{t(translations.admin.passwordLabel)}</Label>
              <Input
                id="admin-password"
                type="password"
                value={passwordInput}
                placeholder={t(translations.admin.passwordPlaceholder)}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                autoFocus
              />
              {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
            </div>
            <DialogFooter>
              <Button onClick={handleUnlock} disabled={isVerifying || !passwordInput}>
                {t(translations.admin.unlock)}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t(translations.admin.addEvent)}</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="space-y-1">
                <Label htmlFor="event-date">{t(translations.admin.dateLabel)}</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="event-name-he">{t(translations.admin.nameHeLabel)}</Label>
                <Input
                  id="event-name-he"
                  value={form.nameHe}
                  onChange={(e) => setForm((f) => ({ ...f, nameHe: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="event-name-en">{t(translations.admin.nameEnLabel)}</Label>
                <Input
                  id="event-name-en"
                  value={form.nameEn}
                  onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="event-location">{t(translations.admin.locationLabel)}</Label>
                <Input
                  id="event-location"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="event-location-link">{t(translations.admin.locationLinkLabel)}</Label>
                <Input
                  id="event-location-link"
                  value={form.locationLink}
                  onChange={(e) => setForm((f) => ({ ...f, locationLink: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="event-description-he">{t(translations.admin.descriptionHeLabel)}</Label>
                <Textarea
                  id="event-description-he"
                  value={form.descriptionHe}
                  onChange={(e) => setForm((f) => ({ ...f, descriptionHe: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="event-description-en">{t(translations.admin.descriptionEnLabel)}</Label>
                <Textarea
                  id="event-description-en"
                  value={form.descriptionEn}
                  onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="event-whatsapp-he">{t(translations.admin.whatsappHeLabel)}</Label>
                <Textarea
                  id="event-whatsapp-he"
                  value={form.whatsappHe}
                  onChange={(e) => setForm((f) => ({ ...f, whatsappHe: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="event-whatsapp-en">{t(translations.admin.whatsappEnLabel)}</Label>
                <Textarea
                  id="event-whatsapp-en"
                  value={form.whatsappEn}
                  onChange={(e) => setForm((f) => ({ ...f, whatsappEn: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="event-image">{t(translations.admin.imageLabel)}</Label>
                <Input
                  id="event-image"
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={isSubmitting || !isFormValid}>
                {isSubmitting ? t(translations.admin.submitting) : t(translations.admin.submit)}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
