"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/utils/firebase";
import { collection, doc, deleteDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import HallUploadModal from "@/components/HallUploadModal";

interface HallPhoto {
  id: string;
  url: string;
  storagePath: string;
  name: string;
  roll: string;
  caption: string;
  timestamp: any;
}

export default function HallTab() {
  const [photos, setPhotos] = useState<HallPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "hall_photos"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HallPhoto));
      setPhotos(data);
      setLoading(false);
    }, (err) => {
      console.error("Fetch failed", err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (photo: HallPhoto) => {
    if (!confirm(`Are you sure you want to remove ${photo.name}'s photo from the hall?`)) return;
    
    try {
      // 1. Delete from Firestore
      await deleteDoc(doc(db, "hall_photos", photo.id));
      
      // 2. Delete from Storage
      if (photo.storagePath) {
        const storageRef = ref(storage, photo.storagePath);
        await deleteObject(storageRef);
      }
      
      alert("Photo removed successfully.");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to remove photo.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-mint animate-pulse font-pixelify">Loading hall gallery...</div>;
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center border-b-2 border-mint/30 pb-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl text-mint font-pixelify uppercase tracking-widest">The Hallz Management</h2>
          <span className="text-mint-soft text-xs">{photos.length} photos total</span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="pixel-button !py-2 !px-4 !bg-mint !text-deep-teal text-xs"
        >
          snap a photo
        </button>
      </div>

      <div className="flex-1 overflow-auto border-2 border-black custom-scrollbar">
        {/* ... table content remains ... */}
        <table className="w-full text-left font-pixelify text-foreground border-collapse relative">
          <thead className="sticky top-0 z-10 shadow-[0_2px_0_0_#000]">
            <tr className="bg-mint text-deep-teal uppercase text-sm tracking-widest">
              <th className="p-3 border-2 border-black whitespace-nowrap">Preview</th>
              <th className="p-3 border-2 border-black whitespace-nowrap">Name/Roll</th>
              <th className="p-3 border-2 border-black">Caption</th>
              <th className="p-3 border-2 border-black w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {photos.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-mint-soft border-2 border-black">
                  No photos found in the hall.
                </td>
              </tr>
            ) : (
              photos.map((photo, i) => (
                <tr key={photo.id} className={`${i % 2 === 0 ? "bg-background" : "bg-deep-teal/50"}`}>
                  <td className="p-3 border-2 border-black">
                    <img src={photo.url} alt="preview" className="w-20 h-20 object-cover border-2 border-black" />
                  </td>
                  <td className="p-3 border-2 border-black whitespace-nowrap">
                    {photo.name} <br/> <span className="text-mint-soft text-[10px] uppercase">[{photo.roll}]</span>
                  </td>
                  <td className="p-3 border-2 border-black text-sm italic">"{photo.caption || "No caption"}"</td>
                  <td className="p-3 border-2 border-black text-center">
                    <button 
                      onClick={() => handleDelete(photo)}
                      className="pixel-button !py-1 !px-3 !bg-red-600 !text-white text-[10px]"
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <HallUploadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
      />
    </div>
  );
}
