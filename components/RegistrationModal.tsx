"use client";

import { useState, useEffect } from "react";
import Portal from "./Portal";
import { useSound } from "../hooks/useSound";
import { GAMES } from "@/utils/gameInfo";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { z } from "zod";
import { registrationSchema } from "@/utils/validation";

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
  paymentMethod: string;
  selectedGames: number[];
  teammates: { [gameId: number]: string[] };
  cocPlayerId: string;
  cocTownHall: string;
  pesOvr: string;
  pesPlayerId: string;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const { playSuccessChime } = useSound();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    batch: "1",
    bsse_roll: "",
    mail: "",
    phone: "",
    paymentMethod: "",
    transactionId: "",
    selectedGames: [],
    teammates: {},
    cocPlayerId: "",
    cocTownHall: "",
    pesOvr: "",
    pesPlayerId: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Play success chime when submission is successful
  useEffect(() => {
    if (isSubmitted) {
      playSuccessChime();
    }
  }, [isSubmitted, playSuccessChime]);

  if (!isOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      // Validate step 1 fields
      registrationSchema.pick({
        name: true,
        batch: true,
        bsse_roll: true,
        mail: true,
        phone: true,
      }).parse(formData);

      if (step === 1) {
        setStep(2);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.issues.map((issue) => issue.message).join("\n"));
      }
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
    setErrorMessage(null);
    try {
      // Validate step 2 fields
      registrationSchema.pick({
        selectedGames: true,
        teammates: true,
      }).parse(formData);

      setStep(3);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.issues.map((issue) => issue.message).join("\n"));
      }
    }
  };

  const selectedGames = GAMES.filter((g) => formData.selectedGames.includes(g.id));
  const selectedMultiplayerGames = GAMES.filter(
    (g) => g.type === "multiplayer" && formData.selectedGames.includes(g.id)
  );

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      // Validate all fields before final submission
      const validatedData = registrationSchema.parse(formData);
      setIsSubmitting(true);

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
        ...validatedData,
        selectedGames: selectedGameNames,
        teammates: teammatesByName,
        total_payment: totalPayment,
        status: "pending",
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "registrations"), submissionData);
      console.log("Final Form Data:", submissionData);
      setIsSubmitting(false);
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
          paymentMethod: "",
          transactionId: "",
          selectedGames: [],
          teammates: {},
          cocPlayerId: "",
          cocTownHall: "",
          pesOvr: "",
          pesPlayerId: "",
        });
      }, 2500);
    } catch (error) {
      setIsSubmitting(false);
      if (error instanceof z.ZodError) {
        setErrorMessage(error.issues.map((issue) => issue.message).join("\n"));
        return;
      }
      console.error("Error saving registration: ", error);
      setErrorMessage("Error saving registration. Please try again.");
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pixel-modal-overlay p-4 animate-fade-in">
        <div className="pixel-modal-content animate-modal-slide-up max-h-[90vh] w-[min(92vw,720px)] overflow-y-auto custom-scrollbar relative">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute top-4 right-4 z-20 text-mint-soft hover:text-mint text-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            ×
          </button>

          {isSubmitting && (
            <div className="absolute inset-0 bg-deep-teal/80 z-[100] flex items-center justify-center backdrop-blur-sm animate-fade-in">
              <div className="flex flex-col items-center">
                <div className="text-6xl mb-4 animate-spin">⏳</div>
                <h2 className="text-2xl font-bold text-mint tracking-widest text-center mb-2 animate-pulse">
                  processing...
                </h2>
                <p className="text-mint-soft text-center font-pixelify">
                  saving your registration
                </p>
              </div>
            </div>
          )}

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
                    {Array.from({ length: 18 }, (_, i) => i + 1).filter(i => i !== 17).map((batchNum) => (
                      <option key={batchNum} value={batchNum} className="bg-deep-teal">
                        batch {batchNum}
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
                    placeholder="e.g., 1702"
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
                    placeholder="mail@example.com"
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

                {errorMessage && (
                  <div className="rounded-lg border-2 border-red-400/70 bg-red-500/10 p-4 text-sm text-red-200 whitespace-pre-line font-pixelify">
                    {errorMessage}
                  </div>
                )}
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
                    {GAMES.filter(g => g.type === 'single' && g.reg_req).map((game) => (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => toggleGameSelection(game.id)}
                        className={`px-4 py-2.5 font-pixelify text-sm font-bold transition-all duration-200 border-2 rounded-md ${formData.selectedGames.includes(game.id)
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
                    {GAMES.filter(g => g.type === 'multiplayer' && g.reg_req).map((game) => (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => toggleGameSelection(game.id)}
                        className={`px-4 py-2.5 font-pixelify text-sm font-bold transition-all duration-200 border-2 rounded-md ${formData.selectedGames.includes(game.id)
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
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <h4 className="text-mint font-bold capitalize text-sm">{game.name}</h4>
                            <span className="text-mint-soft text-[10px] sm:text-xs bg-mint/20 px-2 py-1 rounded w-fit">
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

                {/* Game Specific Details */}
                {(formData.selectedGames.includes(19) || formData.selectedGames.includes(18)) && (
                  <div className="bg-deep-teal border-2 border-mint rounded-lg p-5 md:p-6">
                    <h3 className="text-lg font-bold text-mint mb-4 tracking-widest uppercase">game details</h3>
                    <div className="space-y-5">
                      {formData.selectedGames.includes(19) && (
                        <div className="space-y-3">
                          <h4 className="text-mint font-bold capitalize text-sm">Clash of Clans</h4>
                          <input type="text" placeholder="Player ID (#TAG)" className="pixel-input w-full text-sm" required value={formData.cocPlayerId} onChange={e => setFormData({ ...formData, cocPlayerId: e.target.value })} />
                          <input type="text" placeholder="Town Hall Level" className="pixel-input w-full text-sm" required value={formData.cocTownHall} onChange={e => setFormData({ ...formData, cocTownHall: e.target.value })} />
                        </div>
                      )}
                      {formData.selectedGames.includes(18) && (
                        <div className="space-y-3">
                          <h4 className="text-mint font-bold capitalize text-sm">PES</h4>
                          <input type="text" placeholder="Player ID" className="pixel-input w-full text-sm" required value={formData.pesPlayerId} onChange={e => setFormData({ ...formData, pesPlayerId: e.target.value })} />
                          <input type="text" placeholder="OVR" className="pixel-input w-full text-sm" required value={formData.pesOvr} onChange={e => setFormData({ ...formData, pesOvr: e.target.value })} />
                        </div>
                      )}
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

                {errorMessage && (
                  <div className="rounded-lg border-2 border-red-400/70 bg-red-500/10 p-4 text-sm text-red-200 whitespace-pre-line font-pixelify">
                    {errorMessage}
                  </div>
                )}
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
                      <div className="text-mint-soft text-sm leading-relaxed mb-4 space-y-2">
                        <p>Please select your preferred payment method and enter the transaction ID after payment.</p>
                        <div className="py-4 text-center bg-black/20 rounded-lg border border-mint/30 my-3">
                          <p className="text-mint-soft text-sm uppercase tracking-wider mb-1">Payment Number</p>
                          <p className="text-3xl font-bold text-mint tracking-wider font-pixelify drop-shadow-[0_0_8px_rgba(22,219,171,0.5)]">
                            01707984667
                          </p>
                          <p className="text-xs text-mint-soft mt-2 uppercase tracking-wide">(Bkash & Nagad - personal send money)</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <label className="pixel-label block">payment method</label>
                        <div className="flex gap-4">
                          <label className={`flex-1 flex items-center justify-center p-3 border-2 rounded-md cursor-pointer font-pixelify transition-all duration-200 ${formData.paymentMethod === 'bkash'
                            ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] drop-shadow-[0_0_8px_rgba(22,219,171,0.8)] scale-105 transform z-10 font-bold"
                            : "bg-deep-teal text-mint border-mint-soft hover:border-mint hover:bg-opacity-80 font-bold"
                            }`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="bkash"
                              checked={formData.paymentMethod === 'bkash'}
                              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                              className="hidden"
                            />
                            <span className="tracking-widest uppercase">bKash</span>
                          </label>
                          <label className={`flex-1 flex items-center justify-center p-3 border-2 rounded-md cursor-pointer font-pixelify transition-all duration-200 ${formData.paymentMethod === 'nagad'
                            ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] drop-shadow-[0_0_8px_rgba(22,219,171,0.8)] scale-105 transform z-10 font-bold"
                            : "bg-deep-teal text-mint border-mint-soft hover:border-mint hover:bg-opacity-80 font-bold"
                            }`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="nagad"
                              checked={formData.paymentMethod === 'nagad'}
                              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                              className="hidden"
                            />
                            <span className="tracking-widest uppercase">Nagad</span>
                          </label>
                        </div>
                      </div>

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
                    disabled={isSubmitting}
                    className="pixel-button w-full bg-opacity-50 hover:bg-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    back
                  </button>
                  <button
                    type="submit"
                    className="pixel-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "submitting..." : "submit"}
                  </button>
                </div>

                {errorMessage && (
                  <div className="rounded-lg border-2 border-red-400/70 bg-red-500/10 p-4 text-sm text-red-200 whitespace-pre-line font-pixelify">
                    {errorMessage}
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </Portal>
  );
}
