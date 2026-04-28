"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function DiceTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress through this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the scroll progress for animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Animation values based on scroll
  const diceRotate = useTransform(smoothProgress, [0, 1], [0, 720]);
  const diceX = useTransform(smoothProgress, [0, 0.5, 1], ["-150%", "0%", "150%"]);
  const diceY = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], ["0px", "-100px", "0px", "-100px", "0px"]);
  const diceScale = useTransform(smoothProgress, [0, 0.5, 1], [0.5, 1.5, 0.5]);
  const opacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Background color transition (from Schedule Ground to Tech Underground)
  const bgColor = useTransform(
    smoothProgress,
    [0.4, 0.6],
    ["#00110F", "#00201d"]
  );

  return (
    <section 
      ref={containerRef}
      className="relative h-[200vh] w-full overflow-hidden pointer-events-none snap-start"
      style={{ backgroundColor: "#00110F" }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          className="relative flex items-center justify-center w-full"
          style={{ opacity }}
        >
          {/* The Dice */}
          <motion.div 
            style={{ 
              x: diceX, 
              y: diceY, 
              rotate: diceRotate,
              scale: diceScale
            }}
            className="relative w-24 h-24 md:w-32 md:h-32"
          >
            {/* Pixel Art Dice Body */}
            <div className="absolute inset-0 bg-[#f4f1ea] border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] flex items-center justify-center">
              {/* Dots for the "Face" (we'll simulate rolling by changing dots or just showing a nice 6) */}
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
            
            {/* Subtle trail effect */}
            <motion.div 
              className="absolute inset-0 bg-white/10 blur-xl rounded-full -z-10"
              style={{ scale: 1.5 }}
            />
          </motion.div>
          
          {/* Floating Text Tip */}
          <motion.div 
            className="absolute mt-48 text-[#00EBA9] font-pixelify text-xl tracking-[0.2em] lowercase opacity-50"
            style={{
              opacity: useTransform(smoothProgress, [0.4, 0.5, 0.6], [0, 1, 0])
            }}
          >
            entering the underground...
          </motion.div>
        </motion.div>

        {/* Dither transitions to blend with sections */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#00110F] to-transparent z-10" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#00201d] to-transparent z-10" />
      </div>
    </section>
  );
}
