"use client";

import CreditsContent from "./CreditsContent";
import Portal from "./Portal";

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreditsModal({ isOpen, onClose }: CreditsModalProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pixel-modal-overlay p-4 animate-fade-in">
      <div className="pixel-modal-content max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-slide-up custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-mint-soft hover:text-mint text-3xl transition-colors z-10"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-5xl font-bold text-mint tracking-widest lowercase">
              credits
            </h2>
          </div>

          <CreditsContent />
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
