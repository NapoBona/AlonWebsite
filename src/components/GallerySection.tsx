import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/data/i18n";
import { albums } from "@/data/albums";
import Carousel3D from "@/components/Carousel3D";

const GallerySection = () => {
  const { t } = useLanguage();
  const [activeAlbum, setActiveAlbum] = useState(0);

  const currentAlbum = albums[activeAlbum];

  return (
    <section id="gallery" className="section-padding bg-surface overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8 text-center"
        >
          {t(translations.gallery.title)}
        </motion.h2>

        {/* Album Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {albums.map((album, idx) => (
            <button
              key={album.id}
              onClick={() => setActiveAlbum(idx)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                activeAlbum === idx
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-secondary-foreground border-border hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {t(album.name)}
            </button>
          ))}
        </div>

        {/* Album Description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentAlbum.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-8 text-center text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {t(currentAlbum.description)}
          </motion.p>
        </AnimatePresence>

        {/* 3D Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAlbum.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <Carousel3D images={currentAlbum.images} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default GallerySection;
