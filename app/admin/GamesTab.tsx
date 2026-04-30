import { useState } from "react";
import { db } from "@/utils/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { GAMES } from "@/utils/gameInfo";

export default function GamesTab() {
  const [selectedGameTab, setSelectedGameTab] = useState<string | null>(null);
  const [gameParticipants, setGameParticipants] = useState<any[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const fetchGameParticipants = async (gameName: string) => {
    setSelectedGameTab(gameName);
    setLoadingParticipants(true);
    try {
      const q = query(collection(db, gameName));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGameParticipants(data);
    } catch (err) {
      console.error("Failed to fetch game participants", err);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!selectedGameTab || gameParticipants.length === 0) return;
    const headers = ["Name", "Batch", "Roll", "Email", "Phone", "Transaction ID", "Teammates"];
    const rows = gameParticipants.map(p => [
      `"${p.name || ""}"`,
      `"${p.batch || ""}"`,
      `"${p.bsse_roll || ""}"`,
      `"${p.mail || ""}"`,
      `"${p.phone || ""}"`,
      `"${p.transactionId || ""}"`,
      `"${p.teammates && p.teammates.length > 0 ? p.teammates.join(", ") : ""}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedGameTab.replace(/\s+/g, '_').toLowerCase()}_participants.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => fetchGameParticipants(game.name)}
            className={`px-3 py-1 text-sm border-2 font-pixelify ${selectedGameTab === game.name ? "bg-mint text-black border-mint" : "bg-deep-teal text-mint border-mint-soft hover:border-mint"}`}
          >
            {game.name}
          </button>
        ))}
      </div>

      {selectedGameTab && (
        <>
          <div className="flex justify-between items-center mb-4 gap-4">
            <h2 className="text-xl font-bold text-mint tracking-widest uppercase">{selectedGameTab} Participants</h2>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => fetchGameParticipants(selectedGameTab)}
                disabled={loadingParticipants}
                className={`pixel-button !py-2 !px-4 text-sm ${loadingParticipants ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              >
                {loadingParticipants ? "refreshing..." : "refresh"}
              </button>
              <button 
                onClick={handleDownloadCSV}
                disabled={gameParticipants.length === 0 || loadingParticipants}
                className={`pixel-button !py-2 !px-4 text-sm ${gameParticipants.length === 0 || loadingParticipants ? 'opacity-50 cursor-not-allowed' : '!bg-white !text-black shadow-[4px_4px_0px_#000] hover:scale-105'}`}
              >
                download csv
              </button>
            </div>
          </div>
          
          {loadingParticipants ? (
            <div className="py-12 text-center text-mint font-pixelify animate-pulse text-xl border-2 border-mint-soft">
              loading participants...
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left font-pixelify text-foreground border-collapse">
                <thead>
                  <tr className="bg-mint text-deep-teal uppercase text-sm tracking-widest">
                    <th className="p-3 border-2 border-black whitespace-nowrap">Name</th>
                    <th className="p-3 border-2 border-black whitespace-nowrap">Batch</th>
                    <th className="p-3 border-2 border-black whitespace-nowrap">Roll</th>
                    <th className="p-3 border-2 border-black whitespace-nowrap">Email</th>
                    <th className="p-3 border-2 border-black whitespace-nowrap">Phone</th>
                    <th className="p-3 border-2 border-black whitespace-nowrap">Txn ID</th>
                    <th className="p-3 border-2 border-black whitespace-nowrap">Teammates</th>
                  </tr>
                </thead>
                <tbody>
                  {gameParticipants.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-mint-soft border-2 border-black">
                        No participants found for {selectedGameTab}.
                      </td>
                    </tr>
                  ) : (
                    gameParticipants.map((p, i) => (
                      <tr key={p.id} className={i % 2 === 0 ? "bg-background" : "bg-deep-teal/50"}>
                        <td className="p-3 border-2 border-black whitespace-nowrap">{p.name}</td>
                        <td className="p-3 border-2 border-black">{p.batch}</td>
                        <td className="p-3 border-2 border-black">{p.bsse_roll}</td>
                        <td className="p-3 border-2 border-black">{p.mail}</td>
                        <td className="p-3 border-2 border-black">{p.phone}</td>
                        <td className="p-3 border-2 border-black font-mono text-sm">{p.transactionId}</td>
                        <td className="p-3 border-2 border-black">
                          {p.teammates && p.teammates.length > 0 ? p.teammates.join(", ") : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
