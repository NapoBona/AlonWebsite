export type Lang = "he" | "en";

export const translations = {
  nav: {
    home: { he: "בית", en: "Home" },
    bio: { he: "ביוגרפיה", en: "Biography" },
    gallery: { he: "גלריה", en: "Gallery" },
    events: { he: "אירועים", en: "Events" },
    contact: { he: "צור קשר", en: "Contact" },
  },
  hero: {
    name: { he: "אלוניעקבי", en: "Artist Name" },
    tagline: { he: "מוזיקה מהלב", en: "Music from the Heart" },
  },
  bio: {
    title: { he: "ביוגרפיה", en: "Biography" },
    text: {
      he: " אלון יהודה דב יעקבי הוא מוסיקאי ונגן פאנטם שחוקר את הצלילים ואת השקט שביניהם. לפני 10 שנים התחיל המסע בעולם הצלילים המרפאים.  יחד עם הפאנטם, כלים מדיטטיביים נוספים, הקשבה למרחב, הנגשת הצלילים ורפואת המוסיקה, מנחה sound therapy, מנגן באירועים ומלווה סדנאות וריטריטים. כשיחד עם הצלילים והמרחב שנוצר, ניתן להגיע למקום המאפשר ביטוי של העולם הרגשי ולהתחבר למה שהכי חי בלב והנשמה. לנשום עמוק, להיות בנוכחות. ",
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
