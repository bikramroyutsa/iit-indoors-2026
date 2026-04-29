"use client";

import { useSound } from "../hooks/useSound";

export default function AudioToggle() {
  const { isMuted, toggleMute } = useSound();

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-[999] group"
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
    >
      <div className={`
        relative px-4 py-2 border-4 border-black 
        ${isMuted ? "bg-black text-[#16dbab]" : "bg-[#f4f1ea] text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"}
        transition-all flex items-center gap-3
      `}>
        {/* Pixel Speaker Icon */}
        <div className="relative w-5 h-5 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full fill-current"
            style={{ imageRendering: 'pixelated' }}
          >
            <path d="M6 9h4l5-5v16l-5-5H6V9z" />
            {!isMuted && (
              <path d="M18 8h2v2h-2zm2 2h2v4h-2zm-2 4h2v2h-2z" />
            )}
          </svg>
          {isMuted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-red-600 rotate-45 shadow-[2px_2px_0_0_rgba(0,0,0,1)]" />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
