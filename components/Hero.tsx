"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Hero() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // small delay so the animation feels natural on first paint
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="w-full max-w-4xl flex flex-col items-center gap-4" aria-label="iit indoors hero section">
      <p
        className="tracking-widest text-4xl md:text-6xl drop-shadow-lg hero-kicker"
        style={{
          color: 'var(--mint-soft)',
          textShadow: '0 0 14px rgba(102, 245, 207, 0.55)'
        }}
      >
        welcome to
      </p>
      <Image
        className={`w-2/3 md:w-3/5 h-auto hero-logo ${entered ? 'logo-enter' : ''}`}
        src="/assets/Logo.png"
        alt="iit indoors 2026 logo"
        width={1599}
        height={780}
        priority
      />
    </section>
  );
}
