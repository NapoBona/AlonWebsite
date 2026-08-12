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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdmin } from "@/contexts/AdminContext";
import { translations } from "@/data/i18n";
import { addEvent } from "@/lib/eventsApi";
import EventFormFields, { emptyEventForm, formValuesToNewEventInput, isEventFormValid } from "./EventFormFields";

const AddEventModal = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAdmin, unlock, lock } = useAdmin();

  const [open, setOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [form, setForm] = useState(emptyEventForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetAndClose = () => {
    setOpen(false);
    setPasswordInput("");
    setPasswordError("");
    setForm(emptyEventForm);
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
    const { ok, status } = await addEvent(passwordInput, formValuesToNewEventInput(form));
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

  const whatsappFilled = form.whatsappHe.trim() || form.whatsappEn.trim();
  const isWhatsappValid = !whatsappFilled || (form.whatsappHe.trim() && form.whatsappEn.trim());

  const isFormValid =
    form.date && form.nameHe && form.nameEn && form.descriptionHe && form.descriptionEn && isWhatsappValid;

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
            <EventFormFields form={form} onChange={setForm} idPrefix="add-event" />
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={isSubmitting || !isEventFormValid(form)}>
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
