import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/data/i18n";
import { events } from "@/data/events";
import { PHONE_NUMBER } from "@/data/socialLinks";
import { Calendar, MapPin, ExternalLink, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventCardProps {
    event: typeof events[0];
    formatDate: (dateStr: string) => string;
}

const EventCard: React.FC<EventCardProps> = ({ event, formatDate }) => {
    const { t } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);

    // Use translation helper 't' for localized whatsapp message
    // Assuming event.whatsappMessage is now an object {he: string, en: string}
    const waLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(t(event.whatsappMessage))}`;

    return (
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
            
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {t(event.name)}
            </h3>
            
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <MapPin size={14} />
                <span className="text-sm">{event.location}</span>
            </div>
            
            <p className="text-muted-foreground text-sm mb-4">
                {t(event.description)}
            </p>

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
                            {event.longDescription && (
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                    {t(event.longDescription) || t(event.description)} 
                                </p>
                            )}
                    
                            <div className="flex flex-wrap gap-3 pt-2">
                                {/* WhatsApp Action */}
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
    );
};

const EventsSection = () => {
  const { lang, t } = useLanguage();

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
            {upcomingEvents.map((event, idx) => (
              <EventCard key={idx} event={event} formatDate={formatDate} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
