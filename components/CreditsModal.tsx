"use client";

import { useEffect } from "react";
import CreditsContent from "./CreditsContent";
import Portal from "./Portal";

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: any[];
}

export default function CreditsModal({ isOpen, onClose, team }: CreditsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pixel-modal-overlay p-4 animate-fade-in">
      <div className="pixel-modal-content max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-slide-up custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-mint-soft hover:text-mint flex flex-col items-center transition-colors z-10"
          aria-label="Close modal"
        >
          <span className="text-3xl leading-none">×</span>
          <span className="text-[10px] font-pixelify leading-none mt-1 font-normal">esc</span>
        </button>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-5xl font-bold text-mint tracking-widest lowercase">
              credits
            </h2>
          </div>

          <CreditsContent team={team} />
        </div>
      </div>
      
      {/* Click outside to close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
      />
    </div>
    </Portal>
  );
}
