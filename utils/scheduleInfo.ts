import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export interface ScheduleEvent {
    time: string;
    event: string;
    venue: string;
}

export interface ScheduleDay {
    id?: string;
    dayLabel: string;
    date: string;
    events: ScheduleEvent[];
    order?: number;
}

const SCHEDULE_DATA: ScheduleDay[] = [
    {
        dayLabel: "day 01",
        date: "may 08, 2026",
        order: 1,
        events: [
            { time: "TBA", event: "chess blitz", venue: "IIT" },
            { time: "TBA", event: "scrabble competition", venue: "IIT" },
            { time: "TBA", event: "ludo, uno, darts, rubiks, typing, wire loop, pucket", venue: "IIT" },
        ]
    },
    {
        dayLabel: "day 02",
        date: "may 09, 2026",
        order: 2,
        events: [
            { time: "TBA", event: "cards 29, carrom, cricket, table tennis", venue: "IIT" },
            { time: "TBA", event: "musical chairs", venue: "IIT" },
            { time: "TBA", event: "dumb charades", venue: "IIT" },
           { time: "TBA", event: "ludo, uno, darts, rubiks, typing, wire loop, pucket", venue: "IIT" },

        ]
    }
];

const useSchedule = () => {
  const [schedule, setSchedule] = useState<ScheduleDay[]>(SCHEDULE_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const q = query(collection(db, "schedule_configs"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const fetchedSchedule = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScheduleDay));
          setSchedule(fetchedSchedule);
        }
      } catch (error) {
        console.error("Error fetching schedule from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  return { schedule, loading };
};

export { SCHEDULE_DATA, useSchedule }