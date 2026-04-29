"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useSound } from "../hooks/useSound";

export default function DiceTransition({ scrollContainer }: { scrollContainer?: React.RefObject<HTMLElement | null> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { playDiceThump } = useSound();
  const lastThumpProgress = useRef(0);
  
  // Use scroll progress of this section to drive the animation
  // We explicitly pass the container because the page uses a custom scroll element (main)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer,
    offset: ["start end", "end start"]
  });

  // Map progress to dice properties
  // The animation should happen mostly in the middle of the scroll
  const diceRotate = useTransform(scrollYProgress, [0.2, 0.8], [0, 1080]);
  const diceX = useTransform(scrollYProgress, [0.2, 0.5, 0.8], ["-120%", "0%", "120%"]);
  const diceY = useTransform(scrollYProgress, 
    [0.2, 0.35, 0.5, 0.65, 0.8], 
    ["0px", "-120px", "0px", "-120px", "0px"]
  );
  const diceScale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.8, 2, 0.8]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 1, 0]);

  // Dice Roll Sound Logic
  // Play a thump every time the dice "hits" the virtual ground (peaks of diceY)
  // or just every 10% of progress while it's visible.
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Only play between 0.2 and 0.8 progress
    if (latest < 0.2 || latest > 0.8) return;

    // Trigger thumps at specific intervals to simulate rolling
    const interval = 0.05; 
    if (Math.floor(latest / interval) !== Math.floor(lastThumpProgress.current / interval)) {
      playDiceThump();
    }
    lastThumpProgress.current = latest;
  });

  return (
    <section 
      ref={containerRef}
      id="dice-section"
      className="relative w-full h-[100vh] m-0 p-0 overflow-hidden pointer-events-none z-50"
      style={{ backgroundColor: "#000" }}
    >
      {/* Background Collage Layer */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: 'url(/assets/library.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Dark Overlay with smooth transition to the next section */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none" 
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.68) 70%, rgba(0,0,0,0.24) 100%)'
        }}
      />

      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden z-50">
        <motion.div 
          className="relative flex items-center justify-center w-full"
          style={{ opacity }}
        >
          <motion.div 
            style={{ 
              x: diceX, 
              y: diceY, 
              rotate: diceRotate,
              scale: diceScale
            }}
            className="relative w-24 h-24 md:w-32 md:h-32"
          >
            <div className="absolute inset-0 bg-[#f4f1ea] border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] flex items-center justify-center">
              <div className="grid grid-cols-3 grid-rows-3 gap-2 p-4 w-full h-full">
                <div className="bg-black w-2 h-2 rounded-full" />
                <div className="bg-transparent w-2 h-2" />
                <div className="bg-black w-2 h-2 rounded-full" />
                
                <div className="bg-transparent w-2 h-2" />
                <div className="bg-black w-2 h-2 rounded-full" />
                <div className="bg-transparent w-2 h-2" />
                
                <div className="bg-black w-2 h-2 rounded-full" />
                <div className="bg-transparent w-2 h-2" />
                <div className="bg-black w-2 h-2 rounded-full" />
              </div>
            </div>
            
            <motion.div 
              className="absolute inset-0 bg-[#FF4D4D]/20 blur-2xl rounded-full -z-10"
              style={{ scale: 2 }}
            />
          </motion.div>
          
          <motion.div 
            className="absolute mt-72 text-[#FF4D4D] font-pixelify text-2xl tracking-[0.3em] lowercase text-center px-4"
            style={{ opacity: textOpacity }}
          >
            exiting the library for a while...
          </motion.div>
        </motion.div>

        {/* Decorative elements to blend sections */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black to-transparent z-10" />
        <div
          className="absolute bottom-0 left-0 w-full h-80 z-10 pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 24%, rgba(0,0,0,0.52) 68%, rgba(0,0,0,0.9) 100%),
              radial-gradient(circle at 50% 12%, rgba(255,77,77,0.12) 0%, rgba(255,77,77,0.04) 18%, transparent 52%),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.032) 0 1px, transparent 1px 30px),
              repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 30px)
            `,
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 100%)',
          }}
        />
      </div>
    </section>
  );
}

