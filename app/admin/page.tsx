"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/utils/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, collection, query, getDocs, updateDoc } from "firebase/firestore";

export const adminLogin = async (email: string, password: string) => {
  try {
    // 1. Authenticate with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Attempt to read the whitelist document
    try {
      const adminDocRef = doc(db, "authorized_users", user.uid);
      const adminDoc = await getDoc(adminDocRef);

      // If this line executes, the Security Rules ALLOWED the read (User is Admin)
      if (adminDoc.exists() && adminDoc.data().role === 'admin') {
        return { user, role: 'admin' };
      }
    } catch (firestoreError: any) {
      // 3. If Firestore throws "permission-denied", the rules BLOCKED the read
      if (firestoreError.code === 'permission-denied') {
        await signOut(auth);
        throw new Error("Access Denied: You are not on the authorized list.");
      }
      throw firestoreError;
    }

    // Fallback for authenticated users who aren't in the collection
    await signOut(auth);
    throw new Error("Unauthorized.");

  } catch (error: any) {
    console.error("Login failed:", error.message);
    throw error;
  }
};

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Admin Dashboard State
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "accepted" | "rejected">("pending");
  const [selectedReg, setSelectedReg] = useState<any | null>(null);

  const fetchRegistrations = async () => {
    try {
      const q = query(collection(db, "registrations"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegistrations(data);
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Verify admin status on load
        try {
          const adminDocRef = doc(db, "authorized_users", currentUser.uid);
          const adminDoc = await getDoc(adminDocRef);
          if (adminDoc.exists() && adminDoc.data().role === 'admin') {
            setUser(currentUser);
            setIsAdmin(true);
            fetchRegistrations(); // Fetch data once authenticated
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoggingIn(true);
    try {
      await adminLogin(email, password);
      // The onAuthStateChanged listener will pick up the successful login and verify admin
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else {
        setError(err.message || "Failed to login");
      }
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "registrations", id), { status: newStatus });
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      setSelectedReg(null); // Close modal
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Error updating status.");
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
        {/* Pixel background */}
        <div className="absolute inset-0 pixel-pattern opacity-20 pointer-events-none" />
        
        <div className="z-10 w-full max-w-md bg-deep-teal border-8 border-black shadow-[0_0_0_4px_var(--mint),_12px_12px_0px_#000] p-8">
          <h1 className="text-3xl font-bold text-mint text-center tracking-widest mb-6 uppercase">
            admin terminal
          </h1>
          
          {error && (
            <div className="bg-red-900/50 border-2 border-red-500 text-red-200 p-3 mb-6 text-sm font-pixelify text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-6 text-left">
            <div className="space-y-2">
              <label className="pixel-label">email</label>
              <input
                type="email"
                className="pixel-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="pixel-label">password</label>
              <input
                type="password"
                className="pixel-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="pixel-button mt-4"
              disabled={loggingIn}
            >
              {loggingIn ? "authenticating..." : "login"}
            </button>
          </form>
        </div>
      </div>
    );
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
          <div className="flex gap-4 mb-6">
            <button 
              className={`pixel-button !py-2 transition-all ${activeTab === 'pending' ? '!bg-white !text-black !shadow-[6px_6px_0px_rgba(255,255,255,0.3)] scale-105' : '!bg-deep-teal !text-mint opacity-60 hover:opacity-100'}`}
              onClick={() => setActiveTab("pending")}
            >
              pending
            </button>
            <button 
              className={`pixel-button !py-2 transition-all ${activeTab === 'accepted' ? '!bg-white !text-black !shadow-[6px_6px_0px_rgba(255,255,255,0.3)] scale-105' : '!bg-deep-teal !text-mint opacity-60 hover:opacity-100'}`}
              onClick={() => setActiveTab("accepted")}
            >
              accepted
            </button>
            <button 
              className={`pixel-button !py-2 transition-all ${activeTab === 'rejected' ? '!bg-white !text-black !shadow-[6px_6px_0px_rgba(255,255,255,0.3)] scale-105' : '!bg-deep-teal !text-mint opacity-60 hover:opacity-100'}`}
              onClick={() => setActiveTab("rejected")}
            >
              rejected
            </button>
          </div>

          <div className="space-y-4">
            {filteredRegistrations.length === 0 ? (
              <p className="text-mint-soft font-pixelify">No registrations found in this category.</p>
            ) : (
              filteredRegistrations.map(reg => (
                <div 
                  key={reg.id} 
                  onClick={() => setSelectedReg(reg)}
                  className="bg-background border-2 border-mint-soft p-4 cursor-pointer hover:bg-opacity-80 transition-all flex flex-wrap gap-4 items-center justify-between"
                >
                  <div className="flex flex-wrap gap-4 items-center font-pixelify text-mint">
                    <span className="font-bold text-lg">{reg.name}</span>
                    <span className="bg-mint text-deep-teal px-2 py-1 text-xs font-bold rounded">Batch {reg.batch}</span>
                    <span>{reg.phone}</span>
                  </div>
                  <div className="text-sm text-mint-soft">
                    {reg.selectedGames?.length || 0} games
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Registration Details Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-deep-teal border-8 border-black shadow-[0_0_0_4px_var(--mint),_12px_12px_0px_#000] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative">
            <button 
              onClick={() => setSelectedReg(null)}
              className="absolute top-4 right-4 text-mint hover:text-white text-2xl"
            >
              ×
            </button>
            
            <h2 className="text-2xl font-bold text-mint tracking-widest uppercase mb-6 border-b-2 border-mint-soft pb-2">
              registration details
            </h2>

            <div className="space-y-4 font-pixelify text-foreground">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-mint-soft">Name:</span> {selectedReg.name}</div>
                <div><span className="text-mint-soft">Batch:</span> {selectedReg.batch}</div>
                <div><span className="text-mint-soft">Roll:</span> {selectedReg.bsse_roll}</div>
                <div><span className="text-mint-soft">Phone:</span> {selectedReg.phone}</div>
                <div className="col-span-2"><span className="text-mint-soft">Email:</span> {selectedReg.mail}</div>
                <div className="col-span-2"><span className="text-mint-soft">Transaction ID:</span> {selectedReg.transactionId}</div>
                <div className="col-span-2"><span className="text-mint-soft">Total Payment:</span> ৳ {selectedReg.total_payment || 0}</div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg text-mint uppercase border-b border-mint-soft mb-2">Selected Games</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedReg.selectedGames?.map((game: string, i: number) => (
                    <span key={i} className="bg-background border border-mint px-2 py-1 text-sm text-mint-soft rounded">
                      {game}
                    </span>
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
                        {Array.isArray(mates) ? mates.map((mate, i) => (
                          <div key={i}>- {mate || "TBD"}</div>
                        )) : "None"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8 pt-4 border-t-2 border-mint-soft">
              {selectedReg.status !== "accepted" && (
                <button 
                  onClick={() => handleUpdateStatus(selectedReg.id, "accepted")}
                  className="pixel-button w-full bg-mint text-deep-teal hover:bg-mint-soft"
                >
                  accept
                </button>
              )}
              {selectedReg.status !== "rejected" && (
                <button 
                  onClick={() => handleUpdateStatus(selectedReg.id, "rejected")}
                  className="pixel-button w-full !bg-red-500 !border-black !text-white hover:!bg-red-400"
                  style={{ boxShadow: '0 -6px 0 -2px #f87171, 0 6px 0 -2px #f87171, -6px 0 0 -2px #f87171, 6px 0 0 -2px #f87171, 6px 6px 0px #000' }}
                >
                  reject
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
