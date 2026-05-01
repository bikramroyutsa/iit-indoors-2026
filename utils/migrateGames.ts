import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { GAMES } from "./gameInfo";

export const migrateGamesToFirestore = async () => {
  console.log("Starting migration...");
  try {
    for (const game of GAMES) {
      const gameRef = doc(db, "game_configs", game.id.toString());
      await setDoc(gameRef, game);
      console.log(`Migrated game: ${game.name}`);
    }
    console.log("Migration completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("Migration failed:", error);
    return { success: false, error };
  }
};
