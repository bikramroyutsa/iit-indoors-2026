import LandingSection from "@/components/LandingSection";
import PageContainer from "@/components/PageContainer";
import Hero from "@/components/Hero";
import SkySection from "@/components/SkySection";
import ScheduleSection from "@/components/ScheduleSection";
import DiceTransition from "@/components/DiceTransition";
import TechUnderground from "@/components/TechUnderground";
import EpicFooter from "@/components/EpicFooter";

export default function Home() {
  return (
    <main className="w-full flex flex-col h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
      <SkySection>
        <Hero />
      </SkySection>
      <ScheduleSection />
      <DiceTransition />
      <TechUnderground>
        <PageContainer>
          <LandingSection />
        </PageContainer>
      </TechUnderground>
      <EpicFooter />
    </main>
  );
}
