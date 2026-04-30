"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useSound } from "../hooks/useSound";

interface SkySectionProps {
  children: ReactNode;
}

const getDitherSVG = (c1: string, c2: string) => {
  // Creates a mathematically perfect 4-step pixel dither transition
  // 16x16 SVG, 4x4 pixel blocks for a finer texture
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
    <rect width="16" height="16" fill="${c1}" />
    <!-- 25% density -->
    <rect x="4" y="0" width="4" height="4" fill="${c2}" />
    <!-- 50% density -->
    <rect x="0" y="4" width="4" height="4" fill="${c2}" />
    <rect x="8" y="4" width="4" height="4" fill="${c2}" />
    <!-- 50% density offset -->
    <rect x="4" y="8" width="4" height="4" fill="${c2}" />
    <rect x="12" y="8" width="4" height="4" fill="${c2}" />
    <!-- 75% density -->
    <rect x="0" y="12" width="16" height="4" fill="${c2}" />
    <rect x="0" y="12" width="4" height="4" fill="${c1}" />
  </svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

export default function SkySection({ children }: SkySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const c1 = "#004650";
  const c2 = "#00556C";
  const c3 = "#006488";
  const c4 = "#0073A3";
  const c5 = "#0083BF";
  const c6 = "#0092DB"; // Building top edge color

  // Intersection Observer to detect when sky is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Ambient Birds Logic
  const { startBirds, stopBirds } = useSound();
  useEffect(() => {
    if (isInView) {
      startBirds();
      return () => stopBirds();
    }
  }, [isInView, startBirds, stopBirds]);

  const scrollToSchedule = () => {
    const schedule = document.getElementById('schedule');
    if (schedule) {
      schedule.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="sky"
      className="w-full relative z-10 flex flex-col items-center justify-center h-[100svh] p-10 snap-start snap-always"
      style={{
        background: `linear-gradient(
          to bottom,
          ${c1} 0%, ${c1} 20%,
          ${c2} 20%, ${c2} 40%,
          ${c3} 40%, ${c3} 60%,
          ${c4} 60%, ${c4} 80%,
          ${c5} 80%, ${c5} 100%
        )`
      }}
    >
      <style>{`
        @keyframes drift {
          from { transform: translateX(-200px); }
          to { transform: translateX(110vw); }
        }
        @keyframes arrow-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(10px); opacity: 1; }
        }
        @keyframes text-blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.6; }
        }
        .pixel-cloud {
          position: absolute;
          image-rendering: pixelated;
          animation: drift linear infinite;
          opacity: 0.8;
          pointer-events: none;
        }
        .scroll-arrow {
          animation: arrow-bounce 2s infinite ease-in-out;
        }
        .scroll-text {
          animation: text-blink 0.4s steps(1, start) infinite;
        }
      `}</style>

      {/* Cloud layer wrapper (keeps clouds from spilling out of the sky) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cloud 1 - Slow, big, background */}
        <img 
          src="/assets/cloud1.svg" 
          className="pixel-cloud top-[15%] w-56 h-auto opacity-40" 
          style={{ animationDuration: '55s', animationDelay: '-10s' }} 
          alt="" 
          aria-hidden 
        />
        
        {/* Cloud 2 - Faster, smaller, foreground */}
        <img 
          src="/assets/cloud2.svg" 
          className="pixel-cloud top-[35%] w-36 h-auto opacity-70" 
          style={{ animationDuration: '35s', animationDelay: '-5s' }} 
          alt="" 
          aria-hidden 
        />

        {/* Cloud 1 - Medium, midground */}
        <img 
          src="/assets/cloud1.svg" 
          className="pixel-cloud top-[65%] w-48 h-auto opacity-60" 
          style={{ animationDuration: '45s', animationDelay: '-25s' }} 
          alt="" 
          aria-hidden 
        />

        {/* Cloud 2 - Very slow, far background */}
        <img 
          src="/assets/cloud2.svg" 
          className="pixel-cloud top-[80%] w-28 h-auto opacity-30" 
          style={{ animationDuration: '70s', animationDelay: '0s' }} 
          alt="" 
          aria-hidden 
        />
      </div>
      
      {/* Dither Junction Layers */}
      <div className="absolute left-0 w-full h-[16px] pointer-events-none" style={{ top: 'calc(20% - 8px)', backgroundImage: getDitherSVG(c1, c2) }} />
      <div className="absolute left-0 w-full h-[16px] pointer-events-none" style={{ top: 'calc(40% - 8px)', backgroundImage: getDitherSVG(c2, c3) }} />
      <div className="absolute left-0 w-full h-[16px] pointer-events-none" style={{ top: 'calc(60% - 8px)', backgroundImage: getDitherSVG(c3, c4) }} />
      <div className="absolute left-0 w-full h-[16px] pointer-events-none" style={{ top: 'calc(80% - 8px)', backgroundImage: getDitherSVG(c4, c5) }} />
      {/* Bottom transition at the end of the sky section */}
      <div className="absolute left-0 w-full h-[16px] pointer-events-none" style={{ bottom: 0, backgroundImage: getDitherSVG(c5, c6) }} />

      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>

      {/* Scroll Down Button to Schedule Section */}
      <button 
        onClick={scrollToSchedule}
        className="absolute bottom-6 flex flex-col items-center cursor-pointer group hover:opacity-100 transition-opacity"
        aria-label="Scroll to schedule"
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
