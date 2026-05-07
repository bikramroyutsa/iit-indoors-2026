import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

interface Game {
  id: number;
  name: string;
  image: string;
  date: string;
  time: string;
  venue: string;
  notes: string;
  rules: string[];
  fee: number;
  type: string;
  members: number | null;
  reg_req: boolean;
}

const GAMES: Game[] = [
  {
    id: 1,
    name: "valorant",
    image: "/game-assets/Valorant.png",
    date: "tba",
    time: "tba",
    venue: "Online",
    notes: "Standard 5v5 competitive settings (13 rounds). Individual sign-ups only; teams will be drafted via a high-stakes player auction.",
    rules: [
      "Format: Standard 5v5 competitive settings (first to 13 rounds).",
      "Registration: Individual sign-ups only. Teams will be drafted via a high-stakes player auction.",
      "Process: Registered players will be added to a dedicated Discord server for auction and scheduling.",
      "The tournament structure (knockout or group stage) determined by final number of teams."
    ],
    fee: 100,
    type: "multiplayer",
    members: 1,
    reg_req: true
  },
  {
    id: 2,
    name: "chess",
    image: "/game-assets/Chess.png",
    date: "may 08",
    time: "tba",
    venue: "IIT",
    notes: "5min + 5s Blitz format using the Swiss System. Expect a high-speed mental gauntlet where every second counts.",
    rules: [
      "Format: Blitz (5 minutes + 5-second increment per move).",
      "Structure: Standard Swiss System.",
      "Regulations: FIDE Blitz rules apply."
    ],
    fee: 150,
    type: "single",
    members: null,
    reg_req: true
  },
  {
    id: 3,
    name: "scrabble",
    image: "/game-assets/Scrabble.png",
    date: "may 08",
    time: "tba",
    venue: "IIT",
    notes: "Competitive spelling for high stakes at IIT. Form the highest-scoring words possible and prepare to defend your \"made-up\" vocabulary against skeptical opponents.",
    rules: [
      "Standard Scrabble rules apply.",
      "Highest total score at the end of the round wins."
    ],
    fee: 50,
    type: "single",
    members: null,
    reg_req: true
  },
  {
    id: 4,
    name: "ludo",
    image: "/game-assets/Ludo.png",
    date: "may 08-09",
    time: "all day",
    venue: "IIT",
    notes: "No need to say about this game, just come to IIT and have fun.",
    rules: [
      "Standard Ludo rules apply.",
      "First player to finish wins."
    ],
    fee: 0,
    type: "multiplayer",
    members: null,
    reg_req: false
  },
  {
    id: 5,
    name: "uno",
    image: "/game-assets/UNO.png",
    date: "may 08-09",
    time: "all day",
    venue: "IIT",
    notes: "Absolute chaos with Draw 10 stacks enabled. Just keep drawing until someone cries or wins.",
    rules: [
      "Standard Uno No Mercy Rules apply."
    ],
    fee: 0,
    type: "single",
    members: null,
    reg_req: false
  },
  {
    id: 6,
    name: "dart",
    image: "/game-assets/Dart.png",
    date: "may 08-09",
    time: "all day",
    venue: "IIT",
    notes: "Darts is just the art of throwing sharp metal sticks at a wall and pretending you meant to hit the tiny red bit instead of the drywall.",
    rules: [
      "3 darts per turn; total score is recorded.",
      "On-site re-registration allowed for multiple attempts.",
      "Highest single-turn score wins."
    ],
    fee: 50,
    type: "single",
    members: null,
    reg_req: true
  },
  {
    id: 7,
    name: "rubiks cube",
    image: "/game-assets/Rubiks-Cube.png",
    date: "may 08-09",
    time: "all day",
    venue: "IIT",
    notes: "Speed-solving a Rubik's Cube is just aggressive finger aerobics where you try to outrun a stopwatch before your brain realizes it's actually just doing math at 200 mph.",
    rules: [
      "Each registration allows for one official timed solve.",
      "Additional attempts granted through on-site re-registration.",
      "Only the fastest solve time will be recorded for final rankings."
    ],
    fee: 50,
    type: "single",
    members: null,
    reg_req: true
  },
  {
    id: 8,
    name: "cricket",
    image: "/game-assets/Short-Pitch Cricket.png",
    date: "may 09",
    time: "tba",
    venue: "tba",
    notes: "Group stages leading into knockouts. Form your squad of 7 and prepare for a full day at IIT. Short-pitch format with 6 overs per side. Expect high-scoring matches and plenty of boundary action.",
    rules: [
      "Matches follow a Short Pitch format.",
      "Each innings consists of 6 overs.",
      "Teams must consist of 7 members per side.",
      "Structure includes group stages followed by a knockout phase."
    ],
    fee: 1500,
    type: "multiplayer",
    members: 8,
    reg_req: true
  },
  {
    id: 9,
    name: "musical chairs",
    image: "/game-assets/Musical-Chairs.png",
    date: "may 09",
    time: "tba",
    venue: "IIT",
    notes: "A cutthroat elimination sprint happening at IIT. It's essentially high-stakes adult duck-duck-goose where the music stops and friendships end.",
    rules: [
      "Separate segments for male and female participants.",
      "Standard elimination rules: when the music stops, participants must find a seat.",
      "One chair removed after each round until a single winner remains."
    ],
    fee: 0,
    type: "single",
    members: null,
    reg_req: true
  },
  {
    id: 10,
    name: "typing speed",
    image: "/game-assets/Typing-Speed-Contest.png",
    date: "may 08-09",
    time: "all day",
    venue: "IIT",
    notes: "A digital drag race available all day Friday and Saturday at IIT. Prove your WPM is higher than your friends’ in a battle of aggressive keyboard clicking and zero typos.",
    rules: [
      "Participants compete in a 1-minute typing speed challenge.",
      "On-site re-registration available for higher score attempts.",
      "Only the highest recorded WPM (Words Per Minute) used for final rankings."
    ],
    fee: 30,
    type: "single",
    members: null,
    reg_req: true
  },
  {
    id: 11,
    name: "pucket",
    image: "/game-assets/Pucket.png",
    date: "may 09",
    time: "tba",
    venue: "IIT",
    notes: "1v1 rapid-fire dexterity. First person to clear their side of the board moves to the next bracket.",
    rules: [
      "Use elastic band to launch pucks through the gate.",
      "Striking pucks with hands or 'double strikes' is strictly prohibited and results in a penalty."
    ],
    fee: 0,
    type: "single",
    members: null,
    reg_req: false
  },
  {
    id: 12,
    name: "dumb charades",
    image: "/game-assets/Dumb-Charedes.png",
    date: "may 09",
    time: "tba",
    venue: "IIT",
    notes: "A team-based test of silence and frantic gesturing at IIT. It’s essentially competitive professional mime-work where you’ll watch your teammates guess every possible word in the dictionary except the right one.",
    rules: [
      "Teams must consist of exactly 3 members.",
      "Participants pick topic chits to act out.",
      "Actor has a one-minute time limit.",
      "No speaking, lip-syncing, or pointing at objects allowed."
    ],
    fee: 150,
    type: "multiplayer",
    members: 3,
    reg_req: true
  },
  {
    id: 13,
    name: "cards",
    image: "/game-assets/Cards-29.png",
    date: "may 09",
    time: "tba",
    venue: "IIT",
    notes: "A strategic trick-taking battle starting Saturday morning at IIT. Team up with a partner and pray your communication is better than your bidding strategy.",
    rules: [
      "Played in a 2v2 team format with fixed partners.",
      "Standard 29-card game rules apply (bidding and trick-taking).",
      "Tournament structure announced at the start of the session."
    ],
    fee: 200,
    type: "multiplayer",
    members: 2,
    reg_req: true
  },
  {
    id: 14,
    name: "wire loop",
    image: "/game-assets/Wire-Loop.png",
    date: "may 08-09",
    time: "all day",
    venue: "IIT",
    notes: "An all-day test of steady hands and nerves of steel located at IIT. It’s a simple game of don't touch the wire, or as most people call it, discovering you have an undiagnosed hand tremor.",
    rules: [
      "Each registration grants one (1) official attempt.",
      "The course must be completed within a 100-second time limit.",
      "Re-registration allowed to fail/improve score."
    ],
    fee: 20,
    type: "single",
    members: null,
    reg_req: true
  },
  {
    id: 15,
    name: "carrom",
    image: "/game-assets/Carrom.png",
    date: "may 09",
    time: "tba",
    venue: "IIT",
    notes: "Classic 2v2 striker action featuring a intense group stage at IIT. Expect a test of geometry and patience as you try to sink the Queen without scratching like a total rookie.",
    rules: [
      "Played in a 2v2 doubles format.",
      "Standard 23-point matches.",
      "Format includes group stages followed by knockouts."
    ],
    fee: 200,
    type: "multiplayer",
    members: 2,
    reg_req: true
  },
  {
    id: 16,
    name: "table tennis",
    image: "/game-assets/Table-Tennis.png",
    date: "may 09",
    time: "tba",
    venue: "IIT",
    notes: "Table Tennis: where lightning-fast reflexes meet the ultimate game of high-speed geometry.",
    rules: [
      "Teams must consist of two players.",
      "Standard international doubles rules strictly followed.",
      "Tournament begins with group stages leading into knockout rounds.",
      "The organizers reserve the right to modify the tournament structure based on the number of registered teams.",
    ],
    fee: 400,
    type: "multiplayer",
    members: 2,
    reg_req: true
  },
  {
    id: 17,
    name: "clash royale",
    image: "/game-assets/Clash-Royale.png",
    date: "tba",
    time: "tba",
    venue: "Online",
    notes: "Three minutes of tactical chaos where one perfectly timed log can turn a tower into a memory.",
    rules: [
      "All players must register individually.",
      "Participants added to a specific tournament clan.",
      "Matches played in a 1v1 Draft format.",
      "Structure (knockout vs group) announced prior to start."
    ],
    fee: 50,
    type: "single",
    members: null,
    reg_req: true
  },
  {
    id: 18,
    name: "efootball (pes)",
    image: "/game-assets/pes.png",
    date: "tba",
    time: "tba",
    venue: "Online",
    notes: "The beautiful game refined into a battle of clinical precision, where every tactical adjustment paves the way to glory.",
    rules: [
      "All matches governed by General Games Rules.",
      "Matches follow a 10-minute total duration (5 minutes per half)."
    ],
    fee: 50,
    type: "single",
    members: null,
    reg_req: true
  },
  {
    id: 19,
    name: "clash of clans",
    image: "/game-assets/Clash-of-Clans.png",
    date: "tba",
    time: "tba",
    venue: "Online",
    notes: "The only place where you’ll spend two weeks waiting for a building to finish just to watch a group of wall-breakers ruin your life in thirty seconds.",
    rules: [
      "All players must register individually and provide their unique Player Tag (#ID) at the time of signup for verification.",
      "Participants will compete in a 1v1 Friendly Challenge format using a Draft System.",
      "The tournament structure announced at start based on participant count.",
      "Organizers reserve the right to modify rules based on final participation."
    ],
    fee: 50,
    type: "single",
    members: null,
    reg_req: true
  },
  {
    id: 20,
    name: "efootball (pes) multiplayer",
    image: "/game-assets/pes.png",
    date: "tba",
    time: "tba",
    venue: "Online",
    notes: "The beautiful game refined into a battle of clinical precision, where every tactical adjustment paves the way to glory.",
    rules: [
      "All matches governed by General Games Rules.",
      "Matches follow a 10-minute total duration (5 minutes per half)."
    ],
    fee: 100,
    type: "multiplayer",
    members: 2,
    reg_req: true
  },
];

const useGames = () => {
  const [games, setGames] = useState<Game[]>(GAMES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const q = query(collection(db, "game_configs"), orderBy("id", "asc"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const fetchedGames = snapshot.docs.map(doc => doc.data() as Game);
          setGames(fetchedGames);
        }
      } catch (error) {
        console.error("Error fetching games from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return { games, loading };
};

export { GAMES, useGames };
export type { Game };