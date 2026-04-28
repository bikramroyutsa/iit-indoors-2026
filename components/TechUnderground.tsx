import { ReactNode } from "react";

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
  const footerColor = "#000000";
  
  return (
    <section className="w-full relative min-h-[800px] flex flex-col items-center p-10 overflow-hidden">
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
      
      <div className="container mx-auto z-10">
        {children || (
          <div className="text-center mt-20 max-w-2xl mx-auto">
            <h2 className="text-4xl text-[var(--mint)] mb-4 drop-shadow-[0_0_10px_rgba(22,219,171,0.5)]">Software Systems</h2>
            <p className="text-xl text-[var(--foreground)] bg-[#00110F]/80 p-6 rounded border border-[var(--mint)]/30 backdrop-blur">
              Continuous background repeating downward infinitely. Perfect for adding any future content, sponsors, or FAQs.
            </p>
          </div>
        )}
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
    </section>
  );
}
