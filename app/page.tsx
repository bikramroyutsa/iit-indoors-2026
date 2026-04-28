import LandingSection from "@/components/LandingSection";
import PageContainer from "@/components/PageContainer";
import Hero from "@/components/Hero";
import SkySection from "@/components/SkySection";
import ScheduleSection from "@/components/ScheduleSection";
import TechUnderground from "@/components/TechUnderground";
import EpicFooter from "@/components/EpicFooter";

export default function Home() {
  return (
    <main className="w-full flex flex-col min-h-screen">
      <SkySection>
        <Hero />
      </SkySection>
      <ScheduleSection />
      <TechUnderground>
        <PageContainer>
          <LandingSection />
        </PageContainer>
      </TechUnderground>
      <EpicFooter />
    </main>
  );
}
