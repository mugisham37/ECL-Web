import { MarketingLayout } from "@/src/components/marketing/MarketingLayout";
import { HeroSection } from "@/src/components/marketing/HeroSection";
import { HowItWorks } from "@/src/components/marketing/HowItWorks";
import { ModulesSection } from "@/src/components/marketing/ModulesSection";
import { TrustStrip } from "@/src/components/marketing/TrustStrip";
import { ComparisonTable } from "@/src/components/marketing/ComparisonTable";
import { LogoStrip } from "@/src/components/marketing/LogoStrip";
import { CtaBanner } from "@/src/components/marketing/CtaBanner";

export default function HomePage() {
  return (
    <MarketingLayout>
      <HeroSection />
      <HowItWorks />
      <ModulesSection />
      <TrustStrip />
      <ComparisonTable />
      <LogoStrip />
      <CtaBanner />
    </MarketingLayout>
  );
}
