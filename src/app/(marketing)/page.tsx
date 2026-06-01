import { HeroSection } from "@/components/marketing/HeroSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { ModulesSection } from "@/components/marketing/ModulesSection";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { ComparisonTable } from "@/components/marketing/ComparisonTable";
import { LogoStrip } from "@/components/marketing/LogoStrip";
import { CtaBanner } from "@/components/marketing/CtaBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <ModulesSection />
      <TrustStrip />
      <ComparisonTable />
      <LogoStrip />
      <CtaBanner />
    </>
  );
}
