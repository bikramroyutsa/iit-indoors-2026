"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import ScheduleCarousel from "./ScheduleCarousel";
import { useSound } from "../hooks/useSound";

interface ScheduleSectionProps {
  children?: ReactNode;
}

const getGroundDither = (c1: string, c2: string) => {
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

export default function ScheduleSection({ children }: ScheduleSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { playDigitalBird } = useSound();
  const [isInView, setIsInView] = useState(false);
  const techColor = "#00110F";

  // Intersection Observer to detect when schedule is in view
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
  useEffect(() => {
    if (!isInView) return;

    const playRandomChirp = () => {
      playDigitalBird();
      // Random delay between chirps: 0.8-3 seconds
      const nextDelay = 800 + Math.random() * 2200;
      timeoutId = setTimeout(playRandomChirp, nextDelay);
    };

    let timeoutId = setTimeout(playRandomChirp, 1500);
    return () => clearTimeout(timeoutId);
  }, [isInView, playDigitalBird]);

  return (
    <section
      ref={sectionRef}
      id="schedule"
      className="w-full relative h-[100svh] flex flex-col items-center justify-start pt-4 md:pt-8 p-0 overflow-hidden snap-start snap-always z-50"
      style={{
        backgroundImage: "url('/assets/iit-building.png')",
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat"
      }}
    >
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

      {/* Ground Dither Transition */}
      <div
        className="absolute bottom-0 left-0 w-full h-[32px] z-30 pointer-events-none"
        style={{
          backgroundImage: getGroundDither('transparent', techColor),
          transform: 'scaleY(-1)'
        }}
      />

      {/* Dramatic Ground Fog / Glow */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />

      {/* Subtle Blur for depth */}
      <div className="absolute bottom-0 left-0 w-full h-48 backdrop-blur-[1px] z-10 pointer-events-none" style={{ maskImage: 'linear-gradient(to top, black, transparent)' }} />

      <div className="relative z-40 w-full flex flex-col justify-center items-center">
        {children || <ScheduleCarousel />}
        
        {/* Subtle ground-level hint of tech */}
        <div className="mt-8 opacity-20 pointer-events-none flex flex-col items-center">
          <div className="w-1 h-12 bg-gradient-to-b from-transparent to-[var(--mint)]" />
          <div className="w-24 h-1 bg-[var(--mint)] blur-[2px]" />
          <span className="text-[8px] tracking-[0.4em] text-[var(--mint)] mt-2 uppercase font-pixelify">system interface active</span>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-4 flex flex-col items-center pointer-events-none opacity-60 z-[50]">
        <div className="flex flex-col items-center gap-[-24px]">
          <span className="scroll-arrow text-7xl text-[var(--mint)] font-bold select-none leading-[0.1]" style={{ animationDelay: '0s' }}>^</span>
          <span className="scroll-arrow text-7xl text-[var(--mint)] font-bold select-none leading-[0.1]" style={{ animationDelay: '0.2s' }}>^</span>
          <span className="scroll-arrow text-7xl text-[var(--mint)] font-bold select-none leading-[0.1]" style={{ animationDelay: '0.4s' }}>^</span>
        </div>
        <span className="text-[10px] tracking-[0.2em] text-[var(--mint)] mt-1 opacity-60 font-pixelify scroll-text">scroll</span>
      </div>


    </section>
  );
}
