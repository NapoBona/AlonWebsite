import React, { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/data/i18n";
import heroBg from "@/assets/hero-bg.jpg";
import heroVideo from "@/assets/BackVid-720.mp4";
import { Volume2, VolumeX } from "lucide-react";

const HeroSection = () => {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const opacity = Math.max(0, 1 - scrollY / 600);
  const scale = 1 + scrollY * 0.0003;

  return (
    <section id="hero" className="sticky top-0 left-0 w-full h-screen overflow-hidden">
      {/* Background Video */}
      <div 
        className="absolute inset-0 w-full h-full transition-none origin-center"
        style={{
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted={isMuted}
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

      {/* Sound Control */}
      <button
        onClick={() => {
          if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
          }
        }}
        className="absolute bottom-10 left-6 z-20 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-sm"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        style={{ opacity }}
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </button>

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
        style={{ opacity }}
      >
        <p className="font-body text-xl md:text-2xl text-background/80 max-w-xl drop-shadow-md">
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
