import { useState } from "react";
import { db } from "@/utils/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { useGames } from "@/utils/gameInfo";
import RegistrationDetailsModal from "./RegistrationDetailsModal";

export default function GamesTab() {
  const { games: GAMES } = useGames();
  const [selectedGameTab, setSelectedGameTab] = useState<string | null>(null);
  const [gameParticipants, setGameParticipants] = useState<any[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any | null>(null);

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

  const isCoc = selectedGameTab?.toLowerCase() === "clash of clans";
  const isPes = selectedGameTab?.toLowerCase() === "pes" || selectedGameTab?.toLowerCase() === "efootball (pes)" || selectedGameTab?.toLowerCase() === "efootball (pes) multiplayer";

  const handleDownloadCSV = () => {
    if (!selectedGameTab || gameParticipants.length === 0) return;
    const headers = ["Name", "Batch", "Roll", "Email", "Phone", "Amount Paid", "Pay Method", "Transaction ID"];
    if (isCoc) { headers.push("CoC ID", "Town Hall Level"); }
    if (isPes) { headers.push("PES ID", "PES OVR"); }
    headers.push("Teammates");

    const rows = gameParticipants.map(p => {
      const row = [
        `"${p.name || ""}"`,
        `"${p.batch || ""}"`,
        `"${p.bsse_roll || ""}"`,
        `"${p.mail || ""}"`,
        `"${p.phone || ""}"`,
        `"${p.total_payment || 0}"`,
        `"${p.paymentMethod || ""}"`,
        `"${p.transactionId || ""}"`
      ];
      if (isCoc) { row.push(`"${p.cocPlayerId || ""}"`, `"${p.cocTownHall || ""}"`); }
      if (isPes) { row.push(`"${p.pesPlayerId || ""}"`, `"${p.pesOvr || ""}"`); }
      if (p.pesMultiplayerTeammateName) {
        row.push(`"Name: ${p.pesMultiplayerTeammateName} | ID: ${p.pesMultiplayerTeammatePlayerId} | OVR: ${p.pesMultiplayerTeammateOvr}"`);
      } else {
        row.push(`"${p.teammates && p.teammates.length > 0 ? p.teammates.join(", ") : ""}"`);
      }
      return row;
    });
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
            <div className="overflow-x-auto overflow-y-auto max-h-[60vh] border-2 border-black custom-scrollbar">
              <table className="w-full text-left font-pixelify text-foreground border-collapse relative">
                <thead className="sticky top-0 z-10 shadow-[0_2px_0_0_#000]">
                  <tr className="bg-mint text-deep-teal uppercase text-sm tracking-widest">
                    <th className="p-3 border-2 border-black whitespace-nowrap">Name</th>
                    <th className="p-3 border-2 border-black whitespace-nowrap">Batch</th>
                    <th className="p-3 border-2 border-black whitespace-nowrap">Roll</th>
                    <th className="p-3 border-2 border-black whitespace-nowrap">Email</th>
                    <th className="p-3 border-2 border-black whitespace-nowrap">Phone</th>
                    <th className="p-3 border-2 border-black whitespace-nowrap">Amount Paid</th>
                    <th className="p-3 border-2 border-black whitespace-nowrap">Pay Method</th>
                    <th className="p-3 border-2 border-black whitespace-nowrap">Txn ID</th>
                    {isCoc && (
                      <>
                        <th className="p-3 border-2 border-black whitespace-nowrap">CoC ID</th>
                        <th className="p-3 border-2 border-black whitespace-nowrap">TH Level</th>
                      </>
                    )}
                    {isPes && (
                      <>
                        <th className="p-3 border-2 border-black whitespace-nowrap">PES ID</th>
                        <th className="p-3 border-2 border-black whitespace-nowrap">OVR</th>
                      </>
                    )}
                    <th className="p-3 border-2 border-black whitespace-nowrap">Teammates</th>
                  </tr>
                </thead>
                <tbody>
                  {gameParticipants.length === 0 ? (
                    <tr>
                      <td colSpan={9 + (isCoc || isPes ? 2 : 0)} className="p-4 text-center text-mint-soft border-2 border-black">
                        No participants found for {selectedGameTab}.
                      </td>
                    </tr>
                  ) : (
                    gameParticipants.map((p, i) => (
                      <tr 
                        key={p.id} 
                        className={`${i % 2 === 0 ? "bg-background" : "bg-deep-teal/50"} cursor-pointer hover:bg-mint/20 transition-colors`}
                        onClick={() => setSelectedParticipant(p)}
                      >
                        <td className="p-3 border-2 border-black whitespace-nowrap">{p.name}</td>
                        <td className="p-3 border-2 border-black">{p.batch}</td>
                        <td className="p-3 border-2 border-black">{p.bsse_roll}</td>
                        <td className="p-3 border-2 border-black">{p.mail}</td>
                        <td className="p-3 border-2 border-black">{p.phone}</td>
                        <td className="p-3 border-2 border-black">৳ {p.total_payment || 0}</td>
                        <td className="p-3 border-2 border-black capitalize">{p.paymentMethod || "—"}</td>
                        <td className="p-3 border-2 border-black font-mono text-sm">{p.transactionId}</td>
                        {isCoc && (
                          <>
                            <td className="p-3 border-2 border-black font-mono text-sm">{p.cocPlayerId || "—"}</td>
                            <td className="p-3 border-2 border-black text-sm">{p.cocTownHall || "—"}</td>
                          </>
                        )}
                        {isPes && (
                          <>
                            <td className="p-3 border-2 border-black font-mono text-sm">{p.pesPlayerId || "—"}</td>
                            <td className="p-3 border-2 border-black text-sm">{p.pesOvr || "—"}</td>
                          </>
                        )}
                        <td className="p-3 border-2 border-black">
                          {p.pesMultiplayerTeammateName ? (
                            <div className="text-xs">
                              <span className="text-mint-soft">Name:</span> {p.pesMultiplayerTeammateName}<br/>
                              <span className="text-mint-soft">ID:</span> {p.pesMultiplayerTeammatePlayerId}<br/>
                              <span className="text-mint-soft">OVR:</span> {p.pesMultiplayerTeammateOvr}
                            </div>
                          ) : p.teammates && p.teammates.length > 0 ? p.teammates.join(", ") : "—"}
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

      {selectedParticipant && (
        <RegistrationDetailsModal
          selectedReg={selectedParticipant}
          setSelectedReg={setSelectedParticipant}
          readOnly={true}
        />
      )}
    </div>
  );
}
