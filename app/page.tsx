import { MarketingLayout } from "@/app/components/marketing/MarketingLayout";
import { HeroSection } from "@/app/components/marketing/HeroSection";
import { HowItWorks } from "@/app/components/marketing/HowItWorks";
import { ModulesSection } from "@/app/components/marketing/ModulesSection";
import { TrustStrip } from "@/app/components/marketing/TrustStrip";
import { ComparisonTable } from "@/app/components/marketing/ComparisonTable";
import { LogoStrip } from "@/app/components/marketing/LogoStrip";
import { CtaBanner } from "@/app/components/marketing/CtaBanner";

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
