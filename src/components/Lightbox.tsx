import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onChange: (index: number) => void;
}

const Lightbox = ({ images, currentIndex, onClose, onChange }: LightboxProps) => {
  const goPrev = useCallback(() => {
    onChange((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onChange]);

  const goNext = useCallback(() => {
    onChange((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onChange]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goPrev, goNext]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] flex items-center justify-center"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-foreground/85" />

        {/* Close */}
        <button
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/20 text-background hover:bg-background/40 transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Nav Arrows */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-4 z-10 p-2 rounded-full bg-background/20 text-background hover:bg-background/40 transition-colors"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            >
              <ChevronLeft size={28} />
            </button>
            <button
              className="absolute right-4 z-10 p-2 rounded-full bg-background/20 text-background hover:bg-background/40 transition-colors"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}

        {/* Image */}
        <motion.img
          key={currentIndex}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.3, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          src={images[currentIndex]}
          alt=""
          className="relative z-10 max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
