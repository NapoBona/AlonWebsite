// 1. Acoustic Sound Healing
import acoustic1 from "@/assets/gallery/sound-healing/01.jpg";
import acoustic2 from "@/assets/gallery/sound-healing/02.jpg";
import acoustic3 from "@/assets/gallery/sound-healing/03.jpg";
import acoustic4 from "@/assets/gallery/sound-healing/04.jpg";
import acoustic5 from "@/assets/gallery/sound-healing/05.jpg";
import acoustic6 from "@/assets/gallery/sound-healing/06.jpg";
import acoustic7 from "@/assets/gallery/sound-healing/07.jpg";
import acoustic8 from "@/assets/gallery/sound-healing/08.jpg";

// 2. Electronic Pantam Performance
import electronic1 from "@/assets/gallery/live-performances/01.jpg";
import electronic2 from "@/assets/gallery/live-performances/02.jpg";

// 3. Ceremonies & Events
import ceremonies1 from "@/assets/gallery/ceremonies/01.jpg";
import ceremonies2 from "@/assets/gallery/ceremonies/02.jpg";

// 4. Retreats & Workshops
import workshops1 from "@/assets/gallery/workshops/01.jpg";
import workshops2 from "@/assets/gallery/workshops/02.jpg";
import workshops3 from "@/assets/gallery/workshops/03.jpg";
import workshops4 from "@/assets/gallery/workshops/04.jpg";
import workshops5 from "@/assets/gallery/workshops/05.jpg";

// 5. Behind the Lens (Bonus)
import extra1 from "@/assets/gallery/extras/01.jpg";
import extra2 from "@/assets/gallery/extras/02.jpg";
import extra3 from "@/assets/gallery/extras/03.jpg";
import extra4 from "@/assets/gallery/extras/04.jpg";
import extra5 from "@/assets/gallery/extras/05.jpg";
import extra6 from "@/assets/gallery/extras/06.jpg";

// Helper function
const createImages = (images: string[]) => images;

export const albums = [
  {
    id: 1,
    name: { he: "סאונד הילינג אקוסטי", en: "Acoustic Sound Healing" },
    description: {
      he: "מסע צלילים חיים, עם פאנטמים וכלים מכל העולם. קערות טיבטיות, פעמונים וצלילי טבע נעימים.",
      en: "A live journey of sounds, with Pantams and instruments from around the world. Tibetan bowls, bells and pleasant nature sounds.",
    },
    images: createImages([
      acoustic1, acoustic2, acoustic3, acoustic4, 
      acoustic5, acoustic6, acoustic7, acoustic8
    ]),
  },
  {
    id: 2,
    name: { he: "הופעת פאנטם אלקטרונית", en: "Electronic Pantam Performance" },
    description: {
      he: "מסע בצליליי הפאנטם. ההופעה כוללת שילוב של סט אפ סאונד הילינג בשילוב ציוד לניגון והקלטה בלייב. (אפשרות לאירועים גדולים).",
      en: "A journey into the sounds of the Pantam. The performance includes a combination of a sound healing setup with live playing and recording equipment. (Option for large events).",
    },
    images: createImages([electronic1, electronic2]),
  },
  {
    id: 3,
    name: { he: "ניגון בטקסים ואירועים", en: "Ceremonies & Events" },
    description: {
      he: "ניגונים בחתונות, טקסים אינטימיים ומרחבים רגישים.",
      en: "Playing in weddings, intimate ceremonies and sensitive spaces.",
    },
    images: createImages([ceremonies1, ceremonies2]),
  },
  {
    id: 4,
    name: { he: "ריטריטים וסדנאות", en: "Retreats & Workshops" },
    description: {
      he: "ניגוני סאונד הילינג לאירועי חברה, ריטריטים ומרחבי ריפוי.",
      en: "Sound healing melodies for corporate events, retreats and healing spaces.",
    },
    images: createImages([
      workshops1, workshops2, workshops3, workshops4, workshops5
    ]),
  },
  {
    id: 5,
    name: { he: "מאחורי העדשה", en: "Behind the Lens" },
    description: {
      he: "עם כמה תמונות מובחרות כולל הרבה טיפות",
      en: "Selected photos including many drops.",
    },
    images: createImages([
      extra1, extra2, extra3, extra4, extra5, extra6
    ]),
  },
];
