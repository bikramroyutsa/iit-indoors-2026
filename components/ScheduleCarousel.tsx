"use client";

import { useState, useRef, useEffect } from "react";
import Portal from "./Portal";
import GameInfoModal from "./GameInfoModal";

interface Game {
  id: number;
  name: string;
  image: string;
  date: string;
  time: string;
  venue: string;
  notes: string;
}

const GAMES: Game[] = [
  { id: 1, name: "valorant", image: "/game-assets/Valorant.png", date: "may 11", time: "09:00 am", venue: "computer lab 1", notes: "5v5 tactical shooter. bring your own mouse if preferred." },
  { id: 2, name: "chess", image: "/game-assets/Chess.png", date: "may 11", time: "10:30 am", venue: "common room", notes: "classical time format. clocks provided." },
  { id: 3, name: "table tennis", image: "/game-assets/Table-Tennis.png", date: "may 12", time: "02:00 pm", venue: "student lounge", notes: "singles tournament. butterfly tables." },
  { id: 4, name: "scrabble", image: "/game-assets/Scrabble.png", date: "may 12", time: "11:00 am", venue: "library annexe", notes: "standard dictionary rules apply." },
  { id: 5, name: "ludo", image: "/game-assets/Ludo.png", date: "may 10", time: "03:00 pm", venue: "cafeteria", notes: "4-player matches. fast-paced rules." },
  { id: 6, name: "uno", image: "/game-assets/UNO.png", date: "may 11", time: "04:00 pm", venue: "common room", notes: "stacking allowed up to +4." },
  { id: 7, name: "dart", image: "/game-assets/Dart.png", date: "may 13", time: "01:00 pm", venue: "sports hall", notes: "501 format. double out." },
  { id: 8, name: "rubiks cube", image: "/game-assets/Rubiks-Cube.png", date: "may 10", time: "11:00 am", venue: "innovation hub", notes: "3x3 speedcubing. 3 attempts per person." },
  { id: 9, name: "cricket", image: "/game-assets/Short-Pitch Cricket.png", date: "may 14", time: "09:00 am", venue: "back field", notes: "short pitch format. 6 overs per side." },
  { id: 10, name: "musical chairs", image: "/game-assets/Musical-Chairs.png", date: "may 14", time: "05:00 pm", venue: "main courtyard", notes: "the classic. unexpected playlist." },
  { id: 11, name: "typing speed", image: "/game-assets/Typing-Speed-Contest.png", date: "may 12", time: "04:00 pm", venue: "computer lab 2", notes: "wpm challenge. 5-minute test." },
  { id: 12, name: "pucket", image: "/game-assets/Pucket.png", date: "may 13", time: "10:00 am", venue: "student lounge", notes: "wooden board game. speed is key." },
  { id: 13, name: "dumb charades", image: "/game-assets/Dumb-Charedes.png", date: "may 13", time: "03:00 pm", venue: "seminar hall", notes: "teams of 3. no verbal cues." },
  { id: 14, name: "cards", image: "/game-assets/Cards-29.png", date: "may 10", time: "05:00 pm", venue: "cafeteria", notes: "29 format. strictly recreational." },
  { id: 15, name: "wire loop", image: "/game-assets/Wire-Loop.png", date: "may 14", time: "11:00 am", venue: "tech stall", notes: "don't touch the wire. steady hands win." },
];

const SCHEDULE_DATA = {
  day1: [
    { time: "09:00 am", event: "opening ceremony", venue: "main auditorium" },
    { time: "10:00 am", event: "valorant group a", venue: "computer lab 1" },
    { time: "11:30 am", event: "chess masters rd 1", venue: "common room" },
    { time: "01:00 pm", event: "lunch & free play", venue: "cafeteria" },
    { time: "02:00 pm", event: "fifa 26 qualifiers", venue: "gaming zone" },
    { time: "03:30 pm", event: "table tennis singles", venue: "student lounge" },
    { time: "05:00 pm", event: "musical chairs", venue: "main courtyard" },
  ],
  day2: [
    { time: "09:00 am", event: "valorant finals", venue: "computer lab 1" },
    { time: "10:30 am", event: "cricket match", venue: "back field" },
    { time: "12:00 pm", event: "rubiks speedcubing", venue: "innovation hub" },
    { time: "01:30 pm", event: "typing speed contest", venue: "lab 2" },
    { time: "03:00 pm", event: "dumb charades", venue: "seminar hall" },
    { time: "05:00 pm", event: "closing & awards", venue: "main hall" },
  ]
};

