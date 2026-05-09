"use client";

import { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { collection, getDocs, doc, deleteDoc, query, orderBy, onSnapshot } from "firebase/firestore";

interface Experience {
  id: string;
  name: string;
  roll: string;
  batch: string;
  experience: string;
  timestamp: any;
}

export default function WallTab() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "wall_experiences"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
      setExperiences(data);
      setLoading(false);
    }, (err) => {
      console.error("Fetch failed", err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}'s experience from the wall?`)) return;
    
    try {
      await deleteDoc(doc(db, "wall_experiences", id));
      alert("Removed successfully.");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to remove.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-mint animate-pulse font-pixelify">Loading wall experiences...</div>;
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center border-b-2 border-mint/30 pb-4 shrink-0">
        <h2 className="text-xl text-mint font-pixelify uppercase tracking-widest">The Wallz Management</h2>
        <span className="text-mint-soft text-xs">{experiences.length} experiences total</span>
      </div>

      <div className="flex-1 overflow-auto border-2 border-black custom-scrollbar">
        <table className="w-full text-left font-pixelify text-foreground border-collapse relative">
          <thead className="sticky top-0 z-10 shadow-[0_2px_0_0_#000]">
            <tr className="bg-mint text-deep-teal uppercase text-sm tracking-widest">
              <th className="p-3 border-2 border-black whitespace-nowrap">Name</th>
              <th className="p-3 border-2 border-black whitespace-nowrap">Roll/Batch</th>
              <th className="p-3 border-2 border-black">Experience</th>
              <th className="p-3 border-2 border-black w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {experiences.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-mint-soft border-2 border-black">
                  No experiences found on the wall.
                </td>
              </tr>
            ) : (
              experiences.map((exp, i) => (
                <tr key={exp.id} className={`${i % 2 === 0 ? "bg-background" : "bg-deep-teal/50"}`}>
                  <td className="p-3 border-2 border-black whitespace-nowrap">{exp.name}</td>
                  <td className="p-3 border-2 border-black whitespace-nowrap">
                    {exp.roll} <br/> <span className="text-mint-soft text-[10px] uppercase">[{exp.batch}]</span>
                  </td>
                  <td className="p-3 border-2 border-black text-sm italic">"{exp.experience}"</td>
                  <td className="p-3 border-2 border-black text-center">
                    <button 
                      onClick={() => handleDelete(exp.id, exp.name)}
                      className="pixel-button !py-1 !px-3 !bg-red-600 !text-white text-[10px]"
                    >
                      remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
