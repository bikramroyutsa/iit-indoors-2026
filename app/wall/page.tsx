"use client";

import React, { useState, useEffect } from 'react';
import { db } from '../../utils/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, onSnapshot } from 'firebase/firestore';
import AudioToggle from '../../components/AudioToggle';
import QuickNav from '@/components/QuickNav';
import Portal from '../../components/Portal';
import { useSound } from '../../hooks/useSound';

interface Experience {
  id: string;
  name: string;
  roll: string;
  batch: string;
  experience: string;
  timestamp: any;
}

export default function WallPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', roll: '', experience: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [columnCount, setColumnCount] = useState(3);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);
  const { playSuccessChime, playPaste } = useSound();
  const wallContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, "wall_experiences"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
      setExperiences(data);
    });
    return () => unsubscribe();
  }, []);

  // Handle auto-scroll and highlight for new submissions
  useEffect(() => {
    if (lastSubmittedId && experiences.some(exp => exp.id === lastSubmittedId)) {
      setTimeout(() => {
        const element = document.getElementById(`note-${lastSubmittedId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Clear ID after highlight animation finishes (2s)
          setTimeout(() => setLastSubmittedId(null), 2000);
        }
      }, 300); // Wait for DOM rendering
    }
  }, [experiences, lastSubmittedId]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setColumnCount(1);
      else if (window.innerWidth < 1024) setColumnCount(2);
      else setColumnCount(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen && !isSubmitting) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.roll || !formData.experience) return;

    setIsSubmitting(true);
    try {
      const batch = formData.roll.substring(0, 2);
      const docRef = await addDoc(collection(db, "wall_experiences"), {
        ...formData,
        batch: `bsse${batch}`,
        timestamp: serverTimestamp()
      });
      setFormData({ name: '', roll: '', experience: '' });
      setIsSubmitted(true);
      setLastSubmittedId(docRef.id);
      playPaste();
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSubmitted(false);
      }, 1000);
    } catch (err) {
      console.error("Submission failed", err);
      alert("failed to paste experience.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStickyColor = (id: string) => {
    const colors = [
      '#fff59d', // Yellow
      '#f48fb1', // Pink
      '#81d4fa', // Blue
      '#a5d6a7', // Green
      '#ffcc80', // Orange
      '#ce93d8', // Purple
    ];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getAsymmetricStyle = (id: string, index: number) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Use index to GUARANTEE alternating directions if hashing feels biased
    const baseRotation = (hash % 8) + 1; // 1 to 8 degrees
    const rotation = index % 2 === 0 ? baseRotation : -baseRotation;

    const skewX = (hash % 9) - 4;     // -4 to 4
    const skewY = (hash % 7) - 3;     // -3 to 3
    const translateX = (hash % 21) - 10; // -10 to 10px
    const translateY = (hash % 21) - 10; // -10 to 10px

    // High variability widths for desktop (thin to wide)
    // On mobile, keep width consistent to avoid overflow clipping
    const widths = columnCount > 1 ? ['65%', '80%', '95%', '100%', '115%', '125%'] : ['100%'];
    const width = widths[hash % widths.length];

    return {
      transform: `rotate(${rotation}deg) skew(${skewX}deg, ${skewY}deg) translate(${translateX}px, ${translateY}px)`,
      backgroundColor: getStickyColor(id),
      width: width,
      maxWidth: columnCount === 1 ? '92%' : 'none',
      alignSelf: 'center',
      padding: (hash % 2 === 0) ? '1.5rem' : '2rem 1.5rem',
      "--tape-rotate": `${(hash % 20) - 10}deg`,
      "--tape-left": `${(hash % 30) + 35}%`
    } as React.CSSProperties;
  };

  return (
    <main className="wall-container custom-scrollbar">
      {/* Background: Pixelated Brick Wall */}
      <div className="brick-wall" />

      <div className="wall-content">
        <header className="wall-header">
          <h1 className="pixel-title">the wallz</h1>
          <p className="wall-subtitle font-pixelify">share your experience & thoughts about IIT Indoors '26</p>
          <button onClick={() => setIsModalOpen(true)} className="pixel-button paste-button">
            paste your note...
          </button>
        </header>

        <div className="experiences-grid">
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <div key={colIndex} className="wall-column">
              {experiences
                .map((exp, originalIdx) => ({ exp, originalIdx }))
                .filter(({ originalIdx }) => originalIdx % columnCount === colIndex)
                .map(({ exp, originalIdx }) => (
                  <div
                    key={exp.id}
                    id={`note-${exp.id}`}
                    className={`paper-note ${lastSubmittedId === exp.id ? 'highlight-new-note' : ''}`}
                    style={getAsymmetricStyle(exp.id, originalIdx)}
                  >
                    <div className="note-content font-pixelify">
                      <p className="exp-text">"{exp.experience}"</p>
                      <div className="exp-signature">
                        — {exp.name.toLowerCase()} <span className="batch">[{exp.batch}]</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center pixel-modal-overlay p-4 animate-fade-in">
            <div className="pixel-modal-content animate-modal-slide-up max-h-[90vh] w-[min(92vw,500px)] overflow-y-auto custom-scrollbar relative">
              <button
                onClick={() => !isSubmitting && setIsModalOpen(false)}
                disabled={isSubmitting}
                className="absolute top-4 right-4 z-20 text-mint-soft hover:text-mint flex flex-col items-center transition-colors disabled:opacity-50"
              >
                <span className="text-2xl leading-none">×</span>
                <span className="text-[10px] font-pixelify leading-none mt-1">esc</span>
              </button>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="text-6xl mb-6 animate-pasting-slap">📝</div>
                  <h2 className="text-2xl font-bold text-mint tracking-widest text-center mb-2 uppercase font-pixelify">
                    pasted!
                  </h2>
                  <p className="text-mint-soft text-center font-pixelify">
                    your note is now on the wall forever.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-8 text-mint tracking-widest text-center uppercase">
                    leave a mark
                  </h2>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                      <label className="pixel-label">your experience</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.experience}
                        onChange={e => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="tell us your thoughts..."
                        className="pixel-input font-pixelify"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="pixel-button mt-4 w-full"
                    >
                      {isSubmitting ? 'pasting...' : 'paste it!'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </Portal>
      )}

      <AudioToggle />
      <QuickNav />

      <style jsx>{`
        .wall-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          background-color: #5d1a1a;
          overflow-x: hidden;
          overflow-y: auto;
        }

        @keyframes pasting-slap {
          0% { transform: scale(3) rotate(-30deg); opacity: 0; filter: blur(10px); }
          50% { transform: scale(0.8) rotate(10deg); opacity: 1; filter: blur(0); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .brick-wall {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(335deg, #742a2a 23px, transparent 23px),
            linear-gradient(155deg, #8b3434 23px, transparent 23px),
            linear-gradient(335deg, #742a2a 23px, transparent 23px),
            linear-gradient(155deg, #8b3434 23px, transparent 23px);
          background-size: 58px 58px;
          background-position: 0px 2px, 4px 35px, 29px 31px, 34px 6px;
          opacity: 0.3;
          pointer-events: none;
          z-index: 0;
        }

        .brick-wall::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.2;
          mix-blend-mode: multiply;
          pointer-events: none;
        }

        .wall-content {
          position: relative;
          z-index: 1;
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
        }

        .wall-header {
          text-align: center;
          margin-bottom: 5rem;
        }

        .pixel-title {
          font-family: 'Pixelify Sans', sans-serif;
          font-size: clamp(1.5rem, 6vw, 6rem);
          color: #ffeb3b;
          text-shadow: 4px 4px 0px #000;
          text-transform: lowercase;
          margin-bottom: 1rem;
          padding: 0 1rem;
        }

        .wall-subtitle {
          color: #ffcc80;
          font-size: 1.2rem;
          margin-bottom: 2rem;
          text-shadow: 2px 2px 0px #000;
        }

        .paste-button {
          font-size: 1.2rem;
          transform: scale(1.1);
        }

        .experiences-grid {
          display: flex;
          gap: 2.5rem;
          width: 100%;
          max-width: 1400px;
          padding-bottom: 10rem;
        }

        .wall-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        @media (max-width: 1024px) {
          .experiences-grid {
            gap: 1.5rem;
          }
          .wall-column:nth-child(3) {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .wall-content {
            padding: 2rem 1rem;
          }
          .experiences-grid {
            flex-direction: column;
            gap: 2rem;
          }
          .wall-column {
            width: 100%;
          }
          .wall-column:nth-child(2),
          .wall-column:nth-child(3) {
            display: flex; /* Ensure they show up in the single column flow */
          }
        }

        .paper-note {
          width: 100%;
          position: relative;
          padding: 1.5rem;
          box-shadow: 6px 6px 0px rgba(0,0,0,0.4);
          border: 1px solid rgba(0,0,0,0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .paper-note:hover {
          transform: scale(1.05) rotate(0deg) !important;
          box-shadow: 12px 12px 0px rgba(0,0,0,0.5);
          z-index: 10;
        }

        .highlight-new-note {
          animation: note-highlight 2s ease-out;
          z-index: 50;
        }

        @keyframes note-highlight {
          0% { outline: 6px solid #fff; scale: 1.15; box-shadow: 0 0 30px #fff; }
          70% { outline: 4px solid #fff; scale: 1.1; box-shadow: 0 0 20px #fff; }
          100% { outline: 0px solid transparent; scale: 1; box-shadow: 6px 6px 0px rgba(0,0,0,0.4); }
        }

        .paper-note::before {
          content: '';
          position: absolute;
          top: -12px;
          left: var(--tape-left);
          transform: translateX(-50%) rotate(var(--tape-rotate));
          width: 80px;
          height: 30px;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(2px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          z-index: 2;
        }

        .note-content {
          position: relative;
          z-index: 1;
        }

        .exp-text {
          font-size: 1.1rem;
          color: #1a1a1a;
          line-height: 1.4;
          margin-bottom: 1.5rem;
          word-break: break-word;
          flex-grow: 1;
        }

        .exp-signature {
          text-align: right;
          font-weight: bold;
          color: #333;
          border-top: 1px dashed rgba(0,0,0,0.2);
          padding-top: 0.8rem;
          text-transform: lowercase;
          font-size: 0.9rem;
        }

        .batch {
          font-weight: normal;
          opacity: 0.7;
          font-size: 0.9em;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          z-index: 2000;
          display: flex;
          items: center;
          justify-content: center;
          padding: 1rem;
          backdrop-filter: blur(4px);
        }

        .pixel-modal {
          background-color: #00201d;
          border: 8px solid #000;
          box-shadow: 12px 12px 0px #16dbab;
          padding: 2.5rem;
          max-width: 500px;
          width: 100%;
        }

        .modal-title {
          color: #16dbab;
          font-size: 2rem;
          margin-bottom: 2rem;
          text-align: center;
          letter-spacing: 2px;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          color: #16dbab;
          text-transform: lowercase;
          font-size: 0.9rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .cancel-btn {
          !bg-red-600;
          flex: 1;
        }

        .submit-btn {
          flex: 2;
        }

        @keyframes logo-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        @media (max-width: 768px) {
          .wall-content { padding: 2rem 1rem; }
          .pixel-title { font-size: 3rem; }
          .experiences-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
