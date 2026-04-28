import Image from "next/image";

export default function EpicFooter() {
  return (
    <section className="w-full relative min-h-[600px] flex flex-col items-center justify-end bg-black overflow-hidden">
      {/* Gradient fading the tech pattern into the epic footer */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#00110F] to-transparent z-10" />

      <Image
        src="/assets/epic_core_bgs.png"
        alt="Glowing Mainframe Core"
        fill
        className="object-cover object-bottom opacity-90"
      />

      <div className="relative z-20 pb-12 text-center drop-shadow-2xl">
        <h2 className="text-5xl text-[var(--mint)] font-bold tracking-wider" style={{ textShadow: '0 0 20px var(--mint)' }}>THE CORE</h2>
        <p className="text-[var(--foreground)] mt-2">End of the line.</p>
      </div>
    </section>
  );
}
