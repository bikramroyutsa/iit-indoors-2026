import { ReactNode } from "react";

interface UndergroundSectionProps {
  children?: ReactNode;
}

export default function UndergroundSection({ children }: UndergroundSectionProps) {
  return (
    <section 
      className="w-full relative min-h-[50vh] p-10 flex flex-col items-center"
      style={{
        // Start exactly from the dark brown at the bottom of the building and fade back to transparent to reveal the global dark theme
        background: 'linear-gradient(to bottom, rgb(86, 48, 35) 0%, transparent 100%)'
      }}
    >
      <div className="container mx-auto">
        {children || (
          <div className="text-center opacity-70 mt-20">
            <p>Underground content goes here</p>
          </div>
        )}
      </div>
    </section>
  );
}
