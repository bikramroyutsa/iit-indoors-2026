"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/utils/firebase";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, collection, query, getDocs, deleteDoc } from "firebase/firestore";

import LoginForm from "./LoginForm";
import GamesTab from "./GamesTab";
import RegistrationDetailsModal from "./RegistrationDetailsModal";
import CustomizerTab from "./CustomizerTab";
import ResultsTab from "./ResultsTab";
import WallTab from "./WallTab";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin Dashboard State
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "accepted" | "rejected" | "games" | "customizer" | "results" | "wall">("pending");
  const [selectedReg, setSelectedReg] = useState<any | null>(null);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchRegistrations = async () => {
    setLoadingRegistrations(true);
    try {
      const q = query(collection(db, "registrations"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegistrations(data);
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const handleMasterDelete = async () => {
    const password = window.prompt("Enter Master Password to delete ALL registrations:");
    if (!password) return;

    // Hashing helper
    const hashInput = async (str: string) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
    };

    const inputHash = await hashInput(password);
    const masterHash = "cc147b3d7875ea11bc202d9515c37260c828a76b9d79a327f143410b10814814";

    if (inputHash !== masterHash) {
      alert("Incorrect password!");
      return;
    }


    if (!window.confirm("CRITICAL WARNING: This will permanently delete ALL registrations. Are you absolutely sure?")) return;

    setLoadingRegistrations(true);
    try {
      const q = query(collection(db, "registrations"));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(docSnap => deleteDoc(doc(db, "registrations", docSnap.id)));
      await Promise.all(deletePromises);
      setRegistrations([]);
      alert("All registrations deleted successfully.");
    } catch (err) {
      console.error("Master delete failed", err);
      alert("Error during master delete.");
    } finally {
      setLoadingRegistrations(false);
    }
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const adminDocRef = doc(db, "authorized_users", currentUser.uid);
          const adminDoc = await getDoc(adminDocRef);
          if (adminDoc.exists() && adminDoc.data().role === 'admin') {
            setUser(currentUser);
            setIsAdmin(true);
            fetchRegistrations();
          } else {
            await signOut(auth);
            setUser(null);
            setIsAdmin(false);
          }
        } catch (err) {
          await signOut(auth);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-mint font-pixelify">
        authenticating...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <LoginForm />;
  }

  const filteredRegistrations = registrations.filter(r => r.status === activeTab || (!r.status && activeTab === "pending"));

  const handleDownloadAcceptedCSV = () => {
    if (filteredRegistrations.length === 0) return;
    const headers = ["Name", "Batch", "Roll", "Email", "Phone", "Amount Paid", "Pay Method", "Transaction ID", "Selected Games", "Teammates"];
    
    const rows = filteredRegistrations.map(reg => {
      const selectedGamesStr = reg.selectedGames?.join("; ") || "";
      let teammatesStr = "";
      if (reg.teammates && Object.keys(reg.teammates).length > 0) {
        teammatesStr = Object.entries(reg.teammates).map(([game, mates]: [string, any]) => {
          return `${game}: ${Array.isArray(mates) ? mates.filter(m => m).join("; ") : ""}`;
        }).join(" | ");
      }

      return [
        `"${reg.name || ""}"`,
        `"${reg.batch || ""}"`,
        `"${reg.bsse_roll || ""}"`,
        `"${reg.mail || ""}"`,
        `"${reg.phone || ""}"`,
        `"${reg.total_payment || 0}"`,
        `"${reg.paymentMethod || ""}"`,
        `"${reg.transactionId || ""}"`,
        `"${selectedGamesStr}"`,
        `"${teammatesStr}"`
      ];
    });

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `accepted_registrations.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen bg-background p-4 md:p-8 pb-20 md:pb-0 relative overflow-hidden text-foreground flex flex-col">
      <div className="absolute inset-0 pixel-pattern opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-6xl w-full mx-auto flex-1 flex flex-col min-h-0">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6 border-b-4 border-mint pb-2 md:pb-4 gap-2 md:gap-4 shrink-0">
          <h1 className="text-xl md:text-4xl font-bold text-mint tracking-widest uppercase text-center sm:text-left">
            admin dashboard
          </h1>
          <button onClick={handleLogout} disabled={isLoggingOut} className="pixel-button !py-1 md:!py-2 !px-4 text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto">
            {isLoggingOut ? "logging out..." : "logout"}
          </button>
        </div>

        <div className="bg-deep-teal border-4 border-black p-3 md:p-6 shadow-[4px_4px_0px_#000] md:shadow-[8px_8px_0px_#000] mb-4 md:mb-8 flex-1 flex flex-col min-h-0">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-4 md:mb-6 gap-4 shrink-0">
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 md:gap-4">
              <button className={`pixel-button !py-2 !px-3 text-[10px] md:text-sm transition-all ${activeTab === 'pending' ? '!bg-white !text-black !shadow-[4px_4px_0px_rgba(255,255,255,0.3)] scale-105' : '!bg-deep-teal !text-mint opacity-60 hover:opacity-100'}`} onClick={() => setActiveTab("pending")}>pending</button>
              <button className={`pixel-button !py-2 !px-3 text-[10px] md:text-sm transition-all ${activeTab === 'accepted' ? '!bg-white !text-black !shadow-[4px_4px_0px_rgba(255,255,255,0.3)] scale-105' : '!bg-deep-teal !text-mint opacity-60 hover:opacity-100'}`} onClick={() => setActiveTab("accepted")}>accepted</button>
              <button className={`pixel-button !py-2 !px-3 text-[10px] md:text-sm transition-all ${activeTab === 'rejected' ? '!bg-white !text-black !shadow-[4px_4px_0px_rgba(255,255,255,0.3)] scale-105' : '!bg-deep-teal !text-mint opacity-60 hover:opacity-100'}`} onClick={() => setActiveTab("rejected")}>rejected</button>
              <button className={`pixel-button !py-2 !px-3 text-[10px] md:text-sm transition-all ${activeTab === 'games' ? '!bg-white !text-black !shadow-[4px_4px_0px_rgba(255,255,255,0.3)] scale-105' : '!bg-deep-teal !text-mint opacity-60 hover:opacity-100'}`} onClick={() => setActiveTab("games")}>games</button>
              <button className={`pixel-button !py-2 !px-3 text-[10px] md:text-sm transition-all ${activeTab === 'customizer' ? '!bg-white !text-black !shadow-[4px_4px_0px_rgba(255,255,255,0.3)] scale-105' : '!bg-deep-teal !text-mint opacity-60 hover:opacity-100'}`} onClick={() => setActiveTab("customizer")}>customizer</button>
              <button className={`pixel-button !py-2 !px-3 text-[10px] md:text-sm transition-all ${activeTab === 'results' ? '!bg-white !text-black !shadow-[4px_4px_0px_rgba(255,255,255,0.3)] scale-105' : '!bg-deep-teal !text-mint opacity-60 hover:opacity-100'}`} onClick={() => setActiveTab("results")}>results</button>
              <button className={`pixel-button !py-2 !px-3 text-[10px] md:text-sm transition-all ${activeTab === 'wall' ? '!bg-white !text-black !shadow-[4px_4px_0px_rgba(255,255,255,0.3)] scale-105' : '!bg-deep-teal !text-mint opacity-60 hover:opacity-100'}`} onClick={() => setActiveTab("wall")}>the wallz</button>
            </div>

            {activeTab !== "games" && (
              <div className="flex gap-2">
                <button
                  onClick={fetchRegistrations}
                  disabled={loadingRegistrations}
                  className={`pixel-button !py-2 !px-4 text-[10px] md:text-sm ${loadingRegistrations ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                  {loadingRegistrations ? "refreshing..." : "refresh"}
                </button>
                {activeTab === "accepted" && (
                  <button
                    onClick={handleDownloadAcceptedCSV}
                    disabled={filteredRegistrations.length === 0}
                    className={`pixel-button !py-2 !px-4 text-[10px] md:text-sm ${filteredRegistrations.length === 0 ? 'opacity-50 cursor-not-allowed' : '!bg-white !text-black shadow-[4px_4px_0px_#000] hover:scale-105'}`}
                  >
                    download csv
                  </button>
                )}
              </div>
            )}
          </div>

          {activeTab === "games" ? (
            <div className="flex-1 overflow-auto custom-scrollbar">
              <GamesTab />
            </div>
          ) : activeTab === "customizer" ? (
            <div className="flex-1 overflow-auto custom-scrollbar">
              <CustomizerTab />
            </div>
          ) : activeTab === "results" ? (
            <div className="flex-1 overflow-auto custom-scrollbar">
              <ResultsTab />
            </div>
          ) : activeTab === "wall" ? (
            <div className="flex-1 overflow-auto custom-scrollbar">
              <WallTab />
            </div>
          ) : loadingRegistrations ? (
            <div className="flex-1 flex items-center justify-center text-mint font-pixelify animate-pulse text-xl">
              loading registrations...
            </div>
          ) : (
            <div className="flex-1 overflow-auto border-2 border-black custom-scrollbar">

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
                    <th className="p-3 border-2 border-black whitespace-nowrap">Selected Games</th>
                    <th className="p-3 border-2 border-black whitespace-nowrap">Teammates</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-4 text-center text-mint-soft border-2 border-black">
                        No {activeTab} registrations found.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg, i) => (
                      <tr
                        key={reg.id}
                        onClick={() => setSelectedReg(reg)}
                        className={`cursor-pointer hover:bg-opacity-80 transition-all ${i % 2 === 0 ? "bg-background" : "bg-deep-teal/50"}`}
                      >
                        <td className="p-3 border-2 border-black whitespace-nowrap">{reg.name}</td>
                        <td className="p-3 border-2 border-black">{reg.batch}</td>
                        <td className="p-3 border-2 border-black">{reg.bsse_roll}</td>
                        <td className="p-3 border-2 border-black">{reg.mail}</td>
                        <td className="p-3 border-2 border-black">{reg.phone}</td>
                        <td className="p-3 border-2 border-black whitespace-nowrap">৳ {reg.total_payment || 0}</td>
                        <td className="p-3 border-2 border-black capitalize">{reg.paymentMethod || "—"}</td>
                        <td className="p-3 border-2 border-black font-mono text-sm">{reg.transactionId}</td>
                        <td className="p-3 border-2 border-black">
                          {reg.selectedGames?.join(", ") || "—"}
                        </td>
                        <td className="p-3 border-2 border-black text-xs">
                          {reg.teammates && Object.keys(reg.teammates).length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {Object.entries(reg.teammates).map(([game, mates]: [string, any]) => (
                                <div key={game}>
                                  <span className="text-mint-soft">{game}:</span> {Array.isArray(mates) ? mates.filter(m => m).join(", ") || "—" : "—"}
                                </div>
                              ))}
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <RegistrationDetailsModal selectedReg={selectedReg} setSelectedReg={setSelectedReg} setRegistrations={setRegistrations} />

      {/* Master Delete Button at Bottom Right for Safety */}
      <div className="fixed bottom-4 pb-2 right-4 z-[50]">
        <button
          onClick={handleMasterDelete}
          disabled={loadingRegistrations}
          className={`pixel-button !py-1 !px-3 !text-[10px] !bg-red-600 !text-white opacity-20 hover:opacity-100 transition-opacity uppercase tracking-tighter ${loadingRegistrations ? 'opacity-10 cursor-not-allowed' : ''}`}
        >
          master delete
        </button>
      </div>
    </div>
  );
}
