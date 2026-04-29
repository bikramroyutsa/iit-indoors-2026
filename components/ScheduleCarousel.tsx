"use client";

import { useState, useRef, useEffect } from "react";
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
  { id: 1, name: "valorant", image: "/game-assets/Valorant.png", date: "may 8", time: "10:00 am", venue: "computer lab 1", notes: "5v5 tactical shooter. bring your own mouse if preferred." },
  { id: 2, name: "chess", image: "/game-assets/Chess.png", date: "may 8", time: "11:30 am", venue: "common room", notes: "classical time format. clocks provided." },
  { id: 3, name: "table tennis", image: "/game-assets/Table-Tennis.png", date: "may 8", time: "02:00 pm", venue: "student lounge", notes: "singles tournament. butterfly tables." },
  { id: 4, name: "scrabble", image: "/game-assets/Scrabble.png", date: "may 8", time: "12:00 pm", venue: "library annexe", notes: "standard dictionary rules apply." },
  { id: 5, name: "ludo", image: "/game-assets/Ludo.png", date: "may 8", time: "03:30 pm", venue: "cafeteria", notes: "4-player matches. fast-paced rules." },
  { id: 6, name: "uno", image: "/game-assets/UNO.png", date: "may 9", time: "12:00 pm", venue: "common room", notes: "stacking allowed up to +4." },
  { id: 7, name: "dart", image: "/game-assets/Dart.png", date: "may 9", time: "01:30 pm", venue: "sports hall", notes: "501 format. double out." },
  { id: 8, name: "rubiks cube", image: "/game-assets/Rubiks-Cube.png", date: "may 8", time: "11:00 am", venue: "innovation hub", notes: "3x3 speedcubing. 3 attempts per person." },
  { id: 9, name: "cricket", image: "/game-assets/Short-Pitch Cricket.png", date: "may 9", time: "09:00 am", venue: "back field", notes: "short pitch format. 6 overs per side." },
  { id: 10, name: "musical chairs", image: "/game-assets/Musical-Chairs.png", date: "may 9", time: "05:00 pm", venue: "main courtyard", notes: "the classic. unexpected playlist." },
  { id: 11, name: "typing speed", image: "/game-assets/Typing-Speed-Contest.png", date: "may 9", time: "04:00 pm", venue: "computer lab 2", notes: "wpm challenge. 5-minute test." },
  { id: 12, name: "pucket", image: "/game-assets/Pucket.png", date: "may 9", time: "10:00 am", venue: "student lounge", notes: "wooden board game. speed is key." },
  { id: 13, name: "dumb charades", image: "/game-assets/Dumb-Charedes.png", date: "may 9", time: "03:00 pm", venue: "seminar hall", notes: "teams of 3. no verbal cues." },
  { id: 14, name: "cards", image: "/game-assets/Cards-29.png", date: "may 8", time: "05:00 pm", venue: "cafeteria", notes: "29 format. strictly recreational." },
  { id: 15, name: "wire loop", image: "/game-assets/Wire-Loop.png", date: "may 9", time: "11:00 am", venue: "tech stall", notes: "don't touch the wire. steady hands win." },
];

// Helper to group and sort events from the GAMES array
const SCHEDULE_DATA = (() => {
  const grouped: Record<string, any[]> = {};

  // Core event ceremonies
  const baseEvents = [
    { date: "may 8", time: "09:00 am", event: "opening ceremony", venue: "main auditorium" },
    { date: "may 9", time: "06:30 pm", event: "closing & awards", venue: "main hall" },
  ];

  // Add all games
  GAMES.forEach(game => {
    if (!grouped[game.date]) grouped[game.date] = [];
    grouped[game.date].push({
      time: game.time,
      event: game.name,
      venue: game.venue
    });
  });

  // Add base events
  baseEvents.forEach(be => {
    if (!grouped[be.date]) grouped[be.date] = [];
    grouped[be.date].push({
      time: be.time,
      event: be.event,
      venue: be.venue
    });
  });

  // Sort dates chronologically
  const sortedDates = Object.keys(grouped).sort((a, b) => {
    const dA = parseInt(a.split(" ")[1]);
    const dB = parseInt(b.split(" ")[1]);
    return dA - dB;
  });

  // Format into final structure
  return sortedDates.map((date, idx) => {
    const events = grouped[date].sort((a, b) => {
      const parse = (t: string) => {
        const [time, period] = t.split(" ");
        let [h, m] = time.split(":").map(Number);
        if (period.toLowerCase() === "pm" && h !== 12) h += 12;
        if (period.toLowerCase() === "am" && h === 12) h = 0;
        return h * 60 + m;
      };
      return parse(a.time) - parse(b.time);
    });

    return {
      dayLabel: `day 0${idx + 1}`,
      date: `${date}, 2026`,
      events
    };
  });
})();


