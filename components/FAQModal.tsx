"use client";

import { useState } from "react";
import Portal from "./Portal";

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQ = [
  {
    q: "when is iit indoors 2026?",
    a: "the event is scheduled for early 2026. stay tuned on our socials for exact dates.",
  },
  {
    q: "how do i register?",
    a: "registration links will be published on our website and social media channels.",
  },
  {
    q: "who can participate?",
    a: "iit indoors is open to all iit students and invited guests. check the event page for eligibility.",
  },
  {
    q: "i have a sponsorship inquiry.",
    a: "reach out to us via email and we'll connect you with the sponsorship team.",
  },
];

export default function FAQModal({ isOpen, onClose }: FAQModalProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
                faq
              </h2>
              <p className="text-mint-soft opacity-60 tracking-widest text-sm md:text-base">
                intel core
              </p>
            </div>

            <div className="space-y-4 pr-2">
              {FAQ.map((item, i) => (
                <div
                  key={i}
                  className="border-2 border-mint/20 bg-mint/5 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left tracking-wide transition-colors hover:bg-mint/10"
                    style={{ color: "var(--foreground)" }}
                  >
                    <span className="text-base md:text-lg font-bold lowercase">{item.q}</span>
                    <span
                      className="shrink-0 text-xl font-bold transition-transform duration-300 text-mint"
                      style={{
                        transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: openFaq === i ? "200px" : "0px", opacity: openFaq === i ? 1 : 0 }}
                  >
                    <p className="px-4 pb-4 text-sm md:text-base leading-relaxed text-[var(--foreground)] opacity-60">
                      {item.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-[10px] tracking-[0.3em] text-mint opacity-40 font-pixelify uppercase">
              iit indoors 2026 — knowledge base
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
