"use client";

import { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { collection, getDocs, doc, setDoc, orderBy, query, deleteDoc } from "firebase/firestore";
import { Game, GAMES } from "@/utils/gameInfo";
import { ScheduleDay, ScheduleEvent } from "@/utils/scheduleInfo";
import { migrateGamesToFirestore, migrateScheduleToFirestore } from "@/utils/migrateGames";

export default function CustomizerTab() {
  const [activeView, setActiveView] = useState<"games" | "schedule">("games");
  
  // Games State
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  
  // Schedule State
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<ScheduleDay | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | number | null>(null);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  const fetchGames = async () => {
    try {
      const q = query(collection(db, "game_configs"), orderBy("id", "asc"));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => doc.data() as Game);
        setGames(data);
      }
    } catch (err) {
      console.error("Failed to fetch games", err);
    }
  };

  const fetchSchedule = async () => {
    try {
      const q = query(collection(db, "schedule_configs"), orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScheduleDay));
        setSchedule(data);
      } else {
        setSchedule([]);
      }
    } catch (err) {
      console.error("Failed to fetch schedule", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchGames(), fetchSchedule()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleMigrateGames = async () => {
    if (!confirm("Are you sure you want to overwrite Firestore Games data with the static file data?")) return;
    setMigrationStatus("Migrating Games...");
    const result = await migrateGamesToFirestore();
    if (result.success) {
      setMigrationStatus("Games Migration successful!");
      fetchGames();
    } else {
      setMigrationStatus("Games Migration failed.");
    }
  };

  const handleMigrateSchedule = async () => {
    if (!confirm("Are you sure you want to overwrite Firestore Schedule data with the static file data?")) return;
    setMigrationStatus("Migrating Schedule...");
    const result = await migrateScheduleToFirestore();
    if (result.success) {
      setMigrationStatus("Schedule Migration successful!");
      fetchSchedule();
    } else {
      setMigrationStatus("Schedule Migration failed.");
    }
  };

  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGame) return;

    setSaving(selectedGame.id);
    try {
      const gameRef = doc(db, "game_configs", selectedGame.id.toString());
      await setDoc(gameRef, selectedGame);
      setGames(prev => prev.map(g => g.id === selectedGame.id ? selectedGame : g));
      alert(`${selectedGame.name} updated successfully!`);
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(null);
    }
  };

  const handleSaveScheduleDay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !selectedDay.id) return;

    setSaving(selectedDay.id);
    try {
      const dayRef = doc(db, "schedule_configs", selectedDay.id);
      await setDoc(dayRef, selectedDay);
      setSchedule(prev => prev.map(d => d.id === selectedDay.id ? selectedDay : d));
      alert(`${selectedDay.dayLabel} updated successfully!`);
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(null);
    }
  };

  const updateGameField = (field: keyof Game, value: any) => {
    if (!selectedGame) return;
    setSelectedGame({ ...selectedGame, [field]: value });
  };

  const updateScheduleField = (field: keyof ScheduleDay, value: any) => {
    if (!selectedDay) return;
    setSelectedDay({ ...selectedDay, [field]: value });
  };

  const addEvent = () => {
    if (!selectedDay) return;
    const newEvents = [...selectedDay.events, { time: "TBA", event: "", venue: "IIT" }];
    updateScheduleField("events", newEvents);
  };

  const removeEvent = (index: number) => {
    if (!selectedDay) return;
    const newEvents = selectedDay.events.filter((_, i) => i !== index);
    updateScheduleField("events", newEvents);
  };

  const updateEventField = (index: number, field: keyof ScheduleEvent, value: string) => {
    if (!selectedDay) return;
    const newEvents = [...selectedDay.events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    updateScheduleField("events", newEvents);
  };

  if (loading) {
    return <div className="p-8 text-center text-mint animate-pulse font-pixelify">Loading customizer data...</div>;
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Tab Switcher */}
      <div className="flex gap-4 border-b-2 border-mint/30 pb-4 shrink-0">
        <button 
          onClick={() => setActiveView("games")}
          className={`pixel-button !py-1 !px-6 text-sm ${activeView === "games" ? "!bg-mint !text-black" : "!bg-transparent !text-mint opacity-60"}`}
        >
          Games
        </button>
        <button 
          onClick={() => setActiveView("schedule")}
          className={`pixel-button !py-1 !px-6 text-sm ${activeView === "schedule" ? "!bg-mint !text-black" : "!bg-transparent !text-mint opacity-60"}`}
        >
          Schedule
        </button>
        
        <div className="ml-auto flex items-center gap-4">
          {activeView === "games" ? (
             <button onClick={handleMigrateGames} className="pixel-button !bg-red-600 !text-white !text-[10px] !py-1">Reset Games</button>
          ) : (
             <button onClick={handleMigrateSchedule} className="pixel-button !bg-red-600 !text-white !text-[10px] !py-1">Reset Schedule</button>
          )}
          {migrationStatus && <span className="text-[10px] text-mint-soft italic">{migrationStatus}</span>}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Sidebar List */}
        <div className="w-full lg:w-1/3 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
          {activeView === "games" ? (
            games.map(game => (
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
            ))
          ) : (
            schedule.map(day => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day)}
                className={`p-3 text-left border-2 font-pixelify transition-all ${selectedDay?.id === day.id ? "bg-mint text-black border-mint scale-105" : "bg-deep-teal text-mint border-mint-soft hover:border-mint"}`}
              >
                <div className="flex justify-between items-center">
                  <span className="capitalize">{day.dayLabel}</span>
                  <span className="text-[10px] opacity-70">{day.date}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Editor Form */}
        <div className="flex-1 bg-black/20 p-4 md:p-6 border-2 border-mint-soft overflow-y-auto custom-scrollbar">
          {activeView === "games" && selectedGame ? (
            <form onSubmit={handleSaveGame} className="flex flex-col gap-6 font-pixelify">
              <h3 className="text-xl text-mint uppercase tracking-widest border-b-2 border-mint pb-2">Editing Game: {selectedGame.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-mint-soft">Date</label>
                  <input type="text" value={selectedGame.date} onChange={(e) => updateGameField("date", e.target.value)} className="pixel-input !py-1 text-sm w-full" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-mint-soft">Time</label>
                  <input type="text" value={selectedGame.time} onChange={(e) => updateGameField("time", e.target.value)} className="pixel-input !py-1 text-sm w-full" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-mint-soft">Venue</label>
                  <input type="text" value={selectedGame.venue} onChange={(e) => updateGameField("venue", e.target.value)} className="pixel-input !py-1 text-sm w-full" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-mint-soft">Fee (৳)</label>
                  <input type="number" value={selectedGame.fee} onChange={(e) => updateGameField("fee", parseInt(e.target.value) || 0)} className="pixel-input !py-1 text-sm w-full" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-mint-soft">Notes</label>
                <textarea value={selectedGame.notes} onChange={(e) => updateGameField("notes", e.target.value)} className="pixel-input !py-1 text-sm w-full min-h-[80px]" />
              </div>
              <button type="submit" disabled={saving === selectedGame.id} className="pixel-button mt-4 w-full disabled:opacity-50">
                {saving === selectedGame.id ? "Saving..." : "Save Changes"}
              </button>
            </form>
          ) : activeView === "schedule" && selectedDay ? (
            <form onSubmit={handleSaveScheduleDay} className="flex flex-col gap-6 font-pixelify">
              <h3 className="text-xl text-mint uppercase tracking-widest border-b-2 border-mint pb-2">Editing Schedule: {selectedDay.dayLabel}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-mint-soft">Day Label</label>
                  <input type="text" value={selectedDay.dayLabel} onChange={(e) => updateScheduleField("dayLabel", e.target.value)} className="pixel-input !py-1 text-sm w-full" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-mint-soft">Date</label>
                  <input type="text" value={selectedDay.date} onChange={(e) => updateScheduleField("date", e.target.value)} className="pixel-input !py-1 text-sm w-full" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-mint/20 pb-1">
                  <label className="text-[10px] uppercase text-mint-soft">Events</label>
                  <button type="button" onClick={addEvent} className="text-[10px] bg-mint text-black px-2 py-0.5 hover:bg-white">+ Add Event</button>
                </div>
                <div className="space-y-4">
                  {selectedDay.events.map((event, idx) => (
                    <div key={idx} className="p-3 bg-black/30 border border-mint/20 space-y-2 relative group">
                       <button type="button" onClick={() => removeEvent(idx)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <label className="text-[8px] uppercase text-mint-soft/50">Time</label>
                            <input type="text" value={event.time} onChange={(e) => updateEventField(idx, "time", e.target.value)} className="pixel-input !py-0.5 text-xs w-full" />
                          </div>
                          <div className="space-y-1 col-span-2">
                            <label className="text-[8px] uppercase text-mint-soft/50">Event Name</label>
                            <input type="text" value={event.event} onChange={(e) => updateEventField(idx, "event", e.target.value)} className="pixel-input !py-0.5 text-xs w-full" />
                          </div>
                          <div className="space-y-1 col-span-3">
                            <label className="text-[8px] uppercase text-mint-soft/50">Venue</label>
                            <input type="text" value={event.venue} onChange={(e) => updateEventField(idx, "venue", e.target.value)} className="pixel-input !py-0.5 text-xs w-full" />
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={saving === selectedDay.id} className="pixel-button mt-4 w-full disabled:opacity-50">
                {saving === selectedDay.id ? "Saving..." : "Save Changes"}
              </button>
            </form>
          ) : (
            <div className="h-full flex items-center justify-center text-mint-soft italic opacity-50 font-pixelify">
              Select an item from the list to start customizing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
