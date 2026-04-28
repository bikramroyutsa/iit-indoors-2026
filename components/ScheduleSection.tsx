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
  
  return (
    <section 
      id="schedule"
      className="w-full relative min-h-[896px] flex flex-col items-center justify-center p-4 md:p-10 overflow-hidden"
      style={{
        backgroundImage: "url('/assets/iit-building.png')",
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat"
      }}
    >
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

      <div className="relative z-40 w-full flex justify-center items-center">
        {children || <ScheduleCarousel />}
      </div>
    </section>
  );
}
