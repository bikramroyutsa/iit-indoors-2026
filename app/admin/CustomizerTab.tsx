"use client";

import { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { collection, getDocs, doc, setDoc, orderBy, query } from "firebase/firestore";
import { Game, GAMES } from "@/utils/gameInfo";
import { migrateGamesToFirestore } from "@/utils/migrateGames";

export default function CustomizerTab() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "game_configs"), orderBy("id", "asc"));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setMigrationStatus("No games found in Firestore. Please run migration.");
        setGames([]);
      } else {
        const data = snapshot.docs.map(doc => doc.data() as Game);
        setGames(data);
        setMigrationStatus(null);
      }
    } catch (err) {
      console.error("Failed to fetch games", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleMigrate = async () => {
    if (!confirm("Are you sure you want to overwrite Firestore data with the static file data?")) return;
    setMigrationStatus("Migrating...");
    const result = await migrateGamesToFirestore();
    if (result.success) {
      setMigrationStatus("Migration successful!");
      fetchGames();
    } else {
      setMigrationStatus("Migration failed. Check console.");
    }
  };

  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGame) return;

    setSaving(selectedGame.id);
    try {
      const gameRef = doc(db, "game_configs", selectedGame.id.toString());
      await setDoc(gameRef, selectedGame);
      
      // Update local state
      setGames(prev => prev.map(g => g.id === selectedGame.id ? selectedGame : g));
      alert(`${selectedGame.name} updated successfully!`);
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(null);
    }
  };

  const updateField = (field: keyof Game, value: any) => {
    if (!selectedGame) return;
    setSelectedGame({ ...selectedGame, [field]: value });
  };

  const updateRule = (index: number, value: string) => {
    if (!selectedGame) return;
    const newRules = [...selectedGame.rules];
    newRules[index] = value;
    updateField("rules", newRules);
  };

  const addRule = () => {
    if (!selectedGame) return;
    updateField("rules", [...selectedGame.rules, ""]);
  };

  const removeRule = (index: number) => {
    if (!selectedGame) return;
    const newRules = selectedGame.rules.filter((_, i) => i !== index);
    updateField("rules", newRules);
  };

  if (loading) {
    return <div className="p-8 text-center text-mint animate-pulse font-pixelify">Loading game configurations...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Game List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar max-h-[70vh]">
        <div className="mb-4 flex flex-col gap-2">
           <button 
            onClick={handleMigrate}
            className="pixel-button !bg-red-600 !text-white !text-[10px] !py-1"
          >
            Reset from static file
          </button>
          {migrationStatus && <div className="text-[10px] text-mint-soft italic">{migrationStatus}</div>}
        </div>

        {games.length === 0 && !loading && (
           <div className="text-mint-soft text-sm p-4 border-2 border-dashed border-mint/30 rounded text-center">
             No data in Firestore.
           </div>
        )}

        {games.map(game => (
          <button
            key={game.id}
            onClick={() => setSelectedGame(game)}
            className={`p-3 text-left border-2 font-pixelify transition-all ${selectedGame?.id === game.id ? "bg-mint text-black border-mint scale-105" : "bg-deep-teal text-mint border-mint-soft hover:border-mint"}`}
          >
            <div className="flex justify-between items-center">
              <span className="capitalize">{game.name}</span>
              <span className="text-[10px] opacity-70">ID: {game.id}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Editor Form */}
      <div className="flex-1 bg-black/20 p-4 md:p-6 border-2 border-mint-soft overflow-y-auto custom-scrollbar max-h-[70vh]">
        {selectedGame ? (
          <form onSubmit={handleSaveGame} className="flex flex-col gap-6 font-pixelify">
            <h3 className="text-xl text-mint uppercase tracking-widest border-b-2 border-mint pb-2">
              Editing: {selectedGame.name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-mint-soft">Date</label>
                <input 
                  type="text" 
                  value={selectedGame.date} 
                  onChange={(e) => updateField("date", e.target.value)}
                  className="pixel-input !py-1 text-sm w-full"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-mint-soft">Time</label>
                <input 
                  type="text" 
                  value={selectedGame.time} 
                  onChange={(e) => updateField("time", e.target.value)}
                  className="pixel-input !py-1 text-sm w-full"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-mint-soft">Venue</label>
                <input 
                  type="text" 
                  value={selectedGame.venue} 
                  onChange={(e) => updateField("venue", e.target.value)}
                  className="pixel-input !py-1 text-sm w-full"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-mint-soft">Fee (৳)</label>
                <input 
                  type="number" 
                  value={selectedGame.fee} 
                  onChange={(e) => updateField("fee", parseInt(e.target.value) || 0)}
                  className="pixel-input !py-1 text-sm w-full"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-mint-soft">Notes</label>
              <textarea 
                value={selectedGame.notes} 
                onChange={(e) => updateField("notes", e.target.value)}
                className="pixel-input !py-1 text-sm w-full min-h-[80px]"
              />
            </div>

            <div className="flex gap-6 items-center">
               <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedGame.reg_req} 
                    onChange={(e) => updateField("reg_req", e.target.checked)}
                    className="w-4 h-4 accent-mint"
                  />
                  <span className="text-sm text-mint group-hover:text-white">Registration Required</span>
               </label>
               
               {selectedGame.type === "multiplayer" && (
                 <div className="flex items-center gap-2">
                    <label className="text-[10px] uppercase text-mint-soft">Team Size</label>
                    <input 
                      type="number" 
                      value={selectedGame.members || 0} 
                      onChange={(e) => updateField("members", parseInt(e.target.value) || null)}
                      className="pixel-input !py-1 !px-2 text-sm w-16"
                    />
                 </div>
               )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase text-mint-soft">Rules</label>
                <button 
                  type="button" 
                  onClick={addRule}
                  className="text-[10px] bg-mint text-black px-2 py-0.5 hover:bg-white"
                >
                  + Add Rule
                </button>
              </div>
              <div className="space-y-2">
                {selectedGame.rules.map((rule, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      value={rule} 
                      onChange={(e) => updateRule(idx, e.target.value)}
                      className="pixel-input !py-1 text-xs flex-1"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeRule(idx)}
                      className="text-red-500 hover:text-red-300 px-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saving === selectedGame.id}
              className="pixel-button mt-4 w-full disabled:opacity-50"
            >
              {saving === selectedGame.id ? "Saving..." : "Save Changes"}
            </button>
          </form>
        ) : (
          <div className="h-full flex items-center justify-center text-mint-soft italic opacity-50 font-pixelify">
            Select a game from the list to start customizing.
          </div>
        )}
      </div>
    </div>
  );
}
