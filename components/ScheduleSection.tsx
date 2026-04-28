"use client";

import { ReactNode } from "react";
import ScheduleCarousel from "./ScheduleCarousel";

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
  const techColor = "#00110F";

  const scrollToTech = () => {
    const tech = document.getElementById('tech');
    if (tech) {
      tech.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="schedule"
      className="w-full relative min-h-[100svh] flex flex-col items-center justify-center p-0 overflow-hidden snap-start snap-always"
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
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#00110F] via-[#00110F]/80 to-transparent z-20 pointer-events-none" />

      {/* Subtle Blur for depth */}
      <div className="absolute bottom-0 left-0 w-full h-48 backdrop-blur-[1px] z-10 pointer-events-none" style={{ maskImage: 'linear-gradient(to top, black, transparent)' }} />

      <div className="relative z-40 w-full flex justify-center items-center md:-mt-10">
        {children || <ScheduleCarousel />}
      </div>

      {/* Scroll Down Button to Tech Section */}
      <button
        onClick={scrollToTech}
        className="absolute bottom-4 flex flex-col items-center cursor-pointer group hover:opacity-100 transition-opacity z-[50]"
        aria-label="Scroll to systems"
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
