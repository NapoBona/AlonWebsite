export type Lang = "he" | "en";

export const translations = {
  nav: {
    home: { he: "בית", en: "Home" },
    bio: { he: "על האמן", en: "Biography" },
    gallery: { he: "גלריה", en: "Gallery" },
    events: { he: "אירועים", en: "Events" },
    contact: { he: "צור קשר", en: "Contact" },
  },
  hero: {
    name: { he: "אלון יהודה דב יעקבי", en: "Alon Yehuda Dov Yaacoby" },
    tagline: { he: "מוזיקה מהלב", en: "Music from the Heart" },
  },
  bio: {
    title: { he: "על האמן", en: "Biography" },
    text: {
      he: `אלון יהודה דב יעקבי, מוסיקאי ונגן פאנטם שחוקר את הצלילים ואת השקט שביניהם.

לפני 10 שנים התחיל המסע בעולם הצלילים המרפאים, כאשר יחד עם הפאנטמים, כלים מדיטטיביים נוספים, הקשבה למרחב והנגשת הצלילים ורפואת המוסיקה מנגן ומנחה מרחבי מסעות צלילים, מנגן באירועים ומלווה סדנאות וריטריטים.

יחד הצלילים והמרחב שנוצר, ניתן להגיע למקום המאפשר ביטוי של העולם הרגשי ולהתחבר למה שהכי חי בלב והנשמה.
לתת למחשבות מנוחה ולאפשר לעצמינו לרגע להרפות ורק להרגיש, להתענג על אדוות המסע ולהגיע לתובנות מרגשות.

לנשום עמוק,
להיות בנוכחות.`,
      en: "A multidisciplinary musical artist blending traditional sounds with contemporary music. For over a decade, creating unique musical experiences that connect cultures and traditions. From drumming workshops in the desert to performances on international stages, the music touches souls and inspires.",
    },
  },
  gallery: {
    title: { he: "גלריה", en: "Gallery" },
  },
  events: {
    title: { he: "אירועים קרובים", en: "Upcoming Events" },
    noEvents: { he: "אין אירועים קרובים כרגע", en: "No upcoming events at the moment" },
    details: { he: "פרטים", en: "Details" },
  },
  social: {
    title: { he: "בואו נתחבר", en: "Let's Connect" },
    subtitle: {
      he: "עקבו אחריי ברשתות החברתיות או צרו קשר ישירות",
      en: "Follow me on social media or reach out directly",
    },
  },
  player: {
    nowPlaying: { he: "מתנגן עכשיו", en: "Now Playing" },
  },
  themes: {
    desert: { he: "מדבר", en: "Desert" },
    night: { he: "לילה במדבר", en: "Night Desert" },
    ocean: { he: "אוקיינוס", en: "Ocean Mint" },
  },
} as const;
