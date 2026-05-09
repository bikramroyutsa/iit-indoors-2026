'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useSound } from '../../hooks/useSound';
import Link from 'next/link';
import AudioToggle from '../../components/AudioToggle';
import QuickNav from '@/components/QuickNav';

interface Participant {
  name: string;
  batch: string;
  type?: string;
}

interface Result {
  game: string;
  champion: Participant[];
  runnerUp: Participant[];
  secondRunnerUp: Participant[];
}

const getDitherSVG = (c1: string, c2: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
    <rect width="16" height="16" fill="${c1}" />
    <rect x="4" y="0" width="4" height="4" fill="${c2}" />
    <rect x="0" y="4" width="4" height="4" fill="${c2}" />
    <rect x="8" y="4" width="4" height="4" fill="${c2}" />
    <rect x="4" y="8" width="4" height="4" fill="${c2}" />
    <rect x="12" y="8" width="4" height="4" fill="${c2}" />
    <rect x="0" y="12" width="16" height="4" fill="${c2}" />
    <rect x="0" y="12" width="4" height="4" fill="${c1}" />
  </svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const { startBirds, stopBirds } = useSound();

  const c1 = "#004650";
  const c2 = "#00556C";
  const c3 = "#006488";
  const c4 = "#0073A3";
  const c5 = "#0083BF";

  useEffect(() => {
    const fetchResults = async () => {
        try {
          const q = query(collection(db, "tournament_results"), orderBy("game", "asc"));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const data = snapshot.docs.map(doc => doc.data() as Result);
            setResults(data);
          } else {
            // Fallback to JSON if Firestore is empty
            const res = await fetch('/json/results.json');
            const data = await res.json();
            setResults(data);
          }
        } catch (err) {
          console.error("Firestore fetch failed, falling back to JSON", err);
          const res = await fetch('/json/results.json');
          const data = await res.json();
          setResults(data);
        }
    };

    fetchResults();
      
    // Start ambient birds on mount
    startBirds();
    return () => stopBirds();
  }, [startBirds, stopBirds]);

  const getRandomRotation = (index: number) => {
    const rots = [-1.5, -0.5, 0.5, 1.5];
    return rots[index % rots.length];
  };

  return (
    <main className="results-container">
      {/* Background - Replicating SkySection logic */}
      <div className="sky-background" style={{
        background: `linear-gradient(
          to bottom,
          ${c1} 0%, ${c1} 20%,
          ${c2} 20%, ${c2} 40%,
          ${c3} 40%, ${c3} 60%,
          ${c4} 60%, ${c4} 80%,
          ${c5} 80%, ${c5} 100%
        )`
      }}>
        <div className="dither-layer" style={{ top: 'calc(20% - 8px)', backgroundImage: getDitherSVG(c1, c2) }} />
        <div className="dither-layer" style={{ top: 'calc(40% - 8px)', backgroundImage: getDitherSVG(c2, c3) }} />
        <div className="dither-layer" style={{ top: 'calc(60% - 8px)', backgroundImage: getDitherSVG(c3, c4) }} />
        <div className="dither-layer" style={{ top: 'calc(80% - 8px)', backgroundImage: getDitherSVG(c4, c5) }} />

        <div className="clouds-overlay">
          <img src="/assets/cloud1.svg" className="pixel-cloud" style={{ top: '15%', width: '200px', animationDuration: '65s', animationDelay: '-10s' }} alt="" />
          <img src="/assets/cloud2.svg" className="pixel-cloud" style={{ top: '35%', width: '120px', animationDuration: '45s', animationDelay: '-5s' }} alt="" />
          <img src="/assets/cloud1.svg" className="pixel-cloud" style={{ top: '65%', width: '180px', animationDuration: '55s', animationDelay: '-25s' }} alt="" />
          <img src="/assets/cloud2.svg" className="pixel-cloud" style={{ top: '80%', width: '100px', animationDuration: '80s', animationDelay: '0s' }} alt="" />
        </div>
      </div>

      <div className="results-content custom-scrollbar">
        <header className="results-header">
          <h1 className="pixel-title">the resultz</h1>
          <p className="results-subtitle font-pixelify">IIT Indoors '26 Tournament Standings</p>
        </header>

        <div className="streamlined-grid">
          {results.map((result, idx) => (
            <div
              key={result.game}
              className="result-card-container"
              style={{
                '--rotation': `${getRandomRotation(idx)}deg`,
              } as React.CSSProperties}
            >
              <div className="paper-board">
                {/* Paper Texture Overlay */}
                <div className="paper-texture" />
                
                <div className="card-inner">
                  <h2 className="game-name">{result.game}</h2>
                  <div className="podium">
                    <div className="podium-item champion">
                      <span className="rank">champion</span>
                      {result.champion.map((p, i) => (
                        <p key={i} className="winner-name">
                          {p.name} <span className="batch">[{p.batch}]</span>
                        </p>
                      ))}
                    </div>
                    {result.runnerUp.length > 0 && (
                      <div className="podium-item runner-up">
                        <span className="rank">runner-up</span>
                        {result.runnerUp.map((p, i) => (
                          <p key={i} className="winner-name">
                            {p.name} <span className="batch">[{p.batch}]</span>
                          </p>
                        ))}
                      </div>
                    )}
                    {result.secondRunnerUp.length > 0 && (
                      <div className="podium-item second-runner-up">
                        <span className="rank">2nd runner-up</span>
                        {result.secondRunnerUp.map((p, i) => (
                          <p key={i} className="winner-name">
                            {p.name} <span className="batch">[{p.batch}]</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New CTA Section */}
        <div className="flex flex-col items-center gap-6 mt-12 mb-20">
          <p className="font-pixelify text-mint-soft text-lg tracking-widest text-center lowercase">
            your experience matters too...
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            <Link href="/wall">
              <button className="pixel-button scale-105 md:scale-115 hover:scale-125 transition-transform bg-opacity-90">
                visit the wallz
              </button>
            </Link>
            <Link href="/hall">
              <button className="pixel-button scale-105 md:scale-115 hover:scale-125 transition-transform border-mint-soft">
                visit the hallz
              </button>
            </Link>
          </div>
        </div>
      </div>

      <AudioToggle />
      <QuickNav />

      <style jsx>{`
        .results-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #004650;
        }

        .sky-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
        }

        .dither-layer {
          position: absolute;
          left: 0;
          width: 100%;
          height: 16px;
          pointer-events: none;
        }

        .clouds-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        }

        .pixel-cloud {
            position: absolute;
            opacity: 0.4;
            image-rendering: pixelated;
            animation: drift linear infinite;
        }

        @keyframes drift {
            from { transform: translateX(-300px); }
            to { transform: translateX(110vw); }
        }

        .results-content {
          position: relative;
          z-index: 1;
          height: 100vh;
          overflow-y: auto;
          padding: 2rem;
          display: block;
        }

        .results-header {
          max-width: 800px;
          margin: 0 auto 2rem auto;
          text-align: center;
        }

        .pixel-title {
          font-family: 'Pixelify Sans', sans-serif;
          font-size: clamp(1.5rem, 6vw, 6rem);
          color: #ffeb3b;
          text-shadow: 4px 4px 0px #000;
          text-transform: lowercase;
          margin: 0;
          animation: logo-float 6s ease-in-out infinite;
          padding: 0 1rem;
        }

        @keyframes glitch-title {
          0%, 90%, 100% { transform: skew(0deg) translate(0); text-shadow: 6px 6px 0px #000; }
          92% { transform: skew(5deg) translate(-5px); text-shadow: 6px 6px 0px #ff00c1, -6px -6px 0px #00fff9; }
          94% { transform: skew(-5deg) translate(5px); text-shadow: 6px 6px 0px #00fff9, -6px -6px 0px #ff00c1; }
          96% { transform: skew(0deg) translate(0); }
        }

        @keyframes logo-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .streamlined-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 4rem;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem;
        }

        .result-card-container {
          transform: rotate(var(--rotation));
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }

        .result-card-container:hover {
          transform: rotate(0deg) scale(1.05);
          z-index: 50;
        }

        .paper-board {
          position: relative;
          background-color: #f4f1ea;
          border: 4px solid #000;
          box-shadow: 10px 10px 0px 0px rgba(0,0,0,0.8);
          padding: 2.5rem 1.5rem;
          min-height: 380px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .paper-texture {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          pointer-events: none;
          background-image: repeating-linear-gradient(transparent, transparent 2px, #000 2px, #000 3px);
          z-index: 1;
        }

        .card-inner {
          position: relative;
          z-index: 2;
          text-align: center;
          font-family: 'Silkscreen', sans-serif;
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: center;
        }

        .game-name {
          font-size: 1.8rem;
          margin-bottom: 2rem;
          color: #000;
          border-bottom: 2px solid rgba(0,0,0,0.1);
          display: inline-block;
          padding-bottom: 0.5rem;
          text-transform: lowercase;
          letter-spacing: -1px;
          width: fit-content;
          align-self: center;
          font-weight: 900;
        }

        .podium {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: center;
        }

        .podium-item {
          width: 100%;
        }

        .rank {
          display: block;
          font-size: 0.75rem;
          text-transform: lowercase;
          margin-bottom: 0.3rem;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .champion .rank { color: #b8860b; }
        .runner-up .rank { color: #556677; }
        .second-runner-up .rank { color: #8b4513; }

        .winner-name {
          font-size: 1.1rem;
          margin: 0;
          color: #000;
          line-height: 1.2;
          font-weight: 700;
        }

        .champion .winner-name {
          font-size: 1.25rem;
          text-decoration: underline decoration-dotted #b8860b 2px;
          text-underline-offset: 4px;
        }

        .batch {
          font-size: 0.85rem;
          color: #666;
          margin-left: 0.4rem;
          font-weight: normal;
        }

        .sound-toggle {
           font-size: 0.8rem;
           padding: 12px 24px;
           z-index: 100;
        }

        @media (max-width: 768px) {
          .results-content { padding: 1rem; }
          .streamlined-grid { 
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .paper-board { 
            min-height: 320px;
            padding: 2rem 1rem;
          }
          .pixel-title { font-size: 4rem; }
        }
      `}</style>
    </main>
  );
}
