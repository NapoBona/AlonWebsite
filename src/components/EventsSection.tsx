import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/data/i18n";
import { events } from "@/data/events";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

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
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-6 hover:shadow-lg transition-shadow group"
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
                <p className="text-muted-foreground text-sm mb-4">{t(event.description)}</p>
                {event.link && (
                  <a
                    href={event.link}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent-dark transition-colors"
                  >
                    {t(translations.events.details)}
                    <ExternalLink size={14} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
