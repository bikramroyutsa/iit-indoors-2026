"use client";

import { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { collection, getDocs, doc, setDoc, query, deleteDoc, orderBy } from "firebase/firestore";
import { migrateResultsToFirestore } from "@/utils/migrateGames";

interface Participant {
  name: string;
  batch: string;
}

interface Result {
  game: string;
  champion: Participant[];
  runnerUp: Participant[];
  secondRunnerUp: Participant[];
}

export default function ResultsTab() {
  const [results, setResults] = useState<Result[]>([]);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  const fetchResults = async () => {
    try {
      const q = query(collection(db, "tournament_results"), orderBy("game", "asc"));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => doc.data() as Result);
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Failed to fetch results", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchResults();
      setLoading(false);
    };
    init();
  }, []);

  const handleResetResults = async () => {
    if (!confirm("Are you sure you want to overwrite Firestore Results with the static JSON data? This will lose any manual edits.")) return;
    setMigrationStatus("Importing from JSON...");
    try {
      const res = await fetch('/json/results.json');
      const data = await res.json();
      const result = await migrateResultsToFirestore(data);
      if (result.success) {
        setMigrationStatus("Import successful!");
        fetchResults();
      } else {
        setMigrationStatus("Import failed.");
      }
    } catch (err) {
      console.error("Reset failed", err);
      setMigrationStatus("Error fetching JSON.");
    }
  };

  const handleAddGame = () => {
    const gameName = prompt("Enter the name of the new game:");
    if (!gameName) return;
    
    const newResult: Result = {
      game: gameName.toLowerCase(),
      champion: [],
      runnerUp: [],
      secondRunnerUp: []
    };
    
    setResults(prev => [...prev, newResult].sort((a, b) => a.game.localeCompare(b.game)));
    setSelectedResult(newResult);
  };

  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResult) return;

    setSaving(selectedResult.game);
    try {
      const gameId = selectedResult.game.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const resultRef = doc(db, "tournament_results", gameId);
      await setDoc(resultRef, selectedResult);
      setResults(prev => {
        const filtered = prev.filter(r => r.game !== selectedResult.game);
        return [...filtered, selectedResult].sort((a, b) => a.game.localeCompare(b.game));
      });
      alert(`${selectedResult.game} updated successfully!`);
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteResult = async (gameName: string) => {
    if (!confirm(`Are you sure you want to delete results for ${gameName}?`)) return;
    
    try {
      const gameId = gameName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      await deleteDoc(doc(db, "tournament_results", gameId));
      setResults(prev => prev.filter(r => r.game !== gameName));
      if (selectedResult?.game === gameName) setSelectedResult(null);
      alert(`${gameName} deleted successfully.`);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete result.");
    }
  };

  const updateParticipant = (rank: 'champion' | 'runnerUp' | 'secondRunnerUp', index: number, field: keyof Participant, value: string) => {
    if (!selectedResult) return;
    const newParticipants = [...selectedResult[rank]];
    newParticipants[index] = { ...newParticipants[index], [field]: value };
    setSelectedResult({ ...selectedResult, [rank]: newParticipants });
  };

  const addParticipant = (rank: 'champion' | 'runnerUp' | 'secondRunnerUp') => {
    if (!selectedResult) return;
    const newParticipants = [...selectedResult[rank], { name: "", batch: "bsse" }];
    setSelectedResult({ ...selectedResult, [rank]: newParticipants });
  };

  const removeParticipant = (rank: 'champion' | 'runnerUp' | 'secondRunnerUp', index: number) => {
    if (!selectedResult) return;
    const newParticipants = selectedResult[rank].filter((_, i) => i !== index);
    setSelectedResult({ ...selectedResult, [rank]: newParticipants });
  };

  if (loading) {
    return <div className="p-8 text-center text-mint animate-pulse font-pixelify">Loading results data...</div>;
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center border-b-2 border-mint/30 pb-4 shrink-0">
        <h2 className="text-xl text-mint font-pixelify uppercase tracking-widest">Tournament Results</h2>
        <div className="flex items-center gap-4">
          <button onClick={handleResetResults} className="pixel-button !bg-red-600 !text-white !text-[10px] !py-1">Import from JSON</button>
          {migrationStatus && <span className="text-[10px] text-mint-soft italic">{migrationStatus}</span>}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Sidebar List */}
        <div className="w-full lg:w-1/3 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
          <button 
            onClick={handleAddGame}
            className="p-3 text-center border-2 border-mint bg-mint/10 text-mint font-pixelify hover:bg-mint hover:text-black transition-all mb-2"
          >
            + Add New Game Result
          </button>
          
          {results.length === 0 ? (
             <div className="text-mint-soft text-xs italic p-4">No results in Firestore. Use "Import from JSON" to begin.</div>
          ) : (
            results.map(res => (
              <button
                key={res.game}
                onClick={() => setSelectedResult(res)}
                className={`p-3 text-left border-2 font-pixelify transition-all group flex justify-between items-center ${selectedResult?.game === res.game ? "bg-mint text-black border-mint scale-105" : "bg-deep-teal text-mint border-mint-soft hover:border-mint"}`}
              >
                <span className="capitalize">{res.game}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteResult(res.game); }}
                  className={`text-xs px-2 py-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all ${selectedResult?.game === res.game ? "text-red-900" : "text-red-500"}`}
                >
                  delete
                </button>
              </button>
            ))
          )}
        </div>

        {/* Editor Form */}
        <div className="flex-1 bg-black/20 p-4 md:p-6 border-2 border-mint-soft overflow-y-auto custom-scrollbar">
          {selectedResult ? (
            <form onSubmit={handleSaveResult} className="flex flex-col gap-6 font-pixelify">
              <h3 className="text-xl text-mint uppercase tracking-widest border-b-2 border-mint pb-2">Editing: {selectedResult.game}</h3>
              
              {/* Champion Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-mint/20 pb-1">
                  <label className="text-[10px] uppercase text-[#b8860b] font-bold">Champion(s)</label>
                  <button type="button" onClick={() => addParticipant('champion')} className="text-[10px] bg-mint text-black px-2 py-0.5 hover:bg-white">+ Add</button>
                </div>
                <div className="space-y-2">
                  {selectedResult.champion.map((p, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="flex-1 min-w-0">
                        <input 
                          type="text" 
                          placeholder="Winner Name" 
                          value={p.name} 
                          onChange={(e) => updateParticipant('champion', idx, 'name', e.target.value)} 
                          className="pixel-input !py-1 text-sm w-full" 
                        />
                      </div>
                      <div className="w-32 shrink-0">
                        <input 
                          type="text" 
                          placeholder="Batch" 
                          value={p.batch} 
                          onChange={(e) => updateParticipant('champion', idx, 'batch', e.target.value)} 
                          className="pixel-input !py-1 text-sm w-full" 
                        />
                      </div>
                      <button type="button" onClick={() => removeParticipant('champion', idx)} className="text-red-500 px-2 text-xl hover:scale-125 transition-transform">×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Runner Up Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-mint/20 pb-1">
                  <label className="text-[10px] uppercase text-[#556677] font-bold">Runner-Up(s)</label>
                  <button type="button" onClick={() => addParticipant('runnerUp')} className="text-[10px] bg-mint text-black px-2 py-0.5 hover:bg-white">+ Add</button>
                </div>
                <div className="space-y-2">
                  {selectedResult.runnerUp.map((p, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="flex-1 min-w-0">
                        <input 
                          type="text" 
                          placeholder="Winner Name" 
                          value={p.name} 
                          onChange={(e) => updateParticipant('runnerUp', idx, 'name', e.target.value)} 
                          className="pixel-input !py-1 text-sm w-full" 
                        />
                      </div>
                      <div className="w-32 shrink-0">
                        <input 
                          type="text" 
                          placeholder="Batch" 
                          value={p.batch} 
                          onChange={(e) => updateParticipant('runnerUp', idx, 'batch', e.target.value)} 
                          className="pixel-input !py-1 text-sm w-full" 
                        />
                      </div>
                      <button type="button" onClick={() => removeParticipant('runnerUp', idx)} className="text-red-500 px-2 text-xl hover:scale-125 transition-transform">×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2nd Runner Up Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-mint/20 pb-1">
                  <label className="text-[10px] uppercase text-[#8b4513] font-bold">2nd Runner-Up(s)</label>
                  <button type="button" onClick={() => addParticipant('secondRunnerUp')} className="text-[10px] bg-mint text-black px-2 py-0.5 hover:bg-white">+ Add</button>
                </div>
                <div className="space-y-2">
                  {selectedResult.secondRunnerUp.map((p, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="flex-1 min-w-0">
                        <input 
                          type="text" 
                          placeholder="Winner Name" 
                          value={p.name} 
                          onChange={(e) => updateParticipant('secondRunnerUp', idx, 'name', e.target.value)} 
                          className="pixel-input !py-1 text-sm w-full" 
                        />
                      </div>
                      <div className="w-32 shrink-0">
                        <input 
                          type="text" 
                          placeholder="Batch" 
                          value={p.batch} 
                          onChange={(e) => updateParticipant('secondRunnerUp', idx, 'batch', e.target.value)} 
                          className="pixel-input !py-1 text-sm w-full" 
                        />
                      </div>
                      <button type="button" onClick={() => removeParticipant('secondRunnerUp', idx)} className="text-red-500 px-2 text-xl hover:scale-125 transition-transform">×</button>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={!!saving} className="pixel-button mt-4 w-full disabled:opacity-50">
                {saving === selectedResult.game ? "Saving..." : "Save Changes"}
              </button>
            </form>
          ) : (
            <div className="h-full flex items-center justify-center text-mint-soft italic opacity-50 font-pixelify">
              Select a game from the list to edit its results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
