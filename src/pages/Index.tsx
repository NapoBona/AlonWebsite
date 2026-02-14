import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BiographySection from "@/components/BiographySection";
import GallerySection from "@/components/GallerySection";
import EventsSection from "@/components/EventsSection";
import SocialSection from "@/components/SocialSection";
import FloatingPlayer from "@/components/FloatingPlayer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      <div className="relative z-10 bg-background">
        <BiographySection />
        <GallerySection />
        <EventsSection />
        <SocialSection />
      </div>

      <FloatingPlayer />

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-sm text-muted-foreground border-t border-border/30 bg-background">
        © {new Date().getFullYear()} Artist Name
      </footer>
    </div>
  );
};

export default Index;