export default function ScheduleCarousel() {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Auto-swipe effect
  useEffect(() => {
    const timer = setInterval(() => {
      setStartIndex((prev) => {
        if (prev + 3 >= GAMES.length) return 0;
        return prev + 1;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextGames = () => {
    if (startIndex + 1 < GAMES.length) {
      setStartIndex((prev) => prev + 1);
    } else {
      setStartIndex(0);
    }
  };

  const prevGames = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    } else {
      setStartIndex(GAMES.length - 3);
    }
  };

  return (
    <div className="w-full py-12 px-2 md:px-4 select-none font-pixelify flex flex-col gap-20">

      {/* --- GAMES SECTION --- */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="text-center text-[#00EBA9] text-3xl md:text-4xl tracking-[0.2em] lowercase mb-10 drop-shadow-[0_0_10px_rgba(0,235,169,0.4)]">
          lineup
        </h2>

        {/* Pixel Panel for Lineup */}
        <div className="relative w-full group">
          {/* Main Panel Body */}
          <div className="relative bg-[#001a17]/85 backdrop-blur-sm p-4 md:p-8 border-4 border-[#00EBA9] shadow-[8px_8px_0_0_rgba(0,0,0,0.5),inset_-4px_-4px_0_0_rgba(0,235,169,0.2)] overflow-hidden">
            {/* Background Pixel Grid Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00EBA9 1px, transparent 0)', backgroundSize: '8px 8px' }} />
            
        {/* Lineup Container */}
        <div className="relative w-full group">
          {/* Main Panel Body */}
          <div className="relative bg-[#001a17]/85 backdrop-blur-sm p-4 md:p-8 border-4 border-[#00EBA9] shadow-[8px_8px_0_0_rgba(0,0,0,0.5),inset_-4px_-4px_0_0_rgba(0,235,169,0.2)]">
            {/* Background Pixel Grid Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00EBA9 1px, transparent 0)', backgroundSize: '8px 8px' }} />
            
            <div className="relative z-10 flex items-center gap-4">
              <button 
                onClick={() => {
                  const el = document.getElementById('lineup-scroll');
                  el?.scrollBy({ left: -300, behavior: 'smooth' });
                }} 
                className="z-20 p-2 text-[#00EBA9] hover:scale-125 transition-all hover:text-white active:scale-95 bg-[#00201d] border-2 border-[#00EBA9] hidden md:block"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>

              <div 
                id="lineup-scroll"
                className="flex-1 overflow-x-auto custom-scrollbar snap-x snap-mandatory flex gap-6 pb-4 touch-manipulation"
              >
                {GAMES.map((game) => (
                  <button 
                    key={game.id} 
                    onClick={() => setSelectedGame(game)} 
                    className="w-40 md:w-48 flex-shrink-0 cursor-pointer group/card snap-center text-left appearance-none"
                  >
                    <div className="aspect-square border-4 border-[#00EBA9]/20 bg-[#00201d] overflow-hidden relative transition-all duration-300 group-hover/card:border-[#00EBA9] group-hover/card:-translate-y-2 p-3">
                      <img src={game.image} alt={game.name} className="w-full h-full object-contain opacity-70 group-hover/card:opacity-100 transition-opacity grayscale group-hover/card:grayscale-0" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                      <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-[#00EBA9] opacity-0 group-hover/card:opacity-100 transition-opacity uppercase tracking-tighter font-bold font-pixelify">[ view ]</div>
                    </div>
                    <p className="mt-4 text-center text-lg md:text-xl text-[#00EBA9] tracking-wider lowercase truncate px-1 font-medium group-hover/card:text-white transition-colors">{game.name}</p>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  const el = document.getElementById('lineup-scroll');
                  el?.scrollBy({ left: 300, behavior: 'smooth' });
                }} 
                className="z-20 p-2 text-[#00EBA9] hover:scale-125 transition-all hover:text-white active:scale-95 bg-[#00201d] border-2 border-[#00EBA9] hidden md:block"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>

      {/* Game Info Modal */}
      <GameInfoModal 
        isOpen={!!selectedGame} 
        onClose={() => setSelectedGame(null)} 
        game={selectedGame} 
      />

      {/* --- SCHEDULE SECTION --- */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <h2 className="text-center text-[#00EBA9] text-3xl md:text-4xl tracking-[0.2em] lowercase mb-12 drop-shadow-[0_0_10px_rgba(0,235,169,0.4)]">
          event schedule
        </h2>
        
        <div className="w-full flex lg:grid lg:grid-cols-2 gap-8 md:gap-16 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-8 lg:pb-0 custom-scrollbar">
          {/* Day 01 */}
          <div className="w-[90vw] sm:w-[80vw] lg:w-full flex-shrink-0 snap-center lg:snap-align-none relative group ml-[5vw] sm:ml-[10vw] lg:ml-0">
            <div className="relative bg-[#001a17]/85 backdrop-blur-sm p-6 md:p-10 border-4 border-[#00EBA9] shadow-[12px_12px_0_0_rgba(0,0,0,0.5),inset_-4px_-4px_0_0_rgba(0,235,169,0.1)] h-full">
              <div className="flex items-center justify-between mb-10 border-b-2 border-[#00EBA9]/20 pb-4">
                <h3 className="text-[#00EBA9] text-2xl md:text-3xl tracking-[0.1em] lowercase">
                  day 01
                </h3>
                <span className="text-[#00EBA9]/60 text-xs md:text-sm lowercase tracking-widest font-bold">may 10, 2026</span>
              </div>
              <div className="space-y-8">
                {SCHEDULE_DATA.day1.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00EBA9]/10 pb-4 group/item hover:bg-[#00EBA9]/5 transition-colors px-2">
                    <div className="flex items-center gap-4">
                      <span className="text-[#00EBA9] text-lg md:text-xl font-bold tracking-tight min-w-[90px]">
                        {item.time}
                      </span>
                      <div className="h-4 w-px bg-[#00EBA9]/40 hidden sm:block" />
                      <span className="text-xl md:text-2xl text-[#00EBA9] lowercase tracking-wide font-medium group-hover/item:text-white transition-colors">
                        {item.event}
                      </span>
                    </div>
                    <span className="text-[10px] md:text-xs text-[#00EBA9]/50 uppercase tracking-[0.2em] italic font-bold">
                      @{item.venue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Day 02 */}
          <div className="w-[90vw] sm:w-[80vw] lg:w-full flex-shrink-0 snap-center lg:snap-align-none relative group mr-[5vw] sm:mr-[10vw] lg:mr-0">
            <div className="relative bg-[#001a17]/85 backdrop-blur-sm p-6 md:p-10 border-4 border-[#00EBA9] shadow-[12px_12px_0_0_rgba(0,0,0,0.5),inset_-4px_-4px_0_0_rgba(0,235,169,0.1)] h-full">
              <div className="flex items-center justify-between mb-10 border-b-2 border-[#00EBA9]/20 pb-4">
                <h3 className="text-[#00EBA9] text-2xl md:text-3xl tracking-[0.1em] lowercase">
                  day 02
                </h3>
                <span className="text-[#00EBA9]/60 text-xs md:text-sm lowercase tracking-widest font-bold">may 11, 2026</span>
              </div>
              <div className="space-y-8">
                {SCHEDULE_DATA.day2.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00EBA9]/10 pb-4 group/item hover:bg-[#00EBA9]/5 transition-colors px-2">
                    <div className="flex items-center gap-4">
                      <span className="text-[#00EBA9] text-lg md:text-xl font-bold tracking-tight min-w-[90px]">
                        {item.time}
                      </span>
                      <div className="h-4 w-px bg-[#00EBA9]/40 hidden sm:block" />
                      <span className="text-xl md:text-2xl text-[#00EBA9] lowercase tracking-wide font-medium group-hover/item:text-white transition-colors">
                        {item.event}
                      </span>
                    </div>
                    <span className="text-[10px] md:text-xs text-[#00EBA9]/50 uppercase tracking-[0.2em] italic font-bold">
                      @{item.venue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
