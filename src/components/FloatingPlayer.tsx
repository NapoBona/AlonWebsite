import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/data/i18n";
import { tracks } from "@/data/tracks";
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react";

const FloatingPlayer = () => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = tracks[currentTrack];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, [currentTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const prevTrack = () => {
    const idx = (currentTrack - 1 + tracks.length) % tracks.length;
    setCurrentTrack(idx);
    setProgress(0);
    setPlaying(false);
  };

  const nextTrack = () => {
    const idx = (currentTrack + 1) % tracks.length;
    setCurrentTrack(idx);
    setProgress(0);
    setPlaying(false);
  };

  return (
    <>
      <audio ref={audioRef} src={track.src} muted={muted} />

      {/* Floating Button */}
      <motion.button
        onClick={() => setExpanded(!expanded)}
        className={`fixed z-[1000] bottom-6 ${
          document.documentElement.dir === "rtl" ? "left-6" : "right-6"
        } w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transition-all ${
          playing ? "animate-pulse-glow" : ""
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Music size={22} />
      </motion.button>

      {/* Expanded Player */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`fixed z-[1001] bottom-24 ${
              document.documentElement.dir === "rtl" ? "left-6" : "right-6"
            } w-72 glass-card p-4 shadow-xl`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">
                {t(translations.player.nowPlaying)}
              </span>
              <button onClick={() => setExpanded(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>

            <p className="font-display text-sm font-semibold text-foreground mb-1 truncate">
              {t(track.title)}
            </p>
            <p className="text-xs text-muted-foreground mb-3">{track.artist}</p>

            {/* Progress */}
            <div className="w-full h-1 bg-border rounded-full mb-3 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button onClick={prevTrack} className="text-muted-foreground hover:text-foreground transition-colors">
                <SkipBack size={18} />
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-accent-dark transition-colors"
              >
                {playing ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button onClick={nextTrack} className="text-muted-foreground hover:text-foreground transition-colors">
                <SkipForward size={18} />
              </button>
              <button
                onClick={() => setMuted(!muted)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingPlayer;
