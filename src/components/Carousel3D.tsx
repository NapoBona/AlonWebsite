import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Carousel3DProps {
  images: string[];
  onImageClick?: (index: number) => void;
}

const Carousel3D: React.FC<Carousel3DProps> = ({ images, onImageClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<HTMLDivElement[]>([]);
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const [currentCenterIndex, setCurrentCenterIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [showArrows, setShowArrows] = useState(true);
  const xPosRef = useRef(0);
  const isDraggingRef = useRef(false);
  const rotationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate rotation angle for each image (360/6 = 60 degrees)
  const anglePerImage = 360 / 6;
  const radius = 250; // Distance from center (reduced for better mobile fit)

  useEffect(() => {
    if (!ringRef.current) return;

    // Initialize carousel
    gsap.set(ringRef.current, {
      rotationY: 0,
      cursor: "grab",
    });

    // Set up each image in 3D space
    imageRefs.current.forEach((img, i) => {
      if (!img) return;
      gsap.set(img, {
        rotateY: i * -anglePerImage,
        transformOrigin: `50% 50% ${radius}px`,
        z: -radius,
        backfaceVisibility: "hidden",
      });
    });

    // Entrance animation
    gsap.from(imageRefs.current, {
      duration: 1.5,
      y: 200,
      opacity: 0,
      stagger: 0.1,
      ease: "expo",
    });

    // Cleanup
    return () => {
      if (rotationTimeoutRef.current) {
        clearTimeout(rotationTimeoutRef.current);
      }
    };
  }, [images]);

  const handleRotationStart = () => {
    setIsRotating(true);
    setShowArrows(false);
    if (rotationTimeoutRef.current) {
      clearTimeout(rotationTimeoutRef.current);
    }
  };

  const handleRotationEnd = () => {
    if (rotationTimeoutRef.current) {
      clearTimeout(rotationTimeoutRef.current);
    }
    rotationTimeoutRef.current = setTimeout(() => {
      setIsRotating(false);
      setShowArrows(true);
    }, 500);
  };

  const dragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (zoomedIndex !== null) return; // Disable rotation while zoomed

    // Don't prevent default on touch start entirely to allow scrolling if needed, but for carousel we need it
    // e.preventDefault(); 
    isDraggingRef.current = false;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    xPosRef.current = Math.round(clientX);
    if (ringRef.current) {
      gsap.set(ringRef.current, { cursor: "grabbing" });
    }
    handleRotationStart();
    window.addEventListener("mousemove", drag as any);
    window.addEventListener("touchmove", drag as any);
    window.addEventListener("mouseup", dragEnd);
    window.addEventListener("touchend", dragEnd);
  };

  const drag = (e: MouseEvent | TouchEvent) => {
    if (!ringRef.current) return;
    
    // Prevent scrolling while dragging the carousel
    if (e.cancelable) e.preventDefault();

    isDraggingRef.current = true;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const delta = Math.round(clientX) - xPosRef.current;

    // Allow continuous rotation
    gsap.to(ringRef.current, {
      rotationY: "-=" + (delta * 0.5), // Slower manual rotation for better control
      duration: 0.3,
      overwrite: "auto"
    });

    xPosRef.current = Math.round(clientX);
  };

  const dragEnd = () => {
    window.removeEventListener("mousemove", drag as any);
    window.removeEventListener("touchmove", drag as any);
    window.removeEventListener("mouseup", dragEnd);
    window.removeEventListener("touchend", dragEnd);
    if (ringRef.current) {
      gsap.set(ringRef.current, { cursor: "grab" });
    }
    
    // Auto Snap to nearest image
    if (isDraggingRef.current && ringRef.current) {
      const currentRotation = gsap.getProperty(ringRef.current, "rotationY") as number;
      
      // Calculate minimal snapped rotation
      const snapAngle = Math.round(currentRotation / anglePerImage) * anglePerImage;
      
      // Animate to snap point
      gsap.to(ringRef.current, {
        rotationY: snapAngle,
        duration: 0.5,
        ease: "power2.out",
        onComplete: handleRotationEnd
      });

      // Update current index based on snap angle
      // Normalize angle to 0-360 range for index calculation
      let normalizedAngle = -snapAngle % 360;
      if (normalizedAngle < 0) normalizedAngle += 360;
      
      const newIndex = Math.round(normalizedAngle / anglePerImage) % 6;
      setCurrentCenterIndex(newIndex);
    } else {
        handleRotationEnd();
    }
    
    // Reset dragging flag after a small delay to prevent click from firing
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
  };

  const handleImageClick = (index: number, imgSrc: string) => {
    // Ignore clicks on placeholder images or if user was dragging
    if (!imgSrc || isDraggingRef.current) return;

    if (zoomedIndex === index) {
      // Unzoom backwards
      setZoomedIndex(null);
      gsap.to(imageRefs.current[index], {
        z: -radius,
        scale: 1,
        duration: 0.5,
        ease: "power2.inOut",
      });
    } else {
      // Zoom In
      if (!ringRef.current) return;
      
      // Get current rotation state
      const currentRotation = gsap.getProperty(ringRef.current, "rotationY") as number;
      
      // Calculate target ring rotation to bring this image to front (0deg world space)
      // Image `index` is at `index * -60` degrees inside ring.
      // To bring it to 0, ring must rotate to `index * 60`.
      // We want to move to the closest multiple of 360.
      
      const targetBaseRotation = index * anglePerImage; // e.g., index 1 (at -60) needs +60 ring rot
      
      // Find the multiple of 360 closest to currentRotation that aligns with targetBaseRotation
      // Formula: target = targetBase + 360 * round((current - targetBase) / 360)
      const targetRotation = targetBaseRotation + 360 * Math.round((currentRotation - targetBaseRotation) / 360);
      
      // Animate: Center first, then Zoom
      gsap.to(ringRef.current, {
        rotationY: targetRotation,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentCenterIndex(index);
          // Only after centering, zoom in
          
           // Return any other zoomed image
           if (zoomedIndex !== null && zoomedIndex !== index) {
            gsap.to(imageRefs.current[zoomedIndex], {
              z: -radius,
              scale: 1,
              duration: 0.3,
              ease: "power2.inOut",
            });
          }
          
          setZoomedIndex(index);
          gsap.to(imageRefs.current[index], {
            z: 100, // Move forward
            scale: 1.5,
            duration: 0.4,
            ease: "power2.inOut",
          });
        },
      });
    }
  };

  const rotateCarousel = (direction: "left" | "right") => {
    if (!ringRef.current || zoomedIndex !== null) return;

    handleRotationStart();
    const rotation = direction === "left" ? anglePerImage : -anglePerImage;
    
    // Update current center index
    const newIndex = direction === "left" 
      ? (currentCenterIndex - 1 + 6) % 6 
      : (currentCenterIndex + 1) % 6;
    setCurrentCenterIndex(newIndex);

    gsap.to(ringRef.current, {
      rotationY: "+=" + rotation,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: handleRotationEnd,
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        rotateCarousel("left");
      } else if (e.key === "ArrowRight") {
        rotateCarousel("right");
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [zoomedIndex]);

  return (
    <div className="relative w-full h-[600px] md:h-[600px] overflow-hidden">
      <div
        ref={containerRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[480px] md:w-[400px] md:h-[500px]"
        style={{ perspective: "2000px", isolation: "isolate" }}
      >
        <div
          ref={ringRef}
          className="w-full h-full relative"
          style={{ transformStyle: "preserve-3d" }}
          onMouseDown={dragStart}
          onTouchStart={dragStart}
        >
          {images.map((imgSrc, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) imageRefs.current[index] = el;
              }}
              className="absolute w-full h-full cursor-pointer touch-none"
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => handleImageClick(index, imgSrc)}
            >
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-2xl"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full bg-muted border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Coming Soon</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && !isRotating && zoomedIndex === null && (
        <>
          <button
            onClick={() => rotateCarousel("left")}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border rounded-full p-3 backdrop-blur-sm transition-all hover:scale-110 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => rotateCarousel("right")}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border rounded-full p-3 backdrop-blur-sm transition-all hover:scale-110 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel3D;
