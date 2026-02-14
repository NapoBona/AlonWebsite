import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/data/i18n";
import heroBg from "@/assets/hero-bg.jpg";
import heroVideo from "@/assets/BackVid-720.mp4";

const HeroSection = () => {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const opacity = Math.max(0, 1 - scrollY / 600);
  const scale = 1 + scrollY * 0.0003;

  return (
    <section id="hero" className="sticky top-0 h-screen overflow-hidden">
      {/* Background Video */}
      <div 
        className="absolute inset-0 w-full h-full transition-none origin-center"
        style={{
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroBg}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-hero-overlay/30" style={{ opacity }} />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
        style={{ opacity }}
      >
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-background mb-4 drop-shadow-lg">
          {t(translations.hero.name)}
        </h1>
        <p className="font-body text-lg md:text-xl text-background/80 max-w-xl drop-shadow-md">
          {t(translations.hero.tagline)}
        </p>
        <div className="mt-10 animate-bounce">
          <svg
            className="w-6 h-6 text-background/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
