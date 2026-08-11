import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdmin } from "@/contexts/AdminContext";
import { translations } from "@/data/i18n";
import { fetchEvents, deleteEvent, type EventItem } from "@/lib/eventsApi";
import { PHONE_NUMBER } from "@/data/socialLinks";
import { Calendar, MapPin, ExternalLink, ChevronDown, ChevronUp, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Lightbox from "./Lightbox";

interface EventCardProps {
    event: EventItem;
    formatDate: (dateStr: string) => string;
}

const EventCard: React.FC<EventCardProps> = ({ event, formatDate }) => {
    const { lang, t } = useLanguage();
    const { isAdmin, password } = useAdmin();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const { ok, status } = await deleteEvent(password, event.id);
        setIsDeleting(false);
        if (ok) {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            toast({ description: t(translations.admin.deleteSuccess) });
            return;
        }
        if (status === 401) {
            toast({ variant: "destructive", description: t(translations.admin.wrongPassword) });
            return;
        }
        if (status === 429) {
            toast({ variant: "destructive", description: t(translations.admin.tooManyAttempts) });
            return;
        }
        toast({ variant: "destructive", description: t(translations.admin.genericError) });
    };

    // Use translation helper 't' for localized whatsapp message
    // Assuming event.whatsappMessage is now an object {he: string, en: string}
    const waLink = event.whatsappMessage
        ? `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(t(event.whatsappMessage))}`
        : null;

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="glass-card p-6 hover:shadow-lg transition-all group overflow-hidden"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2 text-primary mb-3">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">{formatDate(event.date)}</span>
                </div>
                
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                    {t(event.name)}
                </h3>
                {event.subtitle && (
                    <p className="font-display text-base md:text-lg text-foreground/80 mb-3">
                        {t(event.subtitle)}
                    </p>
                )}
                
                {event.location && (
                    <div 
                        className="flex items-center gap-2 text-muted-foreground mb-3 cursor-pointer hover:text-primary transition-colors"
                        onClick={(e) => {
                            if (event.locationLink) {
                                e.stopPropagation();
                                window.open(event.locationLink, '_blank');
                            }
                        }}
                    >
                        <MapPin size={14} />
                        <span className={`text-sm ${event.locationLink ? 'underline' : ''}`}>{event.location}</span>
                    </div>
                )}

                {/* Expandable Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 border-t border-white/10 space-y-4">
                                {/* Main description - full width */}
                                <p className="text-muted-foreground text-sm whitespace-pre-line">
                                    {t(event.description)}
                                </p>

                                {/* Details + Image side by side */}
                                {(event.details || event.image) && (
                                    <div className="flex gap-4 items-start">
                                        {event.details && (
                                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line flex-1">
                                                {t(event.details)}
                                            </p>
                                        )}
                                        {event.image && (
                                            <div 
                                                className="w-32 h-40 flex-shrink-0 cursor-pointer rounded-md overflow-hidden relative shadow-sm border border-white/10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowLightbox(true);
                                                }}
                                            >
                                                <img 
                                                    src={event.image} 
                                                    alt="Event" 
                                                    className="w-full h-full object-cover transition-transform hover:scale-110" 
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                        
                                <div className="flex flex-wrap gap-3 pt-2">
                                    {/* WhatsApp Action */}
                                    {waLink && (
                                        <Button 
                                            size="sm" 
                                            className="bg-[#25D366] hover:bg-[#128C7E] text-white gap-2"
                                            onClick={(e) => {
                                                e.stopPropagation(); // prevent collapsing
                                                window.open(waLink, '_blank');
                                            }}
                                        >
                                            <MessageCircle size={16} />
                                            WhatsApp
                                        </Button>
                                    )}

                                    {/* External Link if Valid */}
                                    {event.link && event.link !== "#" && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(event.link, '_blank');
                                            }}
                                        >
                                            {t(translations.events.details)}
                                            <ExternalLink size={14} />
                                        </Button>
                                    )}

                                    {/* Delete Action - only visible once password-gated */}
                                    {isAdmin && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="gap-2"
                                                    onClick={(e) => e.stopPropagation()}
                                                    disabled={isDeleting}
                                                >
                                                    <Trash2 size={14} />
                                                    {t(translations.admin.delete)}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>{t(translations.admin.deleteConfirmTitle)}</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {t(translations.admin.deleteConfirmDescription)}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>{t(translations.admin.cancel)}</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleDelete}>
                                                        {t(translations.admin.delete)}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Expansion Indicator */}
                <div className="flex justify-center mt-2 text-muted-foreground/50 group-hover:text-primary/70 transition-colors">
                     {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </motion.div>

            {showLightbox && event.image && (
                <Lightbox 
                    images={[event.image]} 
                    currentIndex={0} 
                    onClose={() => setShowLightbox(false)} 
                    onChange={() => {}} 
                />
            )}
        </>
    );
};

const EventsSection = () => {
  const { lang, t } = useLanguage();

  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= now);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === "he" ? "he-IL" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section id="events" className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl md:text-5xl font-bold text-foreground mb-12 text-center"
        >
          {t(translations.events.title)}
        </motion.h2>

        {upcomingEvents.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg">
            {t(translations.events.noEvents)}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} formatDate={formatDate} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
