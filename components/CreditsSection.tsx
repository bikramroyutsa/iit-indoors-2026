"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const TEAM = [
  { role: "1702", name: "Bikram Roy Utsa" },
  { role: "1703", name: "Saeed Ahmed Mahin" },
  { role: "1728", name: "Md. Rakinuzzaman Talukder" },

];

const TECH = [
  { name: "next.js", desc: "react framework" },
  { name: "tailwind css", desc: "utility-first styling" },
  { name: "pixelify sans", desc: "typography by google fonts" },
  { name: "vercel", desc: "deployment & hosting" },
];

const ACKNOWLEDGEMENTS = [
  "the iit community for making this event possible",
  "every volunteer who stayed up late",
  "our sponsors and partners",
  "the athletes & participants — you're the reason",
];

export default function CreditsSection() {
  const [entered, setEntered] = useState(false);
  const [shuffledTeam, setShuffledTeam] = useState<typeof TEAM>([]);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 60);
    // Shuffle team members on mount
    const shuffled = [...TEAM].sort(() => Math.random() - 0.5);
    setShuffledTeam(shuffled);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className={`w-full max-w-3xl flex flex-col items-center gap-8 md:gap-12 px-4 py-8 md:p-0 transition-all duration-700 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      aria-label="credits page"
    >
      {/* back link */}
      <div className="w-full">
        <Link
          href="/"
          className="text-base md:text-lg tracking-widest transition-opacity hover:opacity-60"
          style={{ color: "var(--mint-soft)" }}
        >
          ← back
        </Link>
      </div>

      {/* heading */}
      <div className="text-center space-y-2 md:space-y-3">
        <p
          className="tracking-widest text-lg md:text-xl lg:text-2xl"
          style={{
            color: "var(--mint-soft)",
            textShadow: "0 0 14px rgba(102, 245, 207, 0.55)",
            animation: "text-blink 2.8s steps(1, end) infinite",
          }}
        >
          built with purpose
        </p>
        <h1
          className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-widest drop-shadow-lg"
          style={{ color: "var(--foreground)" }}
        >
          credits
        </h1>
      </div>

      {/* team */}
      <div className="w-full space-y-4 md:space-y-6">
        <p
          className="text-sm md:text-base tracking-widest uppercase"
          style={{ color: "var(--mint-soft)", opacity: 0.6 }}
        >
          the team
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {shuffledTeam.map((member, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 p-4 md:p-5 rounded-lg border transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "rgba(22, 219, 171, 0.04)",
                borderColor: "rgba(22, 219, 171, 0.15)",
              }}
            >
              <span
                className="text-sm md:text-base tracking-widest uppercase"
                style={{ color: "var(--mint-soft)", opacity: 0.55 }}
              >
                {member.role}
              </span>
              <span
                className="text-lg md:text-xl font-bold tracking-wide"
                style={{ color: "var(--foreground)" }}
              >
                {member.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* divider */}
      <div
        className="w-full h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(22,219,171,0.3), transparent)" }}
      />

      {/* tech stack */}
      <div className="w-full space-y-4 md:space-y-6">
        <p
          className="text-sm md:text-base tracking-widest uppercase"
          style={{ color: "var(--mint-soft)", opacity: 0.6 }}
        >
          technology
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {TECH.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 p-4 md:p-5 rounded-lg border"
              style={{
                background: "rgba(22, 219, 171, 0.03)",
                borderColor: "rgba(22, 219, 171, 0.12)",
              }}
            >
              <span
                className="text-lg md:text-xl font-bold tracking-wide"
                style={{ color: "var(--mint)", textShadow: "0 0 10px rgba(22, 219, 171, 0.3)" }}
              >
                {item.name}
              </span>
              <span
                className="text-sm md:text-base tracking-wide"
                style={{ color: "var(--foreground)", opacity: 0.45 }}
              >
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* divider */}
      <div
        className="w-full h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(22,219,171,0.3), transparent)" }}
      />

      {/* acknowledgements */}
      <div className="w-full space-y-4 md:space-y-6">
        <p
          className="text-sm md:text-base tracking-widest uppercase"
          style={{ color: "var(--mint-soft)", opacity: 0.6 }}
        >
          acknowledgements
        </p>

        <ul className="space-y-2 md:space-y-3">
          {ACKNOWLEDGEMENTS.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 md:gap-4 text-base md:text-lg tracking-wide"
              style={{ color: "var(--foreground)", opacity: 0.6 }}
            >
              <span style={{ color: "var(--mint)", opacity: 0.8, flexShrink: 0 }}>▸</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* footer note */}
      <div className="text-center space-y-2 pb-4">
        <p
          className="text-sm md:text-base tracking-widest"
          style={{ color: "var(--mint-soft)", opacity: 0.35 }}
        >
          iit indoors 2026 — all rights reserved
        </p>
        <p
          className="text-sm md:text-base tracking-widest"
          style={{
            color: "var(--mint)",
            textShadow: "0 0 10px rgba(22, 219, 171, 0.4)",
            opacity: 0.5,
          }}
        >
          made with ♥ at iit
        </p>
      </div>
    </section>
  );
}
