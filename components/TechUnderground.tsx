"use client";

import { ReactNode, useRef, useState } from "react";
import { useScroll } from "framer-motion";
import CreditsSection from "./CreditsSection";

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

  // Auto-scroll logic removed to allow for fluid scroll experience


  return (
    <section ref={containerRef} id="tech" className="w-full relative h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-black">
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

      {/* Background Collage Layer - Original Color */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/assets/collage.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Slight Dark Overlay for Readability */}
      <div className="absolute inset-0 z-[1] bg-black/55 pointer-events-none" />

      {/* Top Seam Overlay for the landing section */}
      <div
        className="absolute top-0 left-0 w-full h-40 z-[2] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 32%, rgba(0,0,0,0.14) 76%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Sharp Pixelated Overlay Removed */}

      <div className="relative z-10 w-full flex flex-col items-center gap-12 md:gap-20">
        {children}
        <CreditsSection />
      </div>
    </section>
  );
}
