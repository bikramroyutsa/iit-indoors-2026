"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/utils/firebase";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, collection, query, getDocs } from "firebase/firestore";

import LoginForm from "./LoginForm";
import GamesTab from "./GamesTab";
import RegistrationDetailsModal from "./RegistrationDetailsModal";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin Dashboard State
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "accepted" | "rejected" | "games">("pending");
  const [selectedReg, setSelectedReg] = useState<any | null>(null);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

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
    await signOut(auth);
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

  return (
    <div className="min-h-screen bg-background p-8 relative overflow-hidden text-foreground">
      <div className="absolute inset-0 pixel-pattern opacity-10 pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b-4 border-mint pb-4">
          <h1 className="text-4xl font-bold text-mint tracking-widest uppercase">
            admin dashboard
          </h1>
          <button onClick={handleLogout} className="pixel-button !py-2 !px-4 text-sm">
            logout
          </button>
        </div>
        
        <div className="bg-deep-teal border-4 border-black p-6 shadow-[8px_8px_0px_#000] mb-8">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex flex-wrap gap-4">
              <button className={`pixel-button !py-2 transition-all ${activeTab === 'pending' ? '!bg-white !text-black !shadow-[6px_6px_0px_rgba(255,255,255,0.3)] scale-105' : '!bg-deep-teal !text-mint opacity-60 hover:opacity-100'}`} onClick={() => setActiveTab("pending")}>pending</button>
              <button className={`pixel-button !py-2 transition-all ${activeTab === 'accepted' ? '!bg-white !text-black !shadow-[6px_6px_0px_rgba(255,255,255,0.3)] scale-105' : '!bg-deep-teal !text-mint opacity-60 hover:opacity-100'}`} onClick={() => setActiveTab("accepted")}>accepted</button>
              <button className={`pixel-button !py-2 transition-all ${activeTab === 'rejected' ? '!bg-white !text-black !shadow-[6px_6px_0px_rgba(255,255,255,0.3)] scale-105' : '!bg-deep-teal !text-mint opacity-60 hover:opacity-100'}`} onClick={() => setActiveTab("rejected")}>rejected</button>
              <button className={`pixel-button !py-2 transition-all ${activeTab === 'games' ? '!bg-white !text-black !shadow-[6px_6px_0px_rgba(255,255,255,0.3)] scale-105' : '!bg-deep-teal !text-mint opacity-60 hover:opacity-100'}`} onClick={() => setActiveTab("games")}>games</button>
            </div>
            {activeTab !== "games" && (
              <button 
                onClick={fetchRegistrations}
                disabled={loadingRegistrations}
                className={`pixel-button !py-2 !px-4 text-sm ${loadingRegistrations ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              >
                {loadingRegistrations ? "refreshing..." : "refresh"}
              </button>
            )}
          </div>

          {activeTab === "games" ? (
            <GamesTab />
          ) : loadingRegistrations ? (
            <div className="py-12 text-center text-mint font-pixelify animate-pulse text-xl">
              loading registrations...
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
    </div>
  );
}
