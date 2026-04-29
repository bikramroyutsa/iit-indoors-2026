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

  const scrollSchedule = (direction: "left" | "right") => {
    const el = scheduleScrollRef.current;
    if (el) {
      const singleSetWidth = el.scrollWidth / 3;
      const cardWidth = singleSetWidth / SCHEDULE_DATA.length;

      if (direction === "right" && el.scrollLeft >= singleSetWidth * 2) {
        el.scrollLeft -= singleSetWidth;
      } else if (direction === "left" && el.scrollLeft <= singleSetWidth) {
        el.scrollLeft += singleSetWidth;
      }

      el.scrollBy({ left: direction === "left" ? -cardWidth : cardWidth, behavior: 'smooth' });
    }
  };

  const handleScheduleScroll = () => {
    const el = scheduleScrollRef.current;
    if (!el) return;
    const singleSetWidth = el.scrollWidth / 3;
    if (el.scrollLeft >= singleSetWidth * 2) {
      el.scrollLeft -= singleSetWidth;
    } else if (el.scrollLeft <= 0) {
      el.scrollLeft += singleSetWidth;
    }
  };

  return (
    <div className="w-full py-4 px-2 md:px-4 select-none font-pixelify flex flex-col gap-8 md:gap-12">

      {/* --- GAMES SECTION --- */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="text-center text-white text-xl md:text-2xl tracking-[0.2em] lowercase mb-4 drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)] font-bold animate-glitch-slow hover:animate-glitch cursor-default transition-all">
          lineup
        </h2>

        {/* Paper Panel for Lineup */}
        <div className="relative w-full group">
          <div className="relative bg-[#f4f1ea] p-2 md:p-4 border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, #000 2px, #000 3px)' }} />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '4px 4px' }} />

            <div className="relative z-10 flex items-center">
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
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="text-center text-white text-xl md:text-2xl tracking-[0.2em] lowercase mb-4 md:mb-6 drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)] font-bold animate-glitch-slow hover:animate-glitch cursor-default transition-all">
          event schedule
        </h2>

        {/* Day Switcher - Now on all screens */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide w-full justify-center px-4">
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
              className="px-6 py-2 bg-[#f4f1ea] border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.8)] text-black text-[14px] md:text-[16px] font-bold uppercase tracking-widest active:scale-95 active:rotate-1 active:bg-[#16dbab] active:text-[#00201d] active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-white transition-all duration-100 whitespace-nowrap flex-shrink-0"
            >
              {day.dayLabel}
            </button>
          ))}
        </div>

        <div className="relative w-full flex items-center group">
          <div
            ref={scheduleScrollRef}
            onScroll={handleScheduleScroll}
            className="w-full flex overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
          >
            {[...SCHEDULE_DATA, ...SCHEDULE_DATA, ...SCHEDULE_DATA].map((day, idx) => (
              <div
                key={idx}
                className="w-full flex-shrink-0 snap-center relative group"
              >
                <div className="relative bg-[#f4f1ea] p-4 md:p-8 border-2 md:border-4 border-black shadow-[10px_10px_0_0_rgba(0,0,0,0.8)] h-full overflow-hidden max-w-5xl mx-auto">
                  {/* Paper Texture Overlay */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, #000 2px, #000 3px)' }} />
                  <div className="flex items-center justify-between mb-4 md:mb-8 border-b-2 border-black/10 pb-3">
                    <h3 className="text-black text-xl md:text-2xl tracking-[0.1em] lowercase font-black">
                      {day.dayLabel}
                    </h3>
                    <span className="text-black/50 text-base md:text-2xl lowercase tracking-widest font-black">{day.date}</span>
                  </div>
                  <div className="space-y-3 md:space-y-5 max-h-[350px] md:max-h-[450px] overflow-y-auto custom-scrollbar pr-3">
                    {day.events.map((item, eventIdx) => (
                      <div key={eventIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-black/10 pb-3 group/item hover:bg-black/5 transition-colors px-2">
                        <div className="flex items-center gap-4">
                          <span className="text-black text-lg md:text-2xl font-black tracking-tight min-w-[85px] md:min-w-[110px]">
                            {item.time}
                          </span>
                          <div className="h-4 w-px bg-black/20 hidden sm:block" />
                          <span className="text-lg md:text-2xl text-black/80 lowercase tracking-wide font-bold group-hover/item:text-black transition-colors">
                            {item.event}
                          </span>
                        </div>
                        <span className="text-[10px] md:text-[14px] text-red-700/60 uppercase tracking-[0.2em] italic font-black">
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
    </div>

  );
}
