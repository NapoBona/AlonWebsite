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
    intro: {
      he: "אלון יהודה דב יעקבי, מוסיקאי ונגן פאנטם שחוקר את הצלילים ואת השקט שביניהם.",
      en: "A multidisciplinary musical artist blending traditional sounds with contemporary music.",
    },
    description: {
      he: `לפני 10 שנים התחיל המסע בעולם הצלילים המרפאים, כאשר יחד עם הפאנטמים, כלים מדיטטיביים נוספים, הקשבה למרחב והנגשת הצלילים ורפואת המוסיקה מנגן ומנחה מרחבי מסעות צלילים, מנגן באירועים ומלווה סדנאות וריטריטים.

יחד עם הצלילים והמרחב שנוצר, ניתן להגיע למקום, המאפשר ביטוי של העולם הרגשי, ולהתחבר למה שהכי חי בלב ובנשמה.
לתת למחשבות מנוחה ולאפשר לעצמנו, רגע להרפות ורק להרגיש, להתענג על אדוות המסע ולהגיע לתובנות מרגשות.

לנשום עמוק,
להיות בנוכחות.`,
      en: "For over a decade, creating unique musical experiences that connect cultures and traditions. From drumming workshops in the desert to performances on international stages, the music touches souls and inspires.",
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
  admin: {
    manageEvents: { he: "ניהול אירועים", en: "Manage events" },
    passwordLabel: { he: "סיסמה", en: "Password" },
    passwordPlaceholder: { he: "הזינו סיסמה", en: "Enter password" },
    unlock: { he: "אישור", en: "Unlock" },
    wrongPassword: { he: "סיסמה שגויה", en: "Incorrect password" },
    tooManyAttempts: { he: "יותר מדי ניסיונות, נסו שוב בעוד כמה דקות", en: "Too many attempts, try again in a few minutes" },
    addEvent: { he: "הוספת אירוע", en: "Add Event" },
    dateLabel: { he: "תאריך", en: "Date" },
    nameHeLabel: { he: "שם האירוע (עברית)", en: "Event name (Hebrew)" },
    nameEnLabel: { he: "שם האירוע (אנגלית)", en: "Event name (English)" },
    locationLabel: { he: "מיקום", en: "Location" },
    locationLinkLabel: { he: "קישור למיקום (אופציונלי)", en: "Location link (optional)" },
    descriptionHeLabel: { he: "תיאור (עברית)", en: "Description (Hebrew)" },
    descriptionEnLabel: { he: "תיאור (אנגלית)", en: "Description (English)" },
    whatsappHeLabel: { he: "הודעת וואטסאפ (עברית)", en: "WhatsApp message (Hebrew)" },
    whatsappEnLabel: { he: "הודעת וואטסאפ (אנגלית)", en: "WhatsApp message (English)" },
    imageLabel: { he: "קישור לתמונה (אופציונלי)", en: "Image URL (optional)" },
    submit: { he: "הוספה", en: "Add" },
    submitting: { he: "שולח...", en: "Submitting..." },
    success: { he: "האירוע נוסף בהצלחה", en: "Event added successfully" },
    duplicate: { he: "אירוע עם אותו שם ותאריך כבר קיים", en: "An event with this title and date already exists" },
    validationError: { he: "נא לבדוק את הפרטים שהוזנו", en: "Please check the details entered" },
    genericError: { he: "משהו השתבש, נסו שוב", en: "Something went wrong, please try again" },
    deleteConfirmTitle: { he: "למחוק את האירוע?", en: "Delete this event?" },
    deleteConfirmDescription: {
      he: "פעולה זו אינה הפיכה. האירוע יימחק לצמיתות.",
      en: "This action cannot be undone. The event will be permanently removed.",
    },
    cancel: { he: "ביטול", en: "Cancel" },
    delete: { he: "מחיקה", en: "Delete" },
    deleteSuccess: { he: "האירוע נמחק", en: "Event deleted" },
  },
} as const;
