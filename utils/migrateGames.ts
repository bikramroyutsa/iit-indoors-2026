import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { GAMES } from "./gameInfo";
import { SCHEDULE_DATA } from "./scheduleInfo";

export const migrateGamesToFirestore = async () => {
  console.log("Starting games migration...");
  try {
    for (const game of GAMES) {
      const gameRef = doc(db, "game_configs", game.id.toString());
      await setDoc(gameRef, game);
      console.log(`Migrated game: ${game.name}`);
    }
    console.log("Games migration completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("Games migration failed:", error);
    return { success: false, error };
  }
};

export const migrateScheduleToFirestore = async () => {
  console.log("Starting schedule migration...");
  try {
    for (let i = 0; i < SCHEDULE_DATA.length; i++) {
      const day = SCHEDULE_DATA[i];
      const dayRef = doc(db, "schedule_configs", `day-${i + 1}`);
      await setDoc(dayRef, { ...day, order: i + 1 });
      console.log(`Migrated schedule day: ${day.dayLabel}`);
    }
    console.log("Schedule migration completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("Schedule migration failed:", error);
    return { success: false, error };
  }
};
