"use client";

import React, { useState, useEffect } from "react";
import AudioToggle from "@/components/AudioToggle";
import QuickNav from "@/components/QuickNav";

interface HallPhoto {
  id: string;
  url: string;
  caption: string;
}

export default function HallPage() {
  const [photos, setPhotos] = useState<HallPhoto[]>([]);
  const [columnCount, setColumnCount] = useState(3);
  const [lastUploadedId, setLastUploadedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/snapz')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPhotos(data);
      })
      .catch(err => console.error("Failed to fetch snapz", err));
  }, []);

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
    if (lastUploadedId && photos.some(p => p.id === lastUploadedId)) {
      setTimeout(() => {
        const element = document.getElementById(`photo-${lastUploadedId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => setLastUploadedId(null), 2000);
        }
      }, 300);
    }
  }, [photos, lastUploadedId]);

  const getAsymmetricStyle = (id: string, index: number) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseRotation = (hash % 6) + 1;
    const rotation = index % 2 === 0 ? baseRotation : -baseRotation;

    const translateX = (hash % 15) - 7;
    const translateY = (hash % 15) - 7;

    return {
      transform: `rotate(${rotation}deg) translate(${translateX}px, ${translateY}px)`,
      maxWidth: columnCount === 1 ? '92%' : '100%',
      alignSelf: 'center',
    } as React.CSSProperties;
  };

  return (
    <main className="hall-container custom-scrollbar">
      <div className="brick-wall" />

      <div className="hall-content">
        <header className="hall-header">
          <h1 className="pixel-title">the hallz</h1>
          <p className="hall-subtitle font-pixelify">IIT Indoors '26 hall of fame</p>
        </header>

        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <p className="font-pixelify text-mint-soft text-2xl tracking-[0.2em] lowercase text-center">
              the snaps are coming soon...
            </p>
            <p className="text-mint-soft/60 font-pixelify mt-4 text-sm lowercase">
              curating the hall of fame
            </p>
          </div>
        ) : (
          <>
            <div className="photos-grid">
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                <div key={colIndex} className="hall-column">
                  {photos
                    .map((photo, originalIdx) => ({ photo, originalIdx }))
                    .filter(({ originalIdx }) => originalIdx % columnCount === colIndex)
                    .map(({ photo, originalIdx }) => (
                      <div 
                        key={photo.id} 
                        id={`photo-${photo.id}`}
                        className={`polaroid-frame ${lastUploadedId === photo.id ? 'highlight-new-photo' : ''}`}
                        style={getAsymmetricStyle(photo.id, originalIdx)}
                      >
                        <div className="photo-tape" />
                        <div className="polaroid-image-container">
                          <img src={photo.url} alt={photo.caption} className="polaroid-img" loading="lazy" />
                        </div>
                        <div className="polaroid-caption font-pixelify">
                          <p className="caption-text lowercase">{photo.caption}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
            
            <div className="flex flex-col items-center justify-center py-16 opacity-60">
              <p className="font-pixelify text-mint-soft text-lg tracking-widest lowercase animate-pulse">
                more are coming soon...
              </p>
            </div>
          </>
        )}
      </div>

      <AudioToggle />
      <QuickNav />

      <style jsx>{`
        .hall-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background-color: #8b3434;
          overflow-x: hidden;
        }

        .brick-wall {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(335deg, #a94444 23px, transparent 23px),
            linear-gradient(155deg, #c55d5d 23px, transparent 23px),
            linear-gradient(335deg, #a94444 23px, transparent 23px),
            linear-gradient(155deg, #c55d5d 23px, transparent 23px);
          background-size: 58px 58px;
          background-position: 0px 2px, 4px 35px, 29px 31px, 34px 6px;
          opacity: 0.5;
          pointer-events: none;
        }

        .hall-content {
          position: relative;
          z-index: 10;
          padding: 4rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .hall-header {
          text-align: center;
          margin-bottom: 5rem;
        }

        .pixel-title {
          font-family: 'Pixelify Sans', sans-serif;
          font-size: clamp(2.5rem, 10vw, 6rem);
          color: #ffeb3b;
          text-shadow: 4px 4px 0px #000;
          text-transform: lowercase;
          margin-bottom: 1rem;
          padding: 0 1rem;
        }

        .hall-subtitle {
          color: #ffcdd2;
          letter-spacing: 2px;
          margin-bottom: 2rem;
          text-transform: uppercase;
          font-size: 0.9rem;
        }

        .photos-grid {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          width: 100%;
        }

        .hall-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3rem;
          min-width: 0; /* Prevents flex children from overflowing */
        }

        .polaroid-frame {
          background: #fff;
          padding: 1rem 1rem 3rem 1rem;
          box-shadow: 10px 10px 0px rgba(0,0,0,0.4);
          position: relative;
          transition: transform 0.3s ease;
          width: 100%;
        }

        .polaroid-frame:hover {
          transform: scale(1.05) rotate(0deg) !important;
          z-index: 50;
        }

        .photo-tape {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%) rotate(-3deg);
          width: 80px;
          height: 30px;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(2px);
          box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
          z-index: 2;
        }

        .polaroid-image-container {
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          background: #222;
          border: 2px solid #ddd;
        }

        .polaroid-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: sepia(0.2) contrast(1.1);
        }

        .polaroid-caption {
          margin-top: 1.5rem;
          color: #333;
          text-align: center;
        }

        .caption-text {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        .highlight-new-photo {
          animation: photo-highlight 2s ease-out;
          z-index: 100;
        }

        @keyframes photo-highlight {
          0% { outline: 8px solid #ffeb3b; scale: 1.15; box-shadow: 0 0 40px #ffeb3b; }
          70% { outline: 4px solid #ffeb3b; scale: 1.1; box-shadow: 0 0 20px #ffeb3b; }
          100% { outline: 0px solid transparent; scale: 1; }
        }

        @media (max-width: 768px) {
          .hall-content { padding: 2rem 1rem; }
          .photos-grid { 
            flex-direction: column;
            gap: 2rem;
            align-items: center;
          }
          .hall-column { 
            width: 100%;
            gap: 3rem;
          }
          .polaroid-frame { 
            padding: 0.8rem 0.8rem 2rem 0.8rem;
            max-width: 90% !important; /* Force containment even with rotation */
          }
        }
      `}</style>
    </main>
  );
}
