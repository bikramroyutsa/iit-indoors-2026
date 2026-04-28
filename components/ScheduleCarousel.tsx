"use client";

import { useState, useRef, useEffect } from "react";
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
  const [activeDay, setActiveDay] = useState<"day1" | "day2">("day1");

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

      {/* --- SCHEDULE SECTION --- */}
      <div className="w-full max-w-lg mx-auto relative group">
        {/* Glossy Liquid Glass Highlight */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00EBA9]/20 to-transparent rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative bg-[#00342e]/5 backdrop-blur-md p-6 md:p-12 rounded-[2.5rem] border border-[#00EBA9]/10 shadow-[0_20px_50px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden">
          {/* Glass Reflection Line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00EBA9]/20 to-transparent" />

          <h2 className="text-center text-[#00EBA9] text-3xl md:text-4xl tracking-[0.2em] lowercase mb-10 drop-shadow-[0_0_10px_rgba(0,235,169,0.4)]">
            schedule
          </h2>

          {/* Day Switcher */}
          <div className="flex justify-center gap-4 mb-10">
            {["day1", "day2"].map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day as "day1" | "day2")}
                className={`px-6 py-2 rounded-full border transition-all duration-300 text-lg md:text-xl lowercase tracking-widest ${activeDay === day
                  ? "bg-[#00EBA9] text-[#00201d] border-[#00EBA9] shadow-[0_0_15px_rgba(0,235,169,0.5)] scale-105"
                  : "bg-transparent text-[#00EBA9]/60 border-[#00EBA9]/20 hover:border-[#00EBA9]/50 hover:text-[#00EBA9]"
                  }`}
              >
                {day === "day1" ? "day 01" : "day 02"}
              </button>
            ))}
          </div>

          {/* Schedule List */}
          <div className="space-y-8 px-2 md:px-4">
            {SCHEDULE_DATA[activeDay].map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#00EBA9]/10 pb-4 group/item">
                <div className="flex items-center gap-4">
                  <span className="text-[#00EBA9] text-xl md:text-2xl font-bold tracking-tight min-w-[100px]">
                    {item.time}
                  </span>
                  <div className="h-4 w-px bg-[#00EBA9]/20 hidden md:block" />
                  <span className="text-[#00EBA9] text-2xl md:text-3xl lowercase tracking-wide font-medium group-hover/item:text-white transition-colors">
                    {item.event}
                  </span>
                </div>
                <span className="text-sm md:text-lg text-[#00EBA9]/60 uppercase tracking-[0.1em] italic">
                  @{item.venue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- GAMES SECTION --- */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="text-center text-[#00EBA9] text-3xl md:text-4xl tracking-[0.2em] lowercase mb-10 drop-shadow-[0_0_10px_rgba(0,235,169,0.4)]">
          lineup
        </h2>

        {/* Carousel Container */}
        <div className="relative w-full flex items-center justify-center gap-2 md:gap-6 group bg-[#00342e]/5 backdrop-blur-md p-4 md:p-8 rounded-[3rem] border border-[#00EBA9]/10 shadow-[0_20px_50px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden">
          <button onClick={prevGames} className="z-20 p-2 text-[#00EBA9] hover:scale-125 transition-all hover:text-white active:scale-95">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>

          <div className="flex-1 overflow-hidden">
            <div className="flex gap-4 md:gap-8 transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)" style={{ transform: `translateX(calc(-${startIndex * (100 / 3.0)}%))` }}>
              {GAMES.map((game) => (
                <div key={game.id} onClick={() => setSelectedGame(game)} className="w-[calc(33.33%-1rem)] md:w-48 flex-shrink-0 cursor-pointer group/card">
                  <div className="aspect-square rounded-2xl border-2 border-[#00EBA9]/20 bg-[#00201d]/60 overflow-hidden relative transition-all duration-300 group-hover/card:border-[#00EBA9] group-hover/card:shadow-[0_0_30px_rgba(0,235,169,0.3)] group-hover/card:-translate-y-2 p-3">
                    <img src={game.image} alt={game.name} className="w-full h-full object-contain opacity-70 group-hover/card:opacity-100 transition-opacity grayscale group-hover/card:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-[#00EBA9] opacity-0 group-hover/card:opacity-100 transition-opacity uppercase tracking-tighter font-bold">view info</div>
                  </div>
                  <p className="mt-4 text-center text-lg md:text-2xl text-[#00EBA9] tracking-wider lowercase truncate px-1 font-medium group-hover/card:text-white transition-colors">{game.name}</p>
                </div>
              ))}
            </div>
          </div>

          <button onClick={nextGames} className="z-20 p-2 text-[#00EBA9] hover:scale-125 transition-all hover:text-white active:scale-95">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      {/* --- INLINE GAME DETAILS --- */}
      <div className={`w-full max-w-4xl mx-auto transition-all duration-500 ease-in-out overflow-hidden ${selectedGame ? 'max-h-[1000px] opacity-100 mt-10' : 'max-h-0 opacity-0'}`}>
        {selectedGame && (
          <div className="bg-[#00342e]/5 backdrop-blur-md rounded-[3rem] border border-[#00EBA9]/10 p-8 md:p-16 relative shadow-[0_20px_50px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <button onClick={() => setSelectedGame(null)} className="absolute top-8 right-10 text-[#00EBA9] hover:text-white transition-colors text-2xl font-bold">[close x]</button>

            <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
              <div className="w-full md:w-1/2 aspect-video rounded-3xl border border-[#00EBA9]/20 overflow-hidden bg-black/40 shadow-2xl">
                <img src={selectedGame.image} alt={selectedGame.name} className="w-full h-full object-cover" />
              </div>

              <div className="w-full md:w-1/2 space-y-10">
                <div className="space-y-3">
                  <h3 className="text-5xl md:text-7xl font-bold text-[#00EBA9] tracking-widest lowercase drop-shadow-[0_0_15px_rgba(0,235,169,0.3)]">{selectedGame.name}</h3>
                  <div className="h-1.5 w-24 bg-[#00EBA9]/40 rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#00EBA9]/50 font-bold">schedule</p>
                    <p className="text-2xl md:text-3xl text-[#00EBA9] lowercase">{selectedGame.date} • {selectedGame.time}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#00EBA9]/50 font-bold">venue</p>
                    <p className="text-2xl md:text-3xl text-[#00EBA9] lowercase">{selectedGame.venue}</p>
                  </div>
                </div>

                {selectedGame.notes && (
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#00EBA9]/50 font-bold">intel / notes</p>
                    <div className="p-6 bg-black/10 border-l-4 border-[#00EBA9]/40 rounded-2xl">
                      <p className="text-lg md:text-xl text-[#00EBA9]/90 italic lowercase leading-relaxed">"{selectedGame.notes}"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
