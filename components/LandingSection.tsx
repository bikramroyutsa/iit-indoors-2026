"use client";

import { useState } from "react";
import Hero from "./Hero";
import RegistrationModal from "./RegistrationModal";

export default function LandingSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col w-full items-center">
      {/* Hero Section - Centered on screen */}
      <div className="min-h-screen flex flex-col items-center justify-center w-full relative">
        <Hero />
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce text-mint-soft opacity-70">
          <p className="text-xs tracking-widest mb-2 font-pixelify">scroll down</p>
          <div className="w-1 h-8 bg-mint mx-auto rounded-full shadow-[0_0_8px_var(--mint)]"></div>
        </div>
      </div>

      {/* Registration CTA Section - Appears on scroll */}
      <div className="py-32 flex flex-col items-center gap-8 w-full text-center px-6 pixel-pattern cta-glow">
        <div className="space-y-4 max-w-2xl">
          <h3 className="text-xl md:text-2xl font-pixelify text-mint-soft tracking-widest animate-pulse">
            ready to show your skills?
          </h3>
          <p className="text-4xl md:text-6xl font-pixelify text-mint font-bold tracking-widest drop-shadow-[0_0_15px_rgba(22,219,171,0.5)]">
            why wait?<br />register now!
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="pixel-button scale-125 mt-8 hover:scale-135 transition-transform animate-bounce-subtle"
        >
          register now
        </button>
      </div>

      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
