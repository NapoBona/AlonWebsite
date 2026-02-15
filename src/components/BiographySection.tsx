import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/data/i18n";
import artistPortrait from "@/assets/artist-portrait.jpg";

const BiographySection = () => {
  const { t } = useLanguage();

  return (
    <section id="bio" className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl md:text-5xl font-bold text-foreground mb-12 text-center"
        >
          {t(translations.bio.title)}
        </motion.h2>

        <div className="flex flex-col md:flex-row gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="md:w-2/5 flex-shrink-0"
          >
            <div className="relative">
              <img
                src={artistPortrait}
                alt="Artist portrait"
                className="rounded-2xl shadow-xl w-full max-w-sm mx-auto object-cover aspect-[3/4]"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/10" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:w-3/5"
          >
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground whitespace-pre-line">
              {t(translations.bio.text)}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BiographySection;
