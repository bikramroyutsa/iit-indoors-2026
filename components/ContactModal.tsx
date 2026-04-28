"use client";

import Portal from "./Portal";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LINKS = [
  {
    id: "email",
    label: "email",
    value: "iitindoors2026@gmail.com",
    href: "mailto:iitindoors2026@gmail.com",
  },
  {
    id: "instagram",
    label: "instagram",
    value: "@iitindoors2026",
    href: "https://instagram.com/iitindoors2026",
  },
  {
    id: "twitter",
    label: "twitter / x",
    value: "@iitindoors",
    href: "https://twitter.com/iitindoors",
  },
  {
    id: "website",
    label: "website",
    value: "iitindoors.in",
    href: "https://iitindoors.in",
  },
];

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pixel-modal-overlay p-4 animate-fade-in">
        <div className="pixel-modal-content max-w-xl w-full max-h-[90vh] overflow-y-auto animate-modal-slide-up custom-scrollbar">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-mint-soft hover:text-mint text-3xl transition-colors z-10"
            aria-label="Close modal"
          >
            ×
          </button>

          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-5xl font-bold text-mint tracking-widest uppercase">
                contact
              </h2>
              <p className="text-mint-soft opacity-60 tracking-widest text-sm md:text-base">
                get in touch
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target={link.id !== "email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1 p-4 rounded border border-mint/20 bg-mint/5 transition-all hover:-translate-y-1 hover:border-mint/50 hover:bg-mint/10"
                >
                  <span className="text-[10px] tracking-widest uppercase text-mint opacity-60">
                    {link.label}
                  </span>
                  <span className="text-lg md:text-xl font-bold text-[var(--foreground)] tracking-wide truncate">
                    {link.value}
                  </span>
                </a>
              ))}
            </div>

            <p className="text-center text-[10px] tracking-[0.3em] text-mint opacity-40 font-pixelify uppercase">
              iit indoors 2026 — we read every message
            </p>
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
