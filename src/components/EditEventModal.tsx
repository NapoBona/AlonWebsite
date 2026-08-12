import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdmin } from "@/contexts/AdminContext";
import { translations } from "@/data/i18n";
import { updateEvent, type EventItem } from "@/lib/eventsApi";
import EventFormFields, { eventToFormValues, formValuesToNewEventInput, isEventFormValid } from "./EventFormFields";

interface EditEventModalProps {
  event: EventItem;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { password, lock } = useAdmin();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => eventToFormValues(event));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { ok, status } = await updateEvent(password, event.id, formValuesToNewEventInput(form));
    setIsSubmitting(false);

    if (ok) {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ description: t(translations.admin.updateSuccess) });
      setOpen(false);
      return;
    }
    if (status === 401) {
      lock();
      toast({ variant: "destructive", description: t(translations.admin.wrongPassword) });
      return;
    }
    if (status === 429) {
      toast({ variant: "destructive", description: t(translations.admin.tooManyAttempts) });
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

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setForm(eventToFormValues(event));
      }}
    >
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Pencil size={14} />
        {t(translations.admin.edit)}
      </Button>

      <DialogContent className="max-w-md" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{t(translations.admin.editEvent)}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <EventFormFields form={form} onChange={setForm} idPrefix={`edit-event-${event.id}`} />
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting || !isEventFormValid(form)}>
            {isSubmitting ? t(translations.admin.submitting) : t(translations.admin.saveChanges)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventModal;
