import CreditsSection from "@/components/CreditsSection";
import PageContainer from "@/components/PageContainer";
import Link from "next/link";

export default function CreditsPage() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12">
        <CreditsSection />
        
        <Link
          href="/"
          className="text-base md:text-lg tracking-[0.4em] transition-opacity hover:opacity-60 uppercase"
          style={{ color: "var(--mint-soft)" }}
        >
          ← return to home
        </Link>
      </div>
    </PageContainer>
  );
}
