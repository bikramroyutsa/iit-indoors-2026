"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  { 
    id: 1, 
    name: "valorant", 
    image: "/game-assets/Valorant.png", 
    date: "TBA", 
    time: "TBA", 
    venue: "Online", 
    notes: "Standard 5v5 competitive settings (13 rounds). Individual sign-ups only; teams will be drafted via a high-stakes player auction." 
  },
  { 
    id: 2, 
    name: "chess", 
    image: "/game-assets/Chess.png", 
    date: "may 08", 
    time: "3:00 pm", 
    venue: "IIT", 
    notes: "5min + 5s Blitz format using the Swiss System. Expect a high-speed mental gauntlet where every second counts." 
  },
  { 
    id: 3, 
    name: "table tennis", 
    image: "/game-assets/Table-Tennis.png", 
    date: "may 12", 
    time: "02:00 pm", 
    venue: "student lounge", 
    notes: "singles tournament. butterfly tables." 
  }, // TABLE TENNIS IS NOT HAPPENING MY NIGGA 🥀
  { 
    id: 4, 
    name: "scrabble", 
    image: "/game-assets/Scrabble.png", 
    date: "may 08", 
    time: "5:00 pm", 
    venue: "IIT", 
    notes: "Competitive spelling for high stakes at IIT. Form the highest-scoring words possible and prepare to defend your made-up vocabulary against skeptical opponents. " 
  },
  { 
    id: 5, 
    name: "ludo", 
    image: "/game-assets/Ludo.png", 
    date: "may 08-09", 
    time: "all day", 
    venue: "IIT", 
    notes: "No need to say about this game, just come to IIT and have fun." 
  },
  { 
    id: 6, 
    name: "uno", 
    image: "/game-assets/UNO.png", 
    date: "may 08-09", 
    time: "all day", 
    venue: "IIT", 
    notes: "Absolute chaos with Draw 10 stacks enabled. Just keep drawing until someone cries or wins." 
  },
  { 
    id: 7, 
    name: "dart", 
    image: "/game-assets/Dart.png", 
    date: "may 08-09", 
    time: "all day", 
    venue: "IIT", 
    notes: "Darts is just the art of throwing sharp metal sticks at a wall and pretending you meant to hit the tiny red bit instead of the drywall." 
  },
  { 
    id: 8, 
    name: "rubiks cube", 
    image: "/game-assets/Rubiks-Cube.png", 
    date: "may 08-09", 
    time: "all day", 
    venue: "IIT", 
    notes: "Speed-solving a Rubik's Cube is just aggressive finger aerobics where you try to outrun a stopwatch before your brain realizes it's actually just doing math at 200 mph. " 
  },
  { 
    id: 9, 
    name: "cricket", 
    image: "/game-assets/Short-Pitch Cricket.png", 
    date: "may 09", 
    time: "9:00 am", 
    venue: "TBA", 
    notes: "Group stages leading into knockouts. Form your squad of 7 and prepare for a full day at IIT. Short-pitch format with 6 overs per side. Expect high-scoring matches and plenty of boundary action." 
  },
  { 
    id: 10, 
    name: "musical chairs", 
    image: "/game-assets/Musical-Chairs.png", 
    date: "may 09", 
    time: "4:00 pm", 
    venue: "IIT", 
    notes: "A cutthroat elimination sprint happening at IIT. It's essentially high-stakes adult duck-duck-goose where the music stops and friendships end. " 
  },
  { 
    id: 11, 
    name: "typing speed", 
    image: "/game-assets/Typing-Speed-Contest.png", 
    date: "may 08-09", 
    time: "all day", 
    venue: "IIT", 
    notes: "A digital drag race available all day Friday and Saturday at IIT. Prove your WPM is higher than your friends’ in a battle of aggressive keyboard clicking and zero typos. " 
  },
  { 
    id: 12, 
    name: "pucket", 
    image: "/game-assets/Pucket.png", 
    date: "may 09", 
    time: "2:00 pm", 
    venue: "IIT", 
    notes: "1v1 rapid-fire dexterity. First person to clear their side of the board moves to the next bracket." 
  },
  { 
    id: 13, 
    name: "dumb charades", 
    image: "/game-assets/Dumb-Charedes.png", 
    date: "may 09", 
    time: "5:00 pm", 
    venue: "IIT", 
    notes: "A team-based test of silence and frantic gesturing at IIT. It’s essentially competitive professional mime-work where you’ll watch your teammates guess every possible word in the dictionary except the right one. " 
  },
  { 
    id: 14, 
    name: "cards", 
    image: "/game-assets/Cards-29.png", 
    date: "may 09", 
    time: "9:00 am", 
    venue: "IIT", 
    notes: "A strategic trick-taking battle starting Saturday morning at 9:00 AM at IIT. Team up with a partner and pray your communication is better than your bidding strategy." 
  },
  { 
    id: 15, 
    name: "wire loop", 
    image: "/game-assets/Wire-Loop.png", 
    date: "may 08-09", 
    time: "all day", 
    venue: "IIT", 
    notes: "An all-day test of steady hands and nerves of steel located at IIT. It’s a simple game of don't touch the wire, or as most people call it, discovering you have an undiagnosed hand tremor." 
  },
  { 
    id: 16, 
    name: "carrom", 
    image: "/game-assets/Carrom.png", 
    date: "may 09", 
    time: "9:00 pm", 
    venue: "IIT", 
    notes: "Classic 2v2 striker action featuring a intense group stage at IIT. Expect a test of geometry and patience as you try to sink the Queen without scratching like a total rookie" 
  },
];

