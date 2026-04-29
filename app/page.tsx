"use client";

import { useState, useEffect, useRef } from "react";
import LandingSection from "@/components/LandingSection";
import Hero from "@/components/Hero";
import SkySection from "@/components/SkySection";
import ScheduleSection from "@/components/ScheduleSection";
import DiceTransition from "@/components/DiceTransition";
import TechUnderground from "@/components/TechUnderground";
import EpicFooter from "@/components/EpicFooter";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const [snapType, setSnapType] = useState<"mandatory" | "none">("mandatory");

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const handleScroll = () => {
      const scrollPos = main.scrollTop;
      const vh = window.innerHeight;

      // Once we've scrolled slightly past the Schedule section (1.1vh)
      // we disable mandatory snapping to allow fluid scrolling through the underground.
      if (scrollPos > vh * 1.25) {
        if (snapType !== "none") setSnapType("none");
      } else {
        if (snapType !== "mandatory") setSnapType("mandatory");
      }
    };

    main.addEventListener("scroll", handleScroll, { passive: true });
    return () => main.removeEventListener("scroll", handleScroll);
  }, [snapType]);

  return (
    <main
      ref={mainRef}
      className="w-full h-[100svh] overflow-y-auto scroll-smooth custom-scrollbar"
      style={{
        scrollSnapType: snapType === "mandatory" ? "y mandatory" : "none"
      }}
    >
      <SkySection>
        <Hero />
      </SkySection>

      <ScheduleSection />

      <DiceTransition scrollContainer={mainRef} />

      <TechUnderground>
        <LandingSection />
      </TechUnderground>
    </main>
  );
}
