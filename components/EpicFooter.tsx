"use client";

import Image from "next/image";
import ContactSection from "./ContactSection";
import CreditsSection from "./CreditsSection";

export default function EpicFooter() {
  return (
    <section className="w-full relative min-h-screen flex flex-col items-center justify-end bg-black overflow-hidden pt-32 pb-12">
      {/* Gradient fading the tech pattern into the epic footer */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#00110F] to-transparent z-10" />

      <Image
        src="/assets/epic_core_bgs.png"
        alt="Glowing Mainframe Core"
        fill
        className="object-cover object-bottom opacity-40 select-none"
      />

      <div className="relative z-20 w-full flex flex-col items-center gap-32">
        <div className="w-full flex flex-col items-center bg-black/40 backdrop-blur-md py-20 border-y border-[var(--mint)]/10">
          <ContactSection />
        </div>

        <div className="w-full flex flex-col items-center bg-black/40 backdrop-blur-md py-20 border-y border-[var(--mint)]/10">
          <CreditsSection />
        </div>

        <div className="text-center drop-shadow-2xl pb-12">
          <h2 className="text-6xl md:text-8xl text-[var(--mint)] font-bold tracking-widest uppercase" style={{ textShadow: '0 0 30px var(--mint)' }}>THE CORE</h2>
          <p className="text-[var(--foreground)] opacity-50 tracking-[0.5em] mt-4 font-pixelify">END OF THE LINE</p>
        </div>
      </div>
    </section>
  );
}
