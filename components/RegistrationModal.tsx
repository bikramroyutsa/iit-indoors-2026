"use client";

import { useState, useEffect } from "react";
import Portal from "./Portal";
import { useSound } from "../hooks/useSound";
import { GAMES } from "@/utils/gameInfo";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/utils/firebase";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormDataType {
  name: string;
  batch: string;
  bsse_roll: string;
  mail: string;
  phone: string;
  transactionId: string;
  selectedGames: number[];
  teammates: { [gameId: number]: string[] };
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const { playSuccessChime } = useSound();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    batch: "1",
    bsse_roll: "",
    mail: "",
    phone: "",
    transactionId: "",
    selectedGames: [],
    teammates: {},
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Play success chime when submission is successful
  useEffect(() => {
    if (isSubmitted) {
      playSuccessChime();
    }
  }, [isSubmitted, playSuccessChime]);

  if (!isOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    }
  };

  const toggleGameSelection = (gameId: number) => {
    const game = GAMES.find(g => g.id === gameId);
    setFormData((prev) => {
      const isSelected = prev.selectedGames.includes(gameId);
      const newSelectedGames = isSelected
        ? prev.selectedGames.filter((id) => id !== gameId)
        : [...prev.selectedGames, gameId];
      
      const newTeammates = { ...prev.teammates };
      if (isSelected && game?.members) {
        delete newTeammates[gameId];
      } else if (!isSelected && game?.members) {
        newTeammates[gameId] = Array(game.members - 1).fill('');
      }
      
      return {
        ...prev,
        selectedGames: newSelectedGames,
        teammates: newTeammates,
      };
    });
  };

  const updateTeammate = (gameId: number, index: number, name: string) => {
    setFormData((prev) => ({
      ...prev,
      teammates: {
        ...prev.teammates,
        [gameId]: prev.teammates[gameId].map((n, i) => i === index ? name : n),
      },
    }));
  };

  const handleGameDetailsNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const selectedGames = GAMES.filter((g) => formData.selectedGames.includes(g.id));
  const selectedMultiplayerGames = GAMES.filter(
    (g) => g.type === "multiplayer" && formData.selectedGames.includes(g.id)
  );

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Map game IDs to names
      const selectedGameNames = formData.selectedGames.map(
        id => GAMES.find(g => g.id === id)?.name || String(id)
      );
      
      // Update teammates map to use game names as keys
      const teammatesByName: Record<string, string[]> = {};
      Object.entries(formData.teammates).forEach(([gameIdStr, mates]) => {
        const gameId = parseInt(gameIdStr);
        const gameName = GAMES.find(g => g.id === gameId)?.name || gameIdStr;
        teammatesByName[gameName] = mates;
      });

      const totalPayment = formData.selectedGames.reduce((sum, gameId) => {
        const game = GAMES.find((g) => g.id === gameId);
        return sum + (game?.fee || 0);
      }, 0);

      const submissionData = {
        ...formData,
        selectedGames: selectedGameNames,
        teammates: teammatesByName,
        total_payment: totalPayment,
        status: "pending",
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "registrations"), submissionData);
      console.log("Final Form Data:", submissionData);
      setIsSubmitted(true);
      // Auto-close after 2.5 seconds on success
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setStep(1);
        setFormData({
          name: "",
          batch: "1",
          bsse_roll: "",
          mail: "",
          phone: "",
          transactionId: "",
          selectedGames: [],
          teammates: {},
        });
      }, 2500);
    } catch (error) {
      console.error("Error saving registration: ", error);
      alert("Error saving registration. Please try again.");
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pixel-modal-overlay p-4 animate-fade-in">
        <div className="pixel-modal-content animate-modal-slide-up max-h-[90vh] w-[min(92vw,720px)] overflow-hidden flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-mint-soft hover:text-mint text-2xl transition-colors"
            aria-label="Close modal"
          >
            ×
          </button>

          <div className="custom-scrollbar flex-1 overflow-y-auto px-1 md:px-2 pt-6 pb-2">
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
            ) : step === 1 ? (
              <>
                <h2 className="text-2xl font-bold mb-8 text-mint tracking-widest text-center">
                  register now
                </h2>

                <form onSubmit={handleNextStep} className="flex flex-col gap-6">
                <div className="space-y-2">
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

                <div className="space-y-2">
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

                <div className="space-y-2">
                  <label htmlFor="bsse_roll" className="pixel-label">bsse roll number</label>
                  <input
                    id="bsse_roll"
                    type="number"
                    required
                    className="pixel-input"
                    value={formData.bsse_roll}
                    onChange={(e) => setFormData({ ...formData, bsse_roll: e.target.value })}
                    placeholder="e.g., 12345"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="mail" className="pixel-label">email</label>
                  <input
                    id="mail"
                    type="email"
                    required
                    className="pixel-input"
                    value={formData.mail}
                    onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
                    placeholder="your.email@iit.com"
                  />
                </div>

                <div className="space-y-2">
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

                <button type="submit" className="pixel-button mt-6 w-full">
                  next
                </button>
                </form>
              </>
            ) : step === 2 ? (
              <>
                <h2 className="text-2xl font-bold mb-8 text-mint tracking-widest text-center">
                  select games
                </h2>

                <form onSubmit={handleGameDetailsNext} className="flex flex-col gap-7">
                {/* Single Player Games */}
                <div className="bg-deep-teal border-2 border-mint rounded-lg p-5 md:p-6">
                  <h3 className="text-lg font-bold text-mint mb-4 tracking-widest uppercase">single player</h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {GAMES.filter(g => g.type === 'single').map((game) => (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => toggleGameSelection(game.id)}
                        className={`px-4 py-2.5 font-pixelify text-sm font-bold transition-all duration-200 border-2 rounded-md ${
                          formData.selectedGames.includes(game.id)
                            ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] drop-shadow-[0_0_8px_rgba(22,219,171,0.8)] scale-110 transform"
                            : "bg-deep-teal text-mint border-mint-soft hover:border-mint hover:bg-opacity-80"
                        }`}
                      >
                        {game.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Multiplayer Games */}
                <div className="bg-deep-teal border-2 border-mint rounded-lg p-5 md:p-6">
                  <h3 className="text-lg font-bold text-mint mb-4 tracking-widest uppercase">multiplayer</h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {GAMES.filter(g => g.type === 'multiplayer').map((game) => (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => toggleGameSelection(game.id)}
                        className={`px-4 py-2.5 font-pixelify text-sm font-bold transition-all duration-200 border-2 rounded-md ${
                          formData.selectedGames.includes(game.id)
                            ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] drop-shadow-[0_0_8px_rgba(22,219,171,0.8)] scale-110 transform"
                            : "bg-deep-teal text-mint border-mint-soft hover:border-mint hover:bg-opacity-80"
                        }`}
                      >
                        {game.name}
                      </button>
                    ))
                  }
                  </div>
                </div>

                {/* Teammate Names Section */}
                {selectedMultiplayerGames.length > 0 && (
                  <div className="bg-deep-teal border-2 border-mint rounded-lg p-5 md:p-6">
                    <h3 className="text-lg font-bold text-mint mb-4 tracking-widest uppercase">team members</h3>
                    <div className="space-y-5">
                      {selectedMultiplayerGames.map((game) => (
                        <div key={game.id} className="bg-deep-teal/50 border border-mint-soft rounded-md p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-mint font-bold capitalize text-sm">{game.name}</h4>
                            <span className="text-mint-soft text-xs bg-mint/20 px-2 py-1 rounded">
                              {game.members ? `${game.members - 1} more member${game.members - 1 !== 1 ? 's' : ''}` : ''}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {formData.teammates[game.id]?.map((teammate, idx) => (
                              <input
                                key={idx}
                                type="text"
                                placeholder={`teammate ${idx + 1}`}
                                value={teammate}
                                onChange={(e) => updateTeammate(game.id, idx, e.target.value)}
                                className="pixel-input w-full text-sm"
                                required
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2 flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="pixel-button w-full bg-opacity-50 hover:bg-opacity-75"
                  >
                    back
                  </button>
                  <button type="submit" className="pixel-button w-full" disabled={formData.selectedGames.length === 0}>
                    next
                  </button>
                </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-8 text-mint tracking-widest text-center">
                  payment details
                </h2>

                <form onSubmit={handleFinalSubmit} className="flex flex-col gap-7">
                {selectedGames.length > 0 && (
                  <div className="bg-deep-teal border-2 border-mint rounded-lg p-5 md:p-6">
                    <h3 className="text-lg font-bold text-mint mb-3 tracking-widest uppercase">registration fees</h3>
                    <div className="space-y-3 mb-4">
                      {selectedGames.map((game) => (
                        <div key={game.id} className="flex justify-between items-center text-mint-soft text-sm border-b border-mint-soft pb-1">
                          <span className="capitalize">{game.name}</span>
                          <span className="font-bold">৳ {game.fee}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t-2 border-mint pt-3 flex justify-between items-center">
                      <span className="text-mint font-bold tracking-widest uppercase">total payment</span>
                      <span className="text-2xl font-bold text-mint drop-shadow-[0_0_8px_rgba(22,219,171,0.8)]">
                        ৳ {selectedGames.reduce((sum, g) => sum + g.fee, 0)}
                      </span>
                    </div>

                    <div className="mt-5 space-y-3 border-t border-mint-soft/40 pt-4">
                      <p className="text-mint-soft text-sm leading-relaxed">
                        Payment instructions placeholder: add your preferred payment method details,
                        account number, and exact transfer steps here later.
                      </p>

                      <div className="space-y-2">
                        <label htmlFor="transactionId" className="pixel-label">transaction id</label>
                        <input
                          id="transactionId"
                          type="text"
                          required
                          className="pixel-input"
                          value={formData.transactionId}
                          onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                          placeholder="enter your payment transaction id"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-2 flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="pixel-button w-full bg-opacity-50 hover:bg-opacity-75"
                  >
                    back
                  </button>
                  <button type="submit" className="pixel-button w-full">
                    submit
                  </button>
                </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
