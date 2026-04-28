"use client";

import { useState } from "react";
import CreditsModal from "./CreditsModal";
import ContactModal from "./ContactModal";
import FAQModal from "./FAQModal";

export default function CreditsSection() {
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <button
          onClick={() => setIsContactOpen(true)}
          className="pixel-button text-xl md:text-2xl"
        >
          contact
        </button>

        <button
          onClick={() => setIsFAQOpen(true)}
          className="pixel-button text-xl md:text-2xl"
        >
          faq
        </button>

        <button
          onClick={() => setIsCreditsOpen(true)}
          className="pixel-button text-xl md:text-2xl"
        >
          view credits
        </button>
      </div>
      
      <p className="text-mint-soft/40 text-sm tracking-[0.3em] font-pixelify uppercase">
        behind the mainframe
      </p>

      <CreditsModal 
        isOpen={isCreditsOpen} 
        onClose={() => setIsCreditsOpen(false)} 
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
