import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/data/i18n";
import artistPortrait01 from "@/assets/artist-portrait01.jpg";
import artistPortrait02 from "@/assets/artist-portrait02.jpg";
import artistPortrait03 from "@/assets/artist-portrait03.jpg";

const portraitImages = [artistPortrait01, artistPortrait02, artistPortrait03];
const ROTATION_INTERVAL_MS = 4000;

const BiographySection = () => {
  const { t } = useLanguage();
  const [portraitIndex, setPortraitIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPortraitIndex((i) => (i + 1) % portraitImages.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [portraitIndex]);

  const handlePortraitClick = () => {
    setPortraitIndex((i) => (i + 1) % portraitImages.length);
  };

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

        <div className="flex flex-col gap-8">
          {/* Intro Paragraph - Above Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
              {t(translations.bio.intro)}
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="md:w-2/5 flex-shrink-0 mx-auto md:mx-0"
            >
              <div className="relative group">
                <div className="rounded-2xl shadow-xl w-full max-w-sm mx-auto aspect-[3/4] overflow-hidden relative cursor-pointer">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={portraitIndex}
                      src={portraitImages[portraitIndex]}
                      alt="Artist portrait"
                      onClick={handlePortraitClick}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </AnimatePresence>
                </div>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/10 pointer-events-none" />
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
                {t(translations.bio.description)}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BiographySection;
