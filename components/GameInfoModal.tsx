"use client";

import Portal from "./Portal";

interface Game {
  id: number;
  name: string;
  image: string;
  date: string;
  time: string;
  venue: string;
  notes: string;
}

interface GameInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
}

export default function GameInfoModal({ isOpen, onClose, game }: GameInfoModalProps) {
  if (!isOpen || !game) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pixel-modal-overlay p-4 animate-fade-in">
        <div className="pixel-modal-content max-w-2xl w-full animate-modal-slide-up bg-[#001a17]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-mint-soft hover:text-mint text-2xl transition-colors font-bold z-50"
            aria-label="Close modal"
          >
            [ x ]
          </button>

          <div className="flex flex-col gap-8">
            <div className="w-full flex justify-center overflow-hidden">
              <img 
                src={game.image} 
                alt={game.name} 
                className="max-w-full max-h-[200px] w-auto h-auto object-contain" 
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-4xl md:text-5xl font-bold text-mint tracking-widest lowercase">
                  {game.name}
                </h3>
                <div className="h-1.5 w-24 bg-mint mx-auto md:mx-0" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-mint/50 font-bold font-pixelify">schedule</p>
                  <p className="text-xl md:text-2xl text-mint lowercase font-pixelify">{game.date} • {game.time}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-mint/50 font-bold font-pixelify">venue</p>
                  <p className="text-xl md:text-2xl text-mint lowercase font-pixelify">{game.venue}</p>
                </div>
              </div>

              {game.notes && (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-mint/50 font-bold font-pixelify">intel / notes</p>
                  <div className="p-4 bg-black/20 border-l-4 border-mint/40">
                    <p className="text-base md:text-lg text-mint/90 italic lowercase leading-relaxed font-pixelify">
                      "{game.notes}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
