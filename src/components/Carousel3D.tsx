import React, { useRef, useEffect, useState, useMemo } from "react";
import gsap from "gsap";

interface Carousel3DProps {
  images: string[];
}

const Carousel3D: React.FC<Carousel3DProps> = ({ images }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // --- Configuration ---
  // Reduced card width on desktop to fit within new localized height constraints
  const CARD_WIDTH_DESKTOP = 400; // 400 * 1.6 = 640px height. Fits better in 600-800px container.
  // We use functional check for mobile width in the code below instead of a constant
  const GAP = 30; 

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Calculate slots and normalized images
  // We mirror the images to ensure we have enough to form a circle if count is low
  const MIN_SLOTS = 8;
  
  const displayImages = useMemo(() => {
    // Filter out empty placeholders from data
    const validImages = images.filter(img => img && img.length > 0);
    
    if (validImages.length === 0) return Array(MIN_SLOTS).fill(""); 
    
    // If not enough images, repeat valid ones until we have at least MIN_SLOTS
    let result = [...validImages];
    while (result.length < MIN_SLOTS) {
        result = [...result, ...validImages];
    }
    return result;
  }, [images]);

  const SLOTS = displayImages.length;

    // Radius Calc
    const getRadius = (fovWidth: number, count: number) => {
        // C = N * W. r = C / 2pi.
        // For "Inside" view (Panoramic), we want the radius to be large enough 
        // that the user feels they are in the center.
        // Use Polygon apothem formula: r = w / (2 * tan(pi/N))
        const w = fovWidth + GAP;
        const r = w / (2 * Math.tan(Math.PI / count));
        // Push slightly further out to avoid "too close" feeling on near plane clips
        return Math.round(r);
    };
  
  const cardW = dimensions.width < 768 ? Math.min(350, dimensions.width * 0.8) : CARD_WIDTH_DESKTOP;
  const radius = useMemo(() => getRadius(cardW, SLOTS), [cardW, SLOTS, dimensions.width]);

  // -- Interaction State --
  const state = useRef({
      rotation: 0,
      isDragging: false,
      startX: 0,
      startRotation: 0,
      velocity: 0,
      lastX: 0,
      lastTime: 0
  });

  // Init & Resize
  useEffect(() => {
    // Force initial dimension
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    
    const onResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Main Loop for Inertia and Transform application
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    let rafId: number;
    
    // Position Cards Once (or on radius change)
    const cards = ring.children;
    Array.from(cards).forEach((card, i) => {
       const angle = i * (360 / SLOTS);
       
       // "From Inside" Logic:
       // 1. rotateY(angle): Position around the ring
       // 2. translateZ(radius): Push out to wall distance
       // 3. rotateY(180deg): Face INWARD to the viewer at center
       
       gsap.set(card, {
           transform: `rotateY(${angle}deg) translateZ(${radius}px) rotateY(180deg)`,
           display: "block",
           backfaceVisibility: "hidden",
           WebkitBackfaceVisibility: "hidden", 
       });
    });

    const update = () => {
      const s = state.current;
      
      // Apply momentum if not dragging
      if (!s.isDragging) {
         if (Math.abs(s.velocity) > 0.01) {
             s.rotation += s.velocity;
             s.velocity *= 0.95; // Friction
         } else {
             s.velocity = 0;
         }
      }
      
      // Apply to Ring
      // In panoramic inside view: 
      // If I drag LEFT (finger -> left), I expect the wall to move LEFT.
      // This corresponds to NEGATIVE rotationY (Counter Clockwise from top).
      gsap.set(ring, { rotationY: s.rotation });
      
      rafId = requestAnimationFrame(update);
    };
    update();
    
    return () => cancelAnimationFrame(rafId);
  }, [radius, SLOTS, displayImages]); // Re-run if geometry changes

  // Event Handlers
  const onPointerDown = (e: React.PointerEvent) => {
     const s = state.current;
     s.isDragging = true;
     s.startX = e.clientX;
     s.lastX = e.clientX;
     s.startRotation = s.rotation;
     s.lastTime = performance.now();
     s.velocity = 0;
     
     if (containerRef.current) containerRef.current.style.cursor = "grabbing";
     (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
     const s = state.current;
     if (!s.isDragging) return;
     
     const x = e.clientX;
     const dx = x - s.startX;
     
     // Sensitivity
     // 1px drag = X degrees rotation.
     // For immersive, slow is better.
     const sensitivity = 0.15; 
     
     // Direct control: Drag Left (dx < 0) -> Wall moves Left -> Right side appears -> Rotation Increases.
     // So we subtract dx (minus negative = positive).
     
     s.rotation = s.startRotation - (dx * sensitivity);
     
     // Velocity calc
     const now = performance.now();
     const dt = now - s.lastTime;
     if (dt > 0) {
         const moveX = x - s.lastX;
         s.velocity = -(moveX * sensitivity); // Inverted velocity
         s.lastX = x;
         s.lastTime = now;
     }
  };

  const onPointerUp = (e?: React.PointerEvent) => {
     state.current.isDragging = false;
     if (containerRef.current) containerRef.current.style.cursor = "grab";
     if (e && e.target) {
        try {
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        } catch (e) {
            // ignore if capture was lost
        }
     }
  };

  return (
    <div 
        ref={containerRef}
        className="w-full h-[500px] md:h-[700px] relative overflow-hidden bg-transparent flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y perspective-container"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ perspective: "1200px" }} // Deep perspective for immersion
    >
        {/** The World (Rotates) */}
        <div 
            ref={ringRef}
            className="absolute top-1/2 left-1/2 w-0 h-0 transform-style-3d"
            style={{ 
                transformStyle: "preserve-3d",
                // Push the floor down slightly if needed or center strictly
            }}
        >
            {displayImages.map((src, i) => (
                <div 
                    key={i} 
                    className="absolute top-0 left-0"
                    style={{
                        width: cardW,
                        height: cardW * 1.6, 
                        marginLeft: -cardW/2,
                        marginTop: -(cardW * 1.6)/2,
                        backfaceVisibility: "hidden", 
                        WebkitBackfaceVisibility: "hidden",
                        // Note: GSAP sets the transforms: rotateY, translateZ, rotateY(180)
                    }}
                >
                    <div className="w-full h-full relative group overflow-hidden rounded-md shadow-2xl bg-transparent mx-auto">
                        <img 
                            src={src} 
                            alt="" 
                            className="w-full h-full object-cover pointer-events-none select-none"
                            draggable={false}
                        />
                         {/* Shine / Reflection */}
                         <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                    </div>
                </div>
            ))}
        </div>
        
    </div>
  );
};

export default Carousel3D;
