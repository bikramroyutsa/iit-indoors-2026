interface Game {
  id: number;
  name: string;
  image: string;
  date: string;
  time: string;
  venue: string;
  notes: string;
  fee: number;
  type: string;
}

const GAMES: Game[] = [
  { 
    id: 1, 
    name: "valorant", 
    image: "/game-assets/Valorant.png", 
    date: "TBA", 
    time: "TBA", 
    venue: "Online", 
    notes: "Standard 5v5 competitive settings (13 rounds). Individual sign-ups only; teams will be drafted via a high-stakes player auction.",
    fee: 100,
    type: "single"
  },
  { 
    id: 2, 
    name: "chess", 
    image: "/game-assets/Chess.png", 
    date: "may 08", 
    time: "3:00 pm", 
    venue: "IIT", 
    notes: "5min + 5s Blitz format using the Swiss System. Expect a high-speed mental gauntlet where every second counts.",
    fee: 100,
    type: "single"
  },
  { 
    id: 3, 
    name: "table tennis", 
    image: "/game-assets/Table-Tennis.png", 
    date: "may 12", 
    time: "02:00 pm", 
    venue: "student lounge", 
    notes: "singles tournament. butterfly tables.",
    fee: 100,
    type: "single"
  },
  { 
    id: 4, 
    name: "scrabble", 
    image: "/game-assets/Scrabble.png", 
    date: "may 08", 
    time: "5:00 pm", 
    venue: "IIT", 
    notes: "Competitive spelling for high stakes at IIT. Form the highest-scoring words possible and prepare to defend your made-up vocabulary against skeptical opponents. ",
    fee: 100,
    type: "single"
  },
  { 
    id: 5, 
    name: "ludo", 
    image: "/game-assets/Ludo.png", 
    date: "may 08-09", 
    time: "all day", 
    venue: "IIT", 
    notes: "No need to say about this game, just come to IIT and have fun.",
    fee: 100,
    type: "single"
  },
  { 
    id: 6, 
    name: "uno", 
    image: "/game-assets/UNO.png", 
    date: "may 08-09", 
    time: "all day", 
    venue: "IIT", 
    notes: "Absolute chaos with Draw 10 stacks enabled. Just keep drawing until someone cries or wins.",
    fee: 100,
    type: "single"
  },
  { 
    id: 7, 
    name: "dart", 
    image: "/game-assets/Dart.png", 
    date: "may 08-09", 
    time: "all day", 
    venue: "IIT", 
    notes: "Darts is just the art of throwing sharp metal sticks at a wall and pretending you meant to hit the tiny red bit instead of the drywall.",
    fee: 100,
    type: "single"
  },
  { 
    id: 8, 
    name: "rubiks cube", 
    image: "/game-assets/Rubiks-Cube.png", 
    date: "may 08-09", 
    time: "all day", 
    venue: "IIT", 
    notes: "Speed-solving a Rubik's Cube is just aggressive finger aerobics where you try to outrun a stopwatch before your brain realizes it's actually just doing math at 200 mph. ",
    fee: 100,
    type: "single"
  },
  { 
    id: 9, 
    name: "cricket", 
    image: "/game-assets/Short-Pitch Cricket.png", 
    date: "may 09", 
    time: "9:00 am", 
    venue: "TBA", 
    notes: "Group stages leading into knockouts. Form your squad of 7 and prepare for a full day at IIT. Short-pitch format with 6 overs per side. Expect high-scoring matches and plenty of boundary action.",
    fee: 100,
    type: "single"
  },
  { 
    id: 10, 
    name: "musical chairs", 
    image: "/game-assets/Musical-Chairs.png", 
    date: "may 09", 
    time: "4:00 pm", 
    venue: "IIT", 
    notes: "A cutthroat elimination sprint happening at IIT. It's essentially high-stakes adult duck-duck-goose where the music stops and friendships end. ",
    fee: 100,
    type: "single"
  },
  { 
    id: 11, 
    name: "typing speed", 
    image: "/game-assets/Typing-Speed-Contest.png", 
    date: "may 08-09", 
    time: "all day", 
    venue: "IIT", 
    notes: "A digital drag race available all day Friday and Saturday at IIT. Prove your WPM is higher than your friends’ in a battle of aggressive keyboard clicking and zero typos. ",
    fee: 100,
    type: "single"
  },
  { 
    id: 12, 
    name: "pucket", 
    image: "/game-assets/Pucket.png", 
    date: "may 09", 
    time: "2:00 pm", 
    venue: "IIT", 
    notes: "1v1 rapid-fire dexterity. First person to clear their side of the board moves to the next bracket.",
    fee: 100,
    type: "single"
  },
  { 
    id: 13, 
    name: "dumb charades", 
    image: "/game-assets/Dumb-Charedes.png", 
    date: "may 09", 
    time: "5:00 pm", 
    venue: "IIT", 
    notes: "A team-based test of silence and frantic gesturing at IIT. It’s essentially competitive professional mime-work where you’ll watch your teammates guess every possible word in the dictionary except the right one. ",
    fee: 100,
    type: "single"
  },
  { 
    id: 14, 
    name: "cards", 
    image: "/game-assets/Cards-29.png", 
    date: "may 09", 
    time: "9:00 am", 
    venue: "IIT", 
    notes: "A strategic trick-taking battle starting Saturday morning at 9:00 AM at IIT. Team up with a partner and pray your communication is better than your bidding strategy.",
    fee: 100,
    type: "single"
  },
  { 
    id: 15, 
    name: "wire loop", 
    image: "/game-assets/Wire-Loop.png", 
    date: "may 08-09", 
    time: "all day", 
    venue: "IIT", 
    notes: "An all-day test of steady hands and nerves of steel located at IIT. It’s a simple game of don't touch the wire, or as most people call it, discovering you have an undiagnosed hand tremor.",
    fee: 100,
    type: "single"
  },
  { 
    id: 16, 
    name: "carrom", 
    image: "/game-assets/Carrom.png", 
    date: "may 09", 
    time: "9:00 pm", 
    venue: "IIT", 
    notes: "Classic 2v2 striker action featuring a intense group stage at IIT. Expect a test of geometry and patience as you try to sink the Queen without scratching like a total rookie",
    fee: 100,
    type: "single"
  },
];

export { GAMES };
export type { Game };