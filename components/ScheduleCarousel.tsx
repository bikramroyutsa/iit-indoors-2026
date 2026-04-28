"use client";

import { useState } from "react";
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
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const scrollLineup = (direction: "left" | "right") => {
    const el = document.getElementById('lineup-scroll');
    if (el) {
      const scrollAmount = 150;
      el.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full py-4 px-2 md:px-4 select-none font-pixelify flex flex-col gap-4">

      {/* --- GAMES SECTION --- */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="text-center text-white text-xl md:text-2xl tracking-[0.2em] lowercase mb-3 drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)] font-bold animate-glitch-slow hover:animate-glitch cursor-default transition-all">
          lineup
        </h2>

        {/* Paper Panel for Lineup */}
        <div className="relative w-full group">
          <div className="relative bg-[#f4f1ea] p-2 md:p-4 border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, #000 2px, #000 3px)' }} />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '4px 4px' }} />
            
            <div className="relative z-10 flex items-center gap-4">
              <button 
                onClick={() => scrollLineup("left")} 
                className="z-20 p-1 text-black hover:scale-110 transition-all active:scale-95 bg-white border-2 border-black hidden md:block shadow-[2px_2px_0_0_rgba(0,0,0,0.8)]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>

              <div 
                id="lineup-scroll"
                className="flex-1 overflow-x-auto custom-scrollbar snap-x snap-mandatory flex gap-4 pb-2 touch-manipulation"
              >
                {GAMES.map((game) => (
                  <button 
                    key={game.id} 
                    onClick={() => setSelectedGame(game)} 
                    className="w-16 md:w-20 flex-shrink-0 cursor-pointer group/card snap-center text-left appearance-none"
                  >
                    <div className="aspect-square border-2 border-black/10 bg-white/50 overflow-hidden relative transition-all duration-300 group-hover/card:border-black group-hover/card:-translate-y-1 p-1">
                      <img src={game.image} alt={game.name} className="w-full h-full object-contain opacity-60 group-hover/card:opacity-100 transition-all brightness-0" />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                      <div className="absolute bottom-1 left-0 right-0 text-center text-[6px] text-black opacity-0 group-hover/card:opacity-100 transition-opacity uppercase tracking-tighter font-bold font-pixelify">[ select ]</div>
                    </div>
                    <p className="mt-1 text-center text-[7px] md:text-[9px] text-black/70 tracking-tighter lowercase truncate px-0.5 font-medium group-hover/card:text-black transition-colors leading-none">{game.name}</p>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => scrollLineup("right")} 
                className="z-20 p-1 text-black hover:scale-110 transition-all active:scale-95 bg-white border-2 border-black hidden md:block shadow-[2px_2px_0_0_rgba(0,0,0,0.8)]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
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
        <h2 className="text-center text-white text-xl md:text-2xl tracking-[0.2em] lowercase mb-3 md:mb-5 drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)] font-bold animate-glitch-slow hover:animate-glitch cursor-default transition-all">
          event schedule
        </h2>

        {/* Day Switcher - Mobile Only */}
        <div className="flex lg:hidden gap-3 mb-4">
          <button 
            onClick={() => {
              const el = document.getElementById('day-1-card');
              el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }}
            className="px-4 py-1.5 bg-[#f4f1ea] border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] text-black text-[10px] font-bold uppercase tracking-widest active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            day 01
          </button>
          <button 
            onClick={() => {
              const el = document.getElementById('day-2-card');
              el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }}
            className="px-4 py-1.5 bg-[#f4f1ea] border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] text-black text-[10px] font-bold uppercase tracking-widest active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            day 02
          </button>
        </div>
        
        <div className="w-full flex lg:grid lg:grid-cols-2 gap-6 md:gap-10 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-4 lg:pb-0 scrollbar-hide">
          {/* Day 01 */}
          <div id="day-1-card" className="w-[85vw] sm:w-[80vw] lg:w-full flex-shrink-0 snap-center lg:snap-align-none relative group ml-[7.5vw] sm:ml-[10vw] lg:ml-0">
            <div className="relative bg-[#f4f1ea] p-3 md:p-6 border-2 md:border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.8)] h-full overflow-hidden">
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, #000 2px, #000 3px)' }} />
              <div className="flex items-center justify-between mb-3 md:mb-6 border-b border-black/10 pb-2">
                <h3 className="text-black text-lg md:text-xl tracking-[0.1em] lowercase font-bold">
                  day 01
                </h3>
                <span className="text-black/50 text-[10px] md:text-xs lowercase tracking-widest font-bold">may 10, 2026</span>
              </div>
              <div className="space-y-2 md:space-y-4 max-h-[250px] md:max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {SCHEDULE_DATA.day1.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-black/10 pb-2 group/item hover:bg-black/5 transition-colors px-1">
                    <div className="flex items-center gap-3">
                      <span className="text-black text-base md:text-lg font-black tracking-tight min-w-[70px] md:min-w-[80px]">
                        {item.time}
                      </span>
                      <div className="h-3 w-px bg-black/20 hidden sm:block" />
                      <span className="text-base md:text-xl text-black/80 lowercase tracking-wide font-medium group-hover/item:text-black transition-colors">
                        {item.event}
                      </span>
                    </div>
                    <span className="text-[7px] md:text-[10px] text-red-700/60 uppercase tracking-[0.2em] italic font-bold">
                      @{item.venue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Day 02 */}
          <div id="day-2-card" className="w-[85vw] sm:w-[80vw] lg:w-full flex-shrink-0 snap-center lg:snap-align-none relative group mr-[7.5vw] sm:mr-[10vw] lg:mr-0">
            <div className="relative bg-[#f4f1ea] p-3 md:p-6 border-2 md:border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.8)] h-full overflow-hidden">
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, #000 2px, #000 3px)' }} />
              <div className="flex items-center justify-between mb-3 md:mb-6 border-b border-black/10 pb-2">
                <h3 className="text-black text-lg md:text-xl tracking-[0.1em] lowercase font-bold">
                  day 02
                </h3>
                <span className="text-black/50 text-[10px] md:text-xs lowercase tracking-widest font-bold">may 11, 2026</span>
              </div>
              <div className="space-y-2 md:space-y-4 max-h-[250px] md:max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {SCHEDULE_DATA.day2.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-black/10 pb-2 group/item hover:bg-black/5 transition-colors px-1">
                    <div className="flex items-center gap-3">
                      <span className="text-black text-base md:text-lg font-black tracking-tight min-w-[70px] md:min-w-[80px]">
                        {item.time}
                      </span>
                      <div className="h-3 w-px bg-black/20 hidden sm:block" />
                      <span className="text-base md:text-xl text-black/80 lowercase tracking-wide font-medium group-hover/item:text-black transition-colors">
                        {item.event}
                      </span>
                    </div>
                    <span className="text-[7px] md:text-[10px] text-red-700/60 uppercase tracking-[0.2em] italic font-bold">
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
