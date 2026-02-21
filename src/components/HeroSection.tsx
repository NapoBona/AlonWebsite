import React, { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/data/i18n";
import heroBg from "@/assets/hero-bg.jpg";
import heroVideo from "@/assets/BackVid-720.mp4";
import { Volume2, VolumeX } from "lucide-react";

/**
 * HeroSection
 */
const HeroSection = () => {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Only track scroll for visual parallax effects
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleAudio = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      // Toggle button click: No ripple, just unmute
      fadeInAudio(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const fadeInAudio = (withNotification = true) => {
    const video = videoRef.current;
    if (!video) return;

    // If already playing unmuted and volume is up, ignore
    if (!video.muted && !video.paused && video.volume > 0) return;

    // Unmute immediately
    video.muted = false;
    video.volume = 0;
    setIsMuted(false);
    
    // Trigger visual notification only if requested (e.g. from video click)
    if (withNotification) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }

    video.play()
      .then(() => {
        // Smooth fade in over 5 seconds
        let start: number | null = null;
        const duration = 5000;

        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          const percent = Math.min(progress / duration, 1);

          // If user manually muted/paused during fade, stop
          if (video.muted || video.paused) return;

          video.volume = percent;

          if (progress < duration) {
            window.requestAnimationFrame(step);
          }
        };

        window.requestAnimationFrame(step);
      })
      .catch((err) => console.error("Autoplay/Unmute failed:", err));
  };

  const opacity = Math.max(0, 1 - scrollY / 600);
  const scale = 1 + scrollY * 0.0003;

  return (
    <section id="hero" className="sticky top-0 left-0 w-full h-screen overflow-hidden">
      {/* Background Video Layer */}
      <div 
        className="absolute inset-0 w-full h-full transition-none origin-center"
        style={{
          opacity,
          transform: `scale(${scale})`,
        }}
        onClick={() => fadeInAudio(true)}
        role="button"
        aria-label="Unmute background video"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={heroBg}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      {/* Overlay (darkens video) */}
      <div 
        className="absolute inset-0 bg-hero-overlay/30 pointer-events-none" 
        style={{ opacity }} 
      />

      {/* Sound Control Button (Bottom Left) */}
      <div 
        className="absolute bottom-10 left-6 z-20 pointer-events-auto transition-opacity duration-300"
        style={{ opacity }}
      >
        {showNotification && (
          <>
            <span className="absolute inset-0 rounded-full bg-blue-200/50 animate-ping"></span>
            <span className="absolute inset-0 rounded-full bg-blue-200/30 animate-ping delay-150"></span>
          </>
        )}
        <button
          onClick={toggleAudio}
          className={`relative p-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
            !isMuted 
              ? "bg-blue-200/80 hover:bg-blue-200 text-blue-900 ring-2 ring-blue-100" 
              : "bg-black/20 hover:bg-black/40 text-white"
          }`}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>

      {/* Centered Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 pointer-events-none"
        style={{ opacity }}
      >
        <p className="font-body text-xl md:text-2xl text-background/80 max-w-xl drop-shadow-md">
          {t(translations.hero.tagline)}
        </p>
        
        {/* Animated Down Arrow */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            fadeInAudio(true); // Unmute on click
            const bioSection = document.getElementById('bio');
            if (bioSection) {
              bioSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="mt-10 animate-bounce cursor-pointer hover:text-white transition-colors pointer-events-auto"
          aria-label="Scroll to biography"
        >
          <svg
            className="w-6 h-6 text-background/60 hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
