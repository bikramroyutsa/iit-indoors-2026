import { useState } from "react";
import { db } from "@/utils/firebase";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";

interface RegistrationDetailsModalProps {
  selectedReg: any;
  setSelectedReg: (reg: any | null) => void;
  setRegistrations: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function RegistrationDetailsModal({ selectedReg, setSelectedReg, setRegistrations }: RegistrationDetailsModalProps) {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  if (!selectedReg) return null;

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingStatus(newStatus);
    try {
      await updateDoc(doc(db, "registrations", id), { status: newStatus });
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));

      if (newStatus === "accepted") {
        for (const gameName of (selectedReg.selectedGames || [])) {
          const gameData: any = {
            name: selectedReg.name,
            batch: selectedReg.batch,
            bsse_roll: selectedReg.bsse_roll,
            mail: selectedReg.mail,
            phone: selectedReg.phone,
            total_payment: selectedReg.total_payment || 0,
            paymentMethod: selectedReg.paymentMethod || "",
            transactionId: selectedReg.transactionId || "",
          };
          if (selectedReg.teammates && selectedReg.teammates[gameName]) {
            gameData.teammates = selectedReg.teammates[gameName];
          }
          if (gameName.toLowerCase() === "clash of clans") {
            gameData.cocPlayerId = selectedReg.cocPlayerId || "";
            gameData.cocTownHall = selectedReg.cocTownHall || "";
          }
          if (gameName.toLowerCase() === "pes") {
            gameData.pesPlayerId = selectedReg.pesPlayerId || "";
            gameData.pesOvr = selectedReg.pesOvr || "";
          }
          await addDoc(collection(db, gameName), gameData);
        }
      }

      setSelectedReg(null);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Error updating status.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-deep-teal border-8 border-black shadow-[0_0_0_4px_var(--mint),_12px_12px_0px_#000] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative">
        <button onClick={() => setSelectedReg(null)} disabled={!!updatingStatus} className="absolute top-4 right-4 text-mint hover:text-white text-2xl disabled:opacity-50 disabled:cursor-not-allowed">×</button>
        <h2 className="text-2xl font-bold text-mint tracking-widest uppercase mb-6 border-b-2 border-mint-soft pb-2">registration details</h2>
        <div className="space-y-4 font-pixelify text-foreground">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-mint-soft">Name:</span> {selectedReg.name}</div>
            <div><span className="text-mint-soft">Batch:</span> {selectedReg.batch}</div>
            <div><span className="text-mint-soft">Roll:</span> {selectedReg.bsse_roll}</div>
            <div><span className="text-mint-soft">Phone:</span> {selectedReg.phone}</div>
            <div className="col-span-2"><span className="text-mint-soft">Email:</span> {selectedReg.mail}</div>
            <div className="col-span-2"><span className="text-mint-soft">Payment Method:</span> <span className="capitalize">{selectedReg.paymentMethod || "—"}</span></div>
            <div className="col-span-2"><span className="text-mint-soft">Transaction ID:</span> {selectedReg.transactionId}</div>
            <div className="col-span-2"><span className="text-mint-soft">Total Payment:</span> ৳ {selectedReg.total_payment || 0}</div>
            {selectedReg.cocPlayerId && (
              <>
                <div><span className="text-mint-soft">CoC ID:</span> {selectedReg.cocPlayerId}</div>
                <div><span className="text-mint-soft">CoC TH Level:</span> {selectedReg.cocTownHall}</div>
              </>
            )}
            {selectedReg.pesPlayerId && (
              <>
                <div><span className="text-mint-soft">PES ID:</span> {selectedReg.pesPlayerId}</div>
                <div><span className="text-mint-soft">PES OVR:</span> {selectedReg.pesOvr}</div>
              </>
            )}
          </div>
          <div className="mt-6">
            <h3 className="text-lg text-mint uppercase border-b border-mint-soft mb-2">Selected Games</h3>
            <div className="flex flex-wrap gap-2">
              {selectedReg.selectedGames?.map((game: string, i: number) => (
                <span key={i} className="bg-background border border-mint px-2 py-1 text-sm text-mint-soft rounded">{game}</span>
              ))}
            </div>
          </div>
          {selectedReg.teammates && Object.keys(selectedReg.teammates).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg text-mint uppercase border-b border-mint-soft mb-2">Teammates</h3>
              {Object.entries(selectedReg.teammates).map(([gameName, mates]: [string, any]) => (
                <div key={gameName} className="mb-2">
                  <div className="text-mint-soft text-sm mb-1">{gameName}:</div>
                  <div className="pl-4">
                    {Array.isArray(mates) ? mates.map((mate, i) => (<div key={i}>- {mate || "TBD"}</div>)) : "None"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-4 mt-8 pt-4 border-t-2 border-mint-soft">
          {selectedReg.status !== "accepted" && (
            <button onClick={() => handleUpdateStatus(selectedReg.id, "accepted")} disabled={!!updatingStatus} className="pixel-button w-full bg-mint text-deep-teal hover:bg-mint-soft disabled:opacity-50 disabled:cursor-not-allowed">
              {updatingStatus === "accepted" ? "accepting..." : "accept"}
            </button>
          )}
          {selectedReg.status !== "rejected" && (
            <button onClick={() => handleUpdateStatus(selectedReg.id, "rejected")} disabled={!!updatingStatus} className="pixel-button w-full !bg-red-500 !border-black !text-white hover:!bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed" style={{ boxShadow: '0 -6px 0 -2px #f87171, 0 6px 0 -2px #f87171, -6px 0 0 -2px #f87171, 6px 0 0 -2px #f87171, 6px 6px 0px #000' }}>
              {updatingStatus === "rejected" ? "rejecting..." : "reject"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
