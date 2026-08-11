import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/data/i18n";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BiographySection from "@/components/BiographySection";
import GallerySection from "@/components/GallerySection";
import EventsSection from "@/components/EventsSection";
import SocialSection from "@/components/SocialSection";
import FloatingPlayer from "@/components/FloatingPlayer";
import AddEventModal from "@/components/AddEventModal";

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      <div className="relative z-10 bg-background">
        <BiographySection />
        
        {/* Jump to Events Link */}
        <div className="flex justify-center pb-8 -mt-6">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
            className="gap-3 rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/5 px-8 h-12 text-lg"
          >
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-foreground/80 font-medium">{t(translations.events.title)}</span>
          </Button>
        </div>

        <GallerySection />
        <EventsSection />
        <SocialSection />
      </div>

      <FloatingPlayer />

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-sm text-muted-foreground border-t border-border/30 bg-background">
        <div className="flex items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} Alon Yaacoby</span>
          <AddEventModal />
        </div>
      </footer>
    </div>
  );
};

export default Index;
