"use client";

import Image from "next/image";

export default function EpicFooter() {
  return (
    <section id="core" className="w-full relative h-[100svh] flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Gradient fading the tech pattern into the epic footer */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#00110F] to-transparent z-10" />

      <Image
        src="/assets/epic_core_bgs.png"
        alt="Glowing Mainframe Core"
        fill
        className="object-cover object-bottom opacity-40 select-none"
      />

      <div className="relative z-20 w-full flex flex-col items-center gap-16">
        <div className="text-center drop-shadow-2xl">
          <p className="text-[var(--foreground)] opacity-50 tracking-[0.5em] mb-4 font-pixelify">YOU'VE REACHED</p>
          <h2 className="text-6xl md:text-8xl text-[var(--mint)] font-bold tracking-widest uppercase" style={{ textShadow: '0 0 30px var(--mint)' }}>THE CORE</h2>
          <p className="text-[var(--foreground)] opacity-50 tracking-[0.5em] mt-4 font-pixelify uppercase">end of the line</p>
        </div>
      </div>
    </section>
  );
}
