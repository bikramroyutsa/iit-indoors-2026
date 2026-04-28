"use client";

import { ReactNode, useRef, useEffect, useState, use } from "react";
import { useScroll } from "framer-motion";

interface TechUndergroundProps {
  children?: ReactNode;
}

const getTechPattern = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" shape-rendering="crispEdges">
    <rect width="64" height="64" fill="#00110F" />
    
    <!-- Vertical Traces -->
    <rect x="12" y="0" width="2" height="32" fill="#003A30" />
    <rect x="12" y="32" width="16" height="2" fill="#003A30" />
    <rect x="28" y="32" width="2" height="32" fill="#003A30" />
    
    <rect x="44" y="0" width="2" height="64" fill="#00221c" />
    <rect x="52" y="20" width="2" height="44" fill="#003A30" />
    
    <!-- Horizontal Traces -->
    <rect x="0" y="16" width="12" height="2" fill="#003A30" />
    <rect x="30" y="48" width="14" height="2" fill="#003A30" />
    
    <!-- Glowing Nodes -->
    <rect x="10" y="14" width="6" height="6" fill="#16DBAB" />
    <rect x="26" y="46" width="6" height="6" fill="#16DBAB" />
    <rect x="50" y="18" width="6" height="6" fill="#004d40" />
  </svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

const getTechDither = (c1: string, c2: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" shape-rendering="crispEdges">
    <rect width="16" height="16" fill="${c1}" />
    <rect x="4" y="0" width="4" height="4" fill="${c2}" />
    <rect x="0" y="4" width="4" height="4" fill="${c2}" />
    <rect x="8" y="4" width="4" height="4" fill="${c2}" />
    <rect x="4" y="8" width="4" height="4" fill="${c2}" />
    <rect x="12" y="8" width="4" height="4" fill="${c2}" />
    <rect x="0" y="12" width="16" height="4" fill="${c2}" />
    <rect x="0" y="12" width="4" height="4" fill="${c1}" />
  </svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

export default function TechUnderground({ children }: TechUndergroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasScrolledNext, setHasScrolledNext] = useState(false);
  const footerColor = "#000000";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Auto-scroll to core logic
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      // Trigger auto-scroll to the final footer once user scrolls past 0.7 in this section
      if (latest > 0.7 && !hasScrolledNext) {
        const core = document.getElementById('core');
        if (core) {
          setHasScrolledNext(true);
          core.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => setHasScrolledNext(false), 2000);
        }
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, hasScrolledNext]);

  const scrollToCore = () => {
    const core = document.getElementById('core');
    if (core) {
      core.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section ref={containerRef} id="tech" className="w-full relative h-[100svh] flex flex-col items-center justify-center p-10 overflow-hidden snap-start snap-always">
      <style>{`
        @keyframes arrow-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(10px); opacity: 1; }
        }
        @keyframes text-blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.6; }
        }
        .scroll-arrow {
          animation: arrow-bounce 2s infinite ease-in-out;
        }
        .scroll-text {
          animation: text-blink 0.4s steps(1, start) infinite;
        }
      `}</style>

      {/* Blurred Abstract Tech Layer */}
      <div 
        className="absolute inset-0 z-0 blur-[6px] opacity-60" 
        style={{
          backgroundImage: getTechPattern(),
          backgroundSize: '128px 128px',
          backgroundRepeat: 'repeat',
          imageRendering: 'pixelated'
        }}
      />
      
      {/* Sharp Pixelated Overlay (Retains the "pixel" feel) */}
      <div 
        className="absolute inset-0 z-[1] opacity-[0.12] pointer-events-none" 
        style={{
          backgroundImage: getTechPattern(),
          backgroundSize: '128px 128px',
          backgroundRepeat: 'repeat',
          imageRendering: 'pixelated'
        }}
      />
      
      <div className="container mx-auto z-10 flex flex-col items-center">
        {children}
      </div>

      {/* Tech to Footer Transition */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[32px] z-30 pointer-events-none" 
        style={{ 
          backgroundImage: getTechDither('transparent', footerColor),
          transform: 'scaleY(-1)'
        }} 
      />
      
      {/* Darker gradient at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/40 to-transparent z-20 pointer-events-none" />

      {/* Scroll Down Button to Core Section */}
      <button 
        onClick={scrollToCore}
        className="absolute bottom-4 flex flex-col items-center cursor-pointer group hover:opacity-100 transition-opacity z-[50]"
        aria-label="Scroll to core"
      >
        <div className="flex flex-col items-center gap-[-24px]">
          <span className="scroll-arrow text-7xl text-[var(--mint)] font-bold select-none leading-[0.1]" style={{ animationDelay: '0s' }}>^</span>
          <span className="scroll-arrow text-7xl text-[var(--mint)] font-bold select-none leading-[0.1]" style={{ animationDelay: '0.2s' }}>^</span>
          <span className="scroll-arrow text-7xl text-[var(--mint)] font-bold select-none leading-[0.1]" style={{ animationDelay: '0.4s' }}>^</span>
        </div>
        <span className="text-[10px] tracking-[0.2em] text-[var(--mint)] mt-1 opacity-60 font-pixelify scroll-text">scroll down or click</span>
      </button>
    </section>
  );
}
