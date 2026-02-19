import React, { useState, useRef } from "react";
// Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Swiper modules
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import { Swiper as SwiperType } from "swiper";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// Icons or other assets if needed
// import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselSwiperProps {
  images: string[];
}

// import "./CarouselSwiper.css"; // Custom overrides

const CarouselSwiper: React.FC<CarouselSwiperProps> = ({ images }) => {
  const displayImages = React.useMemo(() => {
    // Duplication for smooth loop
    if (images.length < 8) {
      const base = [...images];
      let res = [...base];
      while (res.length < 12) res = [...res, ...base];
      return res;
    }
    return images;
  }, [images]);

  const [isZoomed, setIsZoomed] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className={`swiper-container-wrapper relative w-full h-[500px] md:h-[600px] flex items-center justify-center transition-all duration-500`}>
        {/* Full Screen Overlay for Zoom */}
        {isZoomed && (
             <div 
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in"
                onClick={() => setIsZoomed(false)}
             >
                {/* Close Button */}
                <button 
                  className="absolute top-6 right-6 text-white text-xl p-4 bg-white/10 rounded-full hover:bg-white/20"
                  onClick={(e) => {
                      e.stopPropagation();
                      setIsZoomed(false);
                  }}
                >
                  ✕
                </button>
                
                {/* Large Image */}
                <img 
                   src={swiperRef.current?.slides[swiperRef.current.activeIndex]?.querySelector('img')?.getAttribute('src') || ""}
                   className="max-h-[85vh] max-w-[95vw] object-contain shadow-2xl rounded-md scale-100 transition-transform duration-500"
                   alt="Zoomed view"
                   onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                />
             </div>
        )}

      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        loopedSlides={4}
        resizeObserver={true}
        slidesPerView={"auto"}
        initialSlide={Math.floor(displayImages.length / 2)}
        coverflowEffect={{
          rotate: 35, // Increased rotation to face "inward" more
          stretch: 0,
          depth: 100, // Reduced depth so they don't fade into darkness too fast
          modifier: 1,
          slideShadows: false,
        }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="w-full h-full py-10 perspective-container" // added perspective class
        breakpoints={{
            320: {
                coverflowEffect: {
                    rotate: 35,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                }
            },
            768: {
                 coverflowEffect: {
                    rotate: 30,
                    stretch: -50, // Negative stretch pulls them closer together like a cylinder wall
                    depth: 150,
                    modifier: 1,
                 }
            }
        }}
      >
        {displayImages.map((src, index) => (
          <SwiperSlide 
            key={index} 
            className="transition-all duration-500 ease-out-expo"
            style={{
                width: window.innerWidth < 768 ? "280px" : "400px", 
                height: window.innerWidth < 768 ? "420px" : "600px",
            }}
          >
            {({ isActive }) => (
                <div 
                    className={`
                        relative w-full h-full rounded-xl overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer
                        ${isActive ? "ring-2 ring-primary/50 opacity-100 scale-100" : "opacity-40 scale-90 saturate-0 hover:opacity-80"}
                    `}
                    onClick={() => {
                        // Using swiper's internal loop handling is safer for clicks
                        if (isActive) {
                            setIsZoomed(true);
                        } else {
                            // slideToLoop handles the visual index vs data index confusion
                            swiperRef.current?.slideToLoop(index);
                        }
                    }}
                >
                    <img 
                        src={src} 
                        alt={`Slide ${index}`} 
                        className="w-full h-full object-cover select-none pointer-events-none"
                    />
                     {/* Reflection / Overlay */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 pointer-events-none" />
                </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      
      <style>{`
        /* Swiper Fixes */
        .swiper-wrapper {
            align-items: center;
        }
        .swiper-slide {
            /* Customize slide base style */
            background-position: center;
            background-size: cover;
            /* width needs to be fixed for effect='coverflow' with slidesPerView='auto' */
        }
        
        /* Zoom overrides that React inline styles might struggle with */
        .swiper-slide-active {
            z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default CarouselSwiper;
