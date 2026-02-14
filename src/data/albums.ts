// Rhythm Workshops
import rhythmWorkshops1 from "@/assets/gallery/rhythm-workshops/01.jpg";
import rhythmWorkshops2 from "@/assets/gallery/rhythm-workshops/02.jpg";
import rhythmWorkshops3 from "@/assets/gallery/rhythm-workshops/03.jpg";
import rhythmWorkshops4 from "@/assets/gallery/rhythm-workshops/04.jpg";
import rhythmWorkshops5 from "@/assets/gallery/rhythm-workshops/05.jpg";

// Live Performances
import livePerformances1 from "@/assets/gallery/live-performances/01.jpg";
import livePerformances2 from "@/assets/gallery/live-performances/02.jpg";

// Nature & Sounds
import natureSounds1 from "@/assets/gallery/nature-sounds/01.jpg";
import natureSounds2 from "@/assets/gallery/nature-sounds/02.jpg";

// Ceremonies & Events
import ceremonies1 from "@/assets/gallery/ceremonies/01.jpg";
import ceremonies2 from "@/assets/gallery/ceremonies/02.jpg";

// Helper function to create array of 6 images with placeholders
const createImageArray = (images: string[]): string[] => {
  const imageArray = [...images];
  while (imageArray.length < 6) {
    imageArray.push(""); // Empty string for placeholder
  }
  return imageArray.slice(0, 6);
};

export const albums = [
  {
    id: 1,
    name: { he: "סדנאות קצב", en: "Rhythm Workshops" },
    description: {
      he: "סדנאות תיפוף קבוצתיות במדבר — חיבור לקצב הפנימי דרך כלי הקשה מסורתיים.",
      en: "Group drumming workshops in the desert — connecting to inner rhythm through traditional percussion.",
    },
    images: createImageArray([
      rhythmWorkshops1,
      rhythmWorkshops2,
      rhythmWorkshops3,
      rhythmWorkshops4,
      rhythmWorkshops5,
    ]),
  },
  {
    id: 2,
    name: { he: "הופעות חיות", en: "Live Performances" },
    description: {
      he: "הופעות על במות ברחבי הארץ, מפסטיבלים גדולים ועד ערבים אינטימיים.",
      en: "Performances on stages across the country, from large festivals to intimate evenings.",
    },
    images: createImageArray([livePerformances1, livePerformances2]),
  },
  {
    id: 3,
    name: { he: "טבע וצלילים", en: "Nature & Sounds" },
    description: {
      he: "מפגשי ריפוי בצלילים בטבע — קערות טיבטיות, גונגים וכלי נגינה אקוסטיים.",
      en: "Sound healing sessions in nature — Tibetan bowls, gongs, and acoustic instruments.",
    },
    images: createImageArray([natureSounds1, natureSounds2]),
  },
  {
    id: 4,
    name: { he: "טקסים ואירועים", en: "Ceremonies & Events" },
    description: {
      he: "ליווי מוזיקלי לטקסים, חתונות ואירועים מיוחדים עם אנרגיה ייחודית.",
      en: "Musical accompaniment for ceremonies, weddings, and special events with unique energy.",
    },
    images: createImageArray([ceremonies1, ceremonies2]),
  },
];
