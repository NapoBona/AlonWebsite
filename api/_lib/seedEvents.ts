import type { EventItem } from "./types";

// Extracted from the previous hardcoded src/data/events.ts so deploying this
// feature never makes existing events disappear. Used only to seed Redis
// once, the first time GET /api/events runs against an empty store.
// Note: `image` now points to a stable path under /public (was a bundled
// Vite asset import, which can't be resolved from a serverless function).
export const seedEvents: EventItem[] = [
  {
    id: "2026-04-01-seed1",
    date: "2026-04-01",
    name: {
      he: "מכניסים אביב",
      en: "Welcoming Spring",
    },
    subtitle: {
      he: "דרך יוגה וצלילים מרפאים",
      en: "Through Yoga and Healing Sounds",
    },
    location: "מכמורת",
    locationLink: "https://maps.app.goo.gl/VqxHBRWVhJxHcAvz5?g_st=awb",
    description: {
      he: `מוזמנים ומוזמנות להצטרף אלינו לקבל את חג פסח בדרך קצת אחרת,
דרך תרגול יוגה רך ותומך אל תוך שוואסנה ומנוחה.
כשלאחריה ניכנס לסדנאת סאונד הילינג וצלילים מרפאים בשילוב פאנטמים וכלים מכל העולם.

יש עגלת קפה, ממ"ד צמוד ואוויר הים.`,
      en: `Invited to join us to welcome Passover in a slightly different way,
through soft and supportive yoga practice into Savasana and rest.
Followed by a sound healing workshop and healing sounds combining Pantams and instruments from around the world.

There is a coffee cart, an adjacent shelter, and sea air.`,
    },
    details: {
      he: `בבוקר של ליל הסדר,
יום רביעי, 1.4
10:00-12:30
"סטודיו יוגה מאלה"
מכמורת

מחיר 140₪
מחיר לזוג 250₪`,
      en: `Morning of Seder Night,
Wednesday, April 1st
10:00-12:30
"Mala Yoga Studio"
Michmoret

Price 140₪
Price for couple 250₪`,
    },
    longDescription: {
      he: "",
      en: "",
    },
    whatsappMessage: {
      he: "היי, אשמח לפרטים נוספים על אירוע יוגה וצלילים מרפאים במכמורת (פסח)",
      en: "Hi, I'd like more details about the Yoga and Healing Sounds event in Michmoret (Passover)",
    },
    link: "#",
    image: "/events/mihmoret.jpg",
  },
  {
    id: "2026-05-15-seed2",
    date: "2026-05-15",
    name: {
      he: "ניגון פאנטם אלקטרוני",
      en: "Electronic Pantam Performance",
    },
    subtitle: {
      he: "הופעת פאנטם ייחודית, בשילוב צלילים מכל העולם.",
      en: "A unique Pantam performance, combining sounds from around the world.",
    },
    location: "עולש",
    locationLink: "https://maps.app.goo.gl/KKWdqtUDNX3YMRqz5",
    description: {
      he: `בתאריך 15.5, יום שישי.
רגע לפני שבועות, במיקום פסטורלי.
מתאים למשפחות, יש אפשרות להישאר לפיקניק.


פרטים נוספים בקרוב,
מוזמנים ליצור קשר`,
      en: `On May 15th, Friday.
Just before Shavuot, in a pastoral location.
Suitable for families, with the option to stay for a picnic.


More details coming soon,
feel free to get in touch`,
    },
    longDescription: {
      he: "",
      en: "",
    },
    whatsappMessage: {
      he: "היי, אשמח לפרטים נוספים על הופעת פאנטם אלקטרוני בעולש",
      en: "Hi, I'd like more details about the Electronic Pantam Performance in Olesh",
    },
    link: "#",
  },
  {
    id: "2026-03-06-seed3",
    date: "2026-03-06",
    name: { he: "יוגה וצלילים מרפאים - מכניסים שבת", en: "Yoga and Healing Sounds - Welcoming Shabbat" },
    location: "מכמורת",
    description: {
      he: "מוזמנים להצטרף אלינו, לקבל את השבת בדרך קצת אחרת.",
      en: "Invited to join us, to welcome Shabbat in a slightly different way.",
    },
    longDescription: {
      he: 'מוזמנים להצטרף אלינו, לקבל את השבת בדרך קצת אחרת. לפתוח את הסופ"ש דרך תרגול יוגה רך ושוואסנה בהרפיית צלילים מרפאים.',
      en: "Invited to join us, to welcome Shabbat in a slightly different way. To start the weekend through soft yoga practice and Savasana in healing sounds relaxation.",
    },
    whatsappMessage: {
      he: "היי, אשמח לפרטים נוספים על יוגה וצלילים מרפאים במכמורת",
      en: "Hi, I'd like more details about Yoga and Healing Sounds in Michmoret",
    },
    link: "#",
  },
];
