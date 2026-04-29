"use client";

import { useEffect, useState } from "react";

const TEAM = [
  { role: "1702", name: "bikram roy utsa" },
  { role: "1703", name: "saeed ahmed mahin" },
  { role: "1728", name: "md. rakinuzzaman talukder" },
];

const TECH = [
  { name: "next.js", desc: "react framework" },
  { name: "tailwind css", desc: "utility-first styling" },
  { name: "pixelify sans", desc: "typography by google fonts" },
  { name: "vercel", desc: "deployment & hosting" },
];

const ACKNOWLEDGEMENTS = [
  "the iit community for making this event possible",
  "our sponsors and partners",
  "the athletes & participants — you're the reason",
];

export default function CreditsContent() {
  const [shuffledTeam, setShuffledTeam] = useState<typeof TEAM>([]);

  useEffect(() => {
    // Shuffle team members on mount
    const shuffled = [...TEAM].sort(() => Math.random() - 0.5);
    setShuffledTeam(shuffled);
  }, []);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* team */}
      <div className="w-full space-y-4">
        <p
          className="text-xs md:text-sm tracking-widest lowercase"
          style={{ color: "var(--mint-soft)", opacity: 0.6 }}
        >
          the team
        </p>

        <div className="grid grid-cols-1 gap-3">
          {shuffledTeam.map((member, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 p-3 rounded border transition-all duration-300 hover:bg-[rgba(22,219,171,0.08)]"
              style={{
                background: "rgba(22, 219, 171, 0.04)",
                borderColor: "rgba(22, 219, 171, 0.15)",
              }}
            >
              <span
                className="text-[10px] md:text-xs tracking-widest lowercase"
                style={{ color: "var(--mint-soft)", opacity: 0.55 }}
              >
                {member.role}
              </span>
              <span
                className="text-base md:text-lg font-bold tracking-wide"
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
      <div className="w-full space-y-4">
        <p
          className="text-xs md:text-sm tracking-widest lowercase"
          style={{ color: "var(--mint-soft)", opacity: 0.6 }}
        >
          technology
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TECH.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 p-3 rounded border"
              style={{
                background: "rgba(22, 219, 171, 0.03)",
                borderColor: "rgba(22, 219, 171, 0.12)",
              }}
            >
              <span
                className="text-base font-bold tracking-wide"
                style={{ color: "var(--mint)", textShadow: "0 0 10px rgba(22, 219, 171, 0.3)" }}
              >
                {item.name}
              </span>
              <span
                className="text-[10px] md:text-xs tracking-wide"
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
      <div className="w-full space-y-4">
        <p
          className="text-xs md:text-sm tracking-widest lowercase"
          style={{ color: "var(--mint-soft)", opacity: 0.6 }}
        >
          acknowledgements
        </p>

        <ul className="space-y-2">
          {ACKNOWLEDGEMENTS.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm md:text-base tracking-wide"
              style={{ color: "var(--foreground)", opacity: 0.6 }}
            >
              <span style={{ color: "var(--mint)", opacity: 0.8, flexShrink: 0 }}>▸</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* footer note */}
      <div className="text-center space-y-2 pt-4 border-t border-[var(--mint)]/10">
        <p
          className="text-[10px] md:text-xs tracking-widest"
          style={{ color: "var(--mint-soft)", opacity: 0.35 }}
        >
          iit indoors 2026 — all rights reserved
        </p>
      </div>
    </div>
  );
}
