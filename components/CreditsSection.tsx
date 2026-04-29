"use client";

import { useState } from "react";
import CreditsModal from "./CreditsModal";
import ContactModal from "./ContactModal";
import FAQModal from "./FAQModal";

export default function CreditsSection() {
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [shuffledTeam, setShuffledTeam] = useState<any[]>([]);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  const TEAM = [
    { name: "bikram roy utsa" },
    { name: "saeed ahmed mahin" },
    { name: "md. rakinuzzaman talukder" },
  ];

  const handleOpenCredits = () => {
    const array = [...TEAM];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setShuffledTeam(array);
    setIsCreditsOpen(true);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <button
          onClick={() => setIsContactOpen(true)}
          className="pixel-button text-sm md:text-base opacity-70 hover:opacity-100 transition-opacity scale-75 md:scale-90"
        >
          contact
        </button>

        <button
          onClick={() => setIsFAQOpen(true)}
          className="pixel-button text-sm md:text-base opacity-70 hover:opacity-100 transition-opacity scale-75 md:scale-90"
        >
          faq
        </button>

        <button
          onClick={handleOpenCredits}
          className="pixel-button text-sm md:text-base opacity-70 hover:opacity-100 transition-opacity scale-75 md:scale-90"
        >
          view credits
        </button>
      </div>
      
      {/* <p className="text-mint-soft/40 text-sm tracking-[0.3em] font-pixelify uppercase">
        behind the mainframe
      </p> */}

      <CreditsModal 
        isOpen={isCreditsOpen} 
        onClose={() => setIsCreditsOpen(false)}
        team={shuffledTeam}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <FAQModal
        isOpen={isFAQOpen}
        onClose={() => setIsFAQOpen(false)}
      />
    </div>
  );
}
