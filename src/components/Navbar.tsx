import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { translations } from "@/data/i18n";
import { Menu, X, Sun, Moon, Waves } from "lucide-react";

const themeIcons = {
  desert: Sun,
  night: Moon,
  ocean: Waves,
};

const Navbar = () => {
  const { lang, toggleLang, t } = useLanguage();
  const { theme, cycleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const ThemeIcon = themeIcons[theme];

  const navItems = [
    { href: "#hero", label: t(translations.nav.home) },
    { href: "#bio", label: t(translations.nav.bio) },
    { href: "#gallery", label: t(translations.nav.gallery) },
    { href: "#events", label: t(translations.nav.events) },
    { href: "#contact", label: t(translations.nav.contact) },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Artist Name */}
        <a href="#hero" className="font-display text-xl font-bold text-foreground tracking-wide">
          {t(translations.hero.name)}
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="px-3 py-1.5 text-xs font-bold rounded-full border border-border bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-all"
          >
            {lang === "he" ? "EN" : "עב"}
          </button>
          <button
            onClick={cycleTheme}
            className="p-2 rounded-full border border-border bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-all"
            aria-label="Switch theme"
          >
            <ThemeIcon size={16} />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-full border border-border bg-secondary text-secondary-foreground"
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-md">
          <div className="flex flex-col p-4 gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium text-foreground py-2 border-b border-border/20 last:border-0"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
