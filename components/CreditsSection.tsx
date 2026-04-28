"use client";

import { useState } from "react";
import CreditsModal from "./CreditsModal";

export default function CreditsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={() => setIsModalOpen(true)}
        className="pixel-button text-xl md:text-2xl"
      >
        view credits
      </button>
      <p className="text-mint-soft/40 text-sm tracking-[0.3em] font-pixelify uppercase">
        behind the mainframe
      </p>

      <CreditsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