const SCHEDULE_DATA = [
  {
    dayLabel: "day 01",
    date: "may 08, 2026",
    events: [
      { time: "03:00 pm", event: "chess blitz", venue: "IIT" },
      { time: "05:00 pm", event: "scrabble competition", venue: "IIT" },
      { time: "all day", event: "ludo, uno, darts, rubiks, typing, wire loop, carrom", venue: "IIT" },
    ]
  },
  {
    dayLabel: "day 02",
    date: "may 09, 2026",
    events: [
      { time: "09:00 am", event: "cards 29", venue: "IIT" },
      { time: "02:00 pm", event: "pucket tournament", venue: "IIT" },
      { time: "04:00 pm", event: "musical chairs", venue: "IIT" },
      { time: "05:00 pm", event: "dumb charades", venue: "IIT" },
      { time: "09:00 am", event: "cricket match", venue: "TBA" },
    ]
  }
];



export default function ScheduleCarousel() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="w-full py-0 px-2 md:px-4 select-none font-pixelify flex flex-col gap-4 md:gap-6">

      {/* --- GAMES SECTION --- */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <h2 className="text-center text-white text-lg md:text-2xl tracking-[0.2em] lowercase mb-1 md:mb-2 drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)] font-bold animate-glitch-slow hover:animate-glitch cursor-default transition-all">
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
                    className="w-16 md:w-16 flex-shrink-0 cursor-pointer group/card snap-center text-left appearance-none"
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
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <h2 className="text-center text-white text-lg md:text-2xl tracking-[0.2em] lowercase mb-1 md:mb-2 drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)] font-bold animate-glitch-slow hover:animate-glitch cursor-default transition-all">
          event schedule
        </h2>

        {/* Day Switcher - Mobile only */}
        <div className="flex lg:hidden gap-3 mb-4 overflow-x-auto pb-1 scrollbar-hide w-full justify-center px-4">
          {SCHEDULE_DATA.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDayIdx(idx)}
              className={`px-6 py-2 border-2 border-black text-[14px] md:text-[16px] font-bold uppercase tracking-widest transition-all duration-100 whitespace-nowrap flex-shrink-0 ${
                activeDayIdx === idx 
                ? "bg-black text-white shadow-none translate-x-1 translate-y-1" 
                : "bg-[#f4f1ea] text-black shadow-[4px_4px_0_0_rgba(0,0,0,0.8)] hover:bg-white active:scale-95 active:rotate-1 active:bg-[#16dbab]"
              }`}
            >
              {day.dayLabel}
            </button>
          ))}
        </div>

        {/* Schedule Display */}
        <div className="w-full px-2 md:px-0">
          {/* Desktop Layout: Grid (Day 1 and Day 2 side by side) */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-20 w-full">
            {SCHEDULE_DATA.map((day, idx) => (
              <div key={idx} className="h-full">
                <ScheduleDayCard day={day} />
              </div>
            ))}
          </div>

          {/* Mobile Layout: Single Box with Transition */}
          <div className="lg:hidden w-full overflow-hidden min-h-[450px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDayIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full"
              >
                <ScheduleDayCard day={SCHEDULE_DATA[activeDayIdx]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for the Schedule Card
function ScheduleDayCard({ day }: { day: any }) {
  return (
    <div className="relative bg-[#f4f1ea] p-4 md:p-5 border-2 md:border-4 border-black shadow-[10px_10px_0_0_rgba(0,0,0,0.8)] h-full overflow-hidden w-full mx-auto">
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, #000 2px, #000 3px)' }} />
      <div className="flex items-center justify-between mb-2 md:mb-4 border-b-2 border-black/10 pb-2">
        <h3 className="text-black text-xl md:text-xl tracking-[0.1em] lowercase font-black">
          {day.dayLabel}
        </h3>
        <span className="text-black/50 text-base md:text-lg lowercase tracking-widest font-black">{day.date}</span>
      </div>
      <div className="space-y-1.5 md:space-y-2 max-h-[280px] md:max-h-[300px] overflow-y-auto custom-scrollbar pr-3">
        {day.events.map((item: any, eventIdx: number) => (
          <div key={eventIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-black/10 pb-2 group/item hover:bg-black/5 transition-colors px-2">
            <div className="flex items-center gap-4">
              <span className="text-black text-lg md:text-xl font-black tracking-tight min-w-[85px] md:min-w-[100px]">
                {item.time}
              </span>
              <div className="h-4 w-px bg-black/20 hidden sm:block" />
              <span className="text-lg md:text-xl text-black/80 lowercase tracking-wide font-bold group-hover/item:text-black transition-colors">
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
  );
}
