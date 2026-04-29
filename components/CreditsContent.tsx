"use client";

interface CreditsContentProps {
  team: any[];
}

export default function CreditsContent({ team }: CreditsContentProps) {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* team */}
      <div className="w-full space-y-4">
        <p
          className="text-xs md:text-sm tracking-widest lowercase text-center"
          style={{ color: "var(--mint-soft)", opacity: 0.6 }}
        >
          the team
        </p>

        <div className="flex flex-col items-center gap-4">
          {team.map((member, i) => (
            <div
              key={i}
              className="w-full max-w-md flex flex-col items-center p-4 rounded border transition-all duration-300 hover:bg-[rgba(22,219,171,0.08)]"
              style={{
                background: "rgba(22, 219, 171, 0.04)",
                borderColor: "rgba(22, 219, 171, 0.15)",
              }}
            >
              <span
                className="text-xl md:text-2xl font-bold tracking-widest lowercase text-center"
                style={{ color: "var(--foreground)" }}
              >
                {member.name}
              </span>
            </div>
          ))}
        </div>
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
