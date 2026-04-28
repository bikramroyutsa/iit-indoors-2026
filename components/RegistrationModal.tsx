"use client";

import { useState } from "react";
import Portal from "./Portal";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    batch: "1",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    setIsSubmitted(true);
    // Auto-close after 2 seconds on success
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setFormData({ name: "", phone: "", batch: "1" });
    }, 2500);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pixel-modal-overlay p-4 animate-fade-in">
        <div className="pixel-modal-content animate-modal-slide-up">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-mint-soft hover:text-mint text-2xl transition-colors"
            aria-label="Close modal"
          >
            ×
          </button>

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-10 animate-success-pop">
              <div className="text-6xl mb-4">👾</div>
              <h2 className="text-2xl font-bold text-mint tracking-widest text-center mb-2">
                success!
              </h2>
              <p className="text-mint-soft text-center font-pixelify">
                you have been registered for iit indoors 2026.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6 text-mint tracking-widest text-center">
                register now
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="name" className="pixel-label">name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="pixel-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="pixel-label">phone number</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    className="pixel-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01xxxxxxxxx"
                  />
                </div>

                <div>
                  <label htmlFor="batch" className="pixel-label">iit batch</label>
                  <select
                    id="batch"
                    className="pixel-input cursor-pointer"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  >
                    {Array.from({ length: 18 }, (_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-deep-teal">
                        batch {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="pixel-button mt-4 w-full">
                  submit
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </Portal>
  );
}
