"use client";

import { useEffect } from "react";
import Portal from "./Portal";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const CONTACTS = [
  {
    name: "Md. Shamsul Arefin",
    email: "bsse1732@iit.du.ac.bd",
    phone: "01568169498",
    facebook: "https://www.facebook.com/arefin.adeeb",
  },
  {
    name: "Abdul Zoher Imon",
    email: "bsse1743@iit.du.ac.bd",
    phone: "01707984667",
    facebook: "https://www.facebook.com/abdul.zoher.imon",
  },
  {
    name: "Al Araf Apon",
    email: "bsse1742@iit.du.ac.bd",
    phone: "01603464470",
    facebook: "https://www.facebook.com/al.araf.apon.2025",
  },
];

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
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
        <div className="pixel-modal-content max-w-xl w-full max-h-[90vh] overflow-y-auto animate-modal-slide-up custom-scrollbar">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-mint-soft hover:text-mint flex flex-col items-center transition-colors z-10"
            aria-label="Close modal"
          >
            <span className="text-3xl leading-none">×</span>
            <span className="text-[10px] font-pixelify leading-none mt-1 font-normal">esc</span>
          </button>

          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-5xl font-bold text-mint tracking-widest lowercase">
                contact
              </h2>
              <p className="text-mint-soft opacity-60 tracking-widest text-sm md:text-base">
                get in touch
              </p>
            </div>


            <div className="space-y-4">
              <h3 className="text-center text-sm md:text-base tracking-[0.35em] uppercase text-mint opacity-70 font-pixelify">
                contact persons
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {CONTACTS.map((person) => (
                  <div
                    key={person.email}
                    className="flex flex-col gap-3 p-4 rounded border border-mint/20 bg-mint/5 transition-all"
                  >
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-mint opacity-60">name</p>
                      <p className="text-lg md:text-xl font-bold text-[var(--foreground)] tracking-wide">
                        {person.name}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href={`mailto:${person.email}`}
                        className="rounded border border-mint/20 px-3 py-2 transition-colors hover:border-mint/50 hover:bg-mint/10"
                      >
                        <span className="block text-[10px] uppercase tracking-[0.3em] text-mint opacity-60">email</span>
                        <span className="block text-sm md:text-base break-all text-[var(--foreground)]">
                          {person.email}
                        </span>
                      </a>

                      <a
                        href={`tel:${person.phone}`}
                        className="rounded border border-mint/20 px-3 py-2 transition-colors hover:border-mint/50 hover:bg-mint/10"
                      >
                        <span className="block text-[10px] uppercase tracking-[0.3em] text-mint opacity-60">contact no</span>
                        <span className="block text-sm md:text-base text-[var(--foreground)]">
                          {person.phone}
                        </span>
                      </a>
                    </div>

                    <a
                      href={person.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-mint/20 px-3 py-2 transition-colors hover:border-mint/50 hover:bg-mint/10"
                    >
                      <span className="block text-[10px] uppercase tracking-[0.3em] text-mint opacity-60">fb id link</span>
                      <span className="block text-sm md:text-base break-all text-[var(--foreground)]">
                        {person.facebook}
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-[10px] tracking-[0.3em] text-mint opacity-40 font-pixelify lowercase">
              iit indoors 2026
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
