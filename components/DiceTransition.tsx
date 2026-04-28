"use client";

import { useRef, useEffect, useState } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";

export default function DiceTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasScrolledNext, setHasScrolledNext] = useState(false);
  const [isReverse, setIsReverse] = useState(false);

  // Use a motion value for the animation progress (0 to 1)
  const animProgress = useMotionValue(0);

  // Animation values based on progress
  const diceRotate = useTransform(animProgress, [0.1, 0.9], [0, 720]);
  const diceX = useTransform(animProgress, [0.1, 0.5, 0.9], ["-150%", "0%", "150%"]);
  const diceY = useTransform(animProgress, [0.1, 0.3, 0.5, 0.7, 0.9], ["0px", "-120px", "0px", "-120px", "0px"]);
  const diceScale = useTransform(animProgress, [0.1, 0.5, 0.9], [0.6, 1.8, 0.6]);
  const opacity = useTransform(animProgress, [0.1, 0.2, 0.8, 0.9], [0, 1, 1, 0]);
  const textOpacity = useTransform(animProgress, [0.4, 0.5, 0.6], [0, 1, 0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          
          // Detect entry point relative to viewport
          // top > 0: section is entering from bottom (coming from Schedule above)
          // top < 0: section is entering from top (coming from Tech below)
          const comingFromAbove = entry.boundingClientRect.top > 0;
          
          setIsReverse(!comingFromAbove);
          const targetValue = comingFromAbove ? 1 : 0;
          const startValue = comingFromAbove ? 0 : 1;
          
          animProgress.set(startValue);
          
          const controls = animate(animProgress, targetValue, {
            duration: 4,
            ease: "easeInOut",
            onComplete: () => {
              if (comingFromAbove) {
                // Head down to tech
                const tech = document.getElementById('tech');
                if (tech && !hasScrolledNext) {
                  setHasScrolledNext(true);
                  tech.scrollIntoView({ behavior: 'smooth' });
                  setTimeout(() => {
                    setHasScrolledNext(false);
                    setIsInView(false);
                  }, 3000);
                }
              } else {
                // Head up to schedule
                const schedule = document.getElementById('schedule');
                if (schedule) {
                  schedule.scrollIntoView({ behavior: 'smooth' });
                  setTimeout(() => {
                    setIsInView(false);
                  }, 3000);
                }
              }
            }
          });

          return () => controls.stop();
        }
      },
      { threshold: 0.1 } // Catch it earlier for a smoother handoff
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isInView, hasScrolledNext, animProgress]);

  return (
    <section
      ref={containerRef}
      id="dice-section"
      className="relative h-[100svh] w-full overflow-hidden pointer-events-none snap-start snap-always"
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
              className="absolute inset-0 bg-white/10 blur-xl rounded-full -z-10"
              style={{ scale: 1.5 }}
            />
          </motion.div>

          <motion.div
            className="absolute mt-48 text-[#00EBA9] font-pixelify text-xl tracking-[0.2em] lowercase opacity-50"
            style={{ opacity: textOpacity }}
          >
            {isReverse ? "exiting the underground..." : "entering the underground..."}
          </motion.div>
        </motion.div>

        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#00110F] to-transparent z-10" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#00201d] to-transparent z-10" />
      </div>
    </section>
  );
}



