import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BiographySection from "@/components/BiographySection";
import GallerySection from "@/components/GallerySection";
import EventsSection from "@/components/EventsSection";
import SocialSection from "@/components/SocialSection";
import FloatingPlayer from "@/components/FloatingPlayer";
import AddEventModal from "@/components/AddEventModal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      <div className="relative z-10 bg-background">
        <BiographySection />
        <EventsSection />
        <GallerySection />
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
