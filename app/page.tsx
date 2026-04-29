import LandingSection from "@/components/LandingSection";
import Hero from "@/components/Hero";
import SkySection from "@/components/SkySection";
import ScheduleSection from "@/components/ScheduleSection";
import DiceTransition from "@/components/DiceTransition";
import TechUnderground from "@/components/TechUnderground";
import EpicFooter from "@/components/EpicFooter";

export default function Home() {
  return (
    <main className="w-full h-[100svh] overflow-y-auto snap-y snap-mandatory scroll-smooth">
      <SkySection>
        <Hero />
      </SkySection>

      <ScheduleSection />

      <DiceTransition />
      <TechUnderground>
        <LandingSection />
      </TechUnderground>
      <EpicFooter />
    </main>
  );
}