export default function ScheduleCarousel() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scheduleScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic for Lineup
  useEffect(() => {
    const interval = setInterval(() => {
      scrollLineup("right");
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Initial scroll position for Lineup
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const singleSetWidth = el.scrollWidth / 3;
      el.scrollLeft = singleSetWidth;
    }
  }, []);

  // Initial scroll position for Schedule (Mobile only)
  useEffect(() => {
    const el = scheduleScrollRef.current;
    if (el && window.innerWidth < 1024) {
      const singleSetWidth = el.scrollWidth / 3;
      el.scrollLeft = singleSetWidth;
    }
  }, []);

  const scrollLineup = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (el) {
      const singleSetWidth = el.scrollWidth / 3;

      if (direction === "right" && el.scrollLeft >= singleSetWidth * 2) {
        el.scrollLeft -= singleSetWidth;
      } else if (direction === "left" && el.scrollLeft <= singleSetWidth) {
        el.scrollLeft += singleSetWidth;
      }

      const scrollAmount = 200;
      el.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const singleSetWidth = el.scrollWidth / 3;
    if (el.scrollLeft >= singleSetWidth * 2) {
      el.scrollLeft -= singleSetWidth;
    }
    else if (el.scrollLeft <= 0) {
      el.scrollLeft += singleSetWidth;
    }
  };

  const handleScheduleScroll = () => {
    const el = scheduleScrollRef.current;
    if (!el || window.innerWidth >= 1024) return;
    const singleSetWidth = el.scrollWidth / 3;
    if (el.scrollLeft >= singleSetWidth * 2) {
      el.scrollLeft -= singleSetWidth;
    } else if (el.scrollLeft <= 0) {
      el.scrollLeft += singleSetWidth;
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
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-x-auto scrollbar-hide snap-x snap-proximity flex items-start gap-4 pb-2 touch-manipulation"
              >
                {[...GAMES, ...GAMES, ...GAMES].map((game, idx) => (
                  <button
                    key={`${game.id}-${idx}`}
                    onClick={() => setSelectedGame(game)}
                    className="w-16 md:w-20 flex-shrink-0 cursor-pointer group/card snap-center text-left appearance-none"
                  >
                    <div className="aspect-square border-2 border-black/10 bg-white/50 overflow-hidden relative transition-all duration-300 group-hover/card:border-black group-hover/card:-translate-y-1 p-1">
                      <img src={game.image} alt={game.name} className="w-full h-full object-contain opacity-60 group-hover/card:opacity-100 transition-all brightness-0" />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                      <div className="absolute bottom-1 left-0 right-0 text-center text-[6px] text-black opacity-0 group-hover/card:opacity-100 transition-opacity uppercase tracking-tighter font-bold font-pixelify">[ select ]</div>
                    </div>
                    <div className="mt-1.5 w-full overflow-hidden relative">
                      <div className={`flex items-center ${game.name.length > 10 ? 'w-max animate-scroll-paused' : 'w-full justify-center'}`}>
                        <span className="text-[12px] md:text-[14px] text-black/70 tracking-tighter lowercase font-medium px-2 group-hover/card:text-black transition-colors whitespace-nowrap">
                          {game.name}
                        </span>
                        {game.name.length > 10 && (
                          <span className="text-[12px] md:text-[14px] text-black/70 tracking-tighter lowercase font-medium px-2 group-hover/card:text-black transition-colors whitespace-nowrap">
                            {game.name}
                          </span>
                        )}
                      </div>
                    </div>
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
        <div className="flex lg:hidden gap-3 mb-4 overflow-x-auto pb-2 scrollbar-hide w-full justify-center px-4">
          {SCHEDULE_DATA.map((day, idx) => (
            <button
              key={idx}
              onClick={() => {
                const el = scheduleScrollRef.current;
                if (el) {
                  const singleSetWidth = el.scrollWidth / 3;
                  const cardWidth = singleSetWidth / SCHEDULE_DATA.length;
                  el.scrollTo({
                    left: singleSetWidth + (idx * cardWidth),
                    behavior: 'smooth'
                  });
                }
              }}
              className="px-4 py-1.5 bg-[#f4f1ea] border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] text-black text-[14px] font-bold uppercase tracking-widest active:scale-95 active:rotate-1 active:bg-[#16dbab] active:text-[#00201d] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-100 whitespace-nowrap flex-shrink-0"
            >
              {day.dayLabel}
            </button>
          ))}
        </div>

        <div
          ref={scheduleScrollRef}
          onScroll={handleScheduleScroll}
          className="w-full flex lg:grid lg:grid-cols-2 gap-6 md:gap-10 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-4 lg:pb-0 scrollbar-hide"
        >
          {[...SCHEDULE_DATA, ...SCHEDULE_DATA, ...SCHEDULE_DATA].map((day, idx) => (
            <div
              key={idx}
              className={`w-[85vw] sm:w-[80vw] lg:w-full flex-shrink-0 snap-center lg:snap-align-none relative group ${idx === 0 ? 'ml-[7.5vw] sm:ml-[10vw] lg:ml-0' : idx === (SCHEDULE_DATA.length * 3) - 1 ? 'mr-[7.5vw] sm:mr-[10vw] lg:mr-0' : ''}`}
            >
              <div className="relative bg-[#f4f1ea] p-3 md:p-6 border-2 md:border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.8)] h-full overflow-hidden">
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, #000 2px, #000 3px)' }} />
                <div className="flex items-center justify-between mb-3 md:mb-6 border-b border-black/10 pb-2">
                  <h3 className="text-black text-lg md:text-xl tracking-[0.1em] lowercase font-bold">
                    {day.dayLabel}
                  </h3>
                  <span className="text-black/50 text-[15px] md:text-xl lowercase tracking-widest font-bold">{day.date}</span>
                </div>
                <div className="space-y-2 md:space-y-4 max-h-[250px] md:max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {day.events.map((item, eventIdx) => (
                    <div key={eventIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-black/10 pb-2 group/item hover:bg-black/5 transition-colors px-1">
                      <div className="flex items-center gap-3">
                        <span className="text-black text-base md:text-lg font-black tracking-tight min-w-[70px] md:min-w-[80px]">
                          {item.time}
                        </span>
                        <div className="h-3 w-px bg-black/20 hidden sm:block" />
                        <span className="text-base md:text-xl text-black/80 lowercase tracking-wide font-medium group-hover/item:text-black transition-colors">
                          {item.event}
                        </span>
                      </div>
                      <span className="text-[10px] md:text-[12px] text-red-700/60 uppercase tracking-[0.2em] italic font-bold">
                        @{item.venue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
