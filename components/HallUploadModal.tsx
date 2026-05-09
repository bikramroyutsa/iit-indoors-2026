"use client";

import React, { useState, useRef } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/utils/firebase";
import Portal from "./Portal";

interface HallUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (id: string) => void;
}

export default function HallUploadModal({ isOpen, onClose, onSuccess }: HallUploadModalProps) {
  const [formData, setFormData] = useState({ name: '', roll: '', caption: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("photo is too large! please keep it under 5MB.");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formData.name || !formData.roll) return;

    setIsSubmitting(true);
    try {
      // 1. Upload to Storage
      const storagePath = `hall_photos/${Date.now()}_${selectedFile.name}`;
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 2. Save to Firestore
      const docRef = await addDoc(collection(db, "hall_photos"), {
        ...formData,
        url: downloadURL,
        storagePath: storagePath,
        timestamp: serverTimestamp()
      });

      setIsSubmitted(true);
      setTimeout(() => {
        onSuccess(docRef.id);
        resetForm();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Upload failed", err);
      alert("failed to snap photo. try again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', roll: '', caption: '' });
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsSubmitted(false);
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pixel-modal-overlay p-4 animate-fade-in">
        <div className="pixel-modal-content animate-modal-slide-up max-h-[90vh] w-[min(92vw,500px)] overflow-y-auto custom-scrollbar relative">
          <button
            onClick={() => !isSubmitting && onClose()}
            className="absolute top-4 right-4 z-20 text-mint-soft hover:text-mint transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="text-6xl mb-6 animate-pasting-slap">📸</div>
              <h2 className="text-2xl font-bold text-mint tracking-widest text-center mb-2 uppercase font-pixelify">
                snapped!
              </h2>
              <p className="text-mint-soft text-center font-pixelify">
                your moment is now in the hall.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-8 text-mint tracking-widest text-center uppercase font-pixelify">
                snap a moment
              </h2>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-square max-w-[200px] border-4 border-dashed border-mint-soft rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-mint transition-colors relative overflow-hidden bg-black/20"
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <span className="text-4xl mb-2 block">📷</span>
                        <span className="text-xs font-pixelify text-mint-soft">pick a photo</span>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="space-y-2">
                  <label className="pixel-label">name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="your name"
                    className="pixel-input font-pixelify"
                  />
                </div>

                <div className="space-y-2">
                  <label className="pixel-label">bsse roll</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={formData.roll}
                    onChange={e => setFormData({ ...formData, roll: e.target.value })}
                    placeholder="e.g. 1501"
                    className="pixel-input font-pixelify"
                  />
                </div>

                <div className="space-y-2">
                  <label className="pixel-label">caption (optional)</label>
                  <input
                    type="text"
                    value={formData.caption}
                    onChange={e => setFormData({ ...formData, caption: e.target.value })}
                    placeholder="describe the moment..."
                    className="pixel-input font-pixelify"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !selectedFile}
                  className="pixel-button mt-4 w-full disabled:opacity-50"
                >
                  {isSubmitting ? 'uploading...' : 'snap it!'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </Portal>
  );
}
