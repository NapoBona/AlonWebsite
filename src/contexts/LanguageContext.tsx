import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Lang } from "@/data/i18n";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (obj: Record<Lang, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem("lang") as Lang) || "he";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === "he" ? "en" : "he"));
  const t = (obj: Record<Lang, string>) => obj[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
