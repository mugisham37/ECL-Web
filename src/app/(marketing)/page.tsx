import dynamic from "next/dynamic";
import { HeroSection } from "@/components/marketing/HeroSection";

const HowItWorks = dynamic(() =>
  import("@/components/marketing/HowItWorks").then((m) => ({
    default: m.HowItWorks,
  })),
);
const ModulesSection = dynamic(() =>
  import("@/components/marketing/ModulesSection").then((m) => ({
    default: m.ModulesSection,
  })),
);
const TrustStrip = dynamic(() =>
  import("@/components/marketing/TrustStrip").then((m) => ({
    default: m.TrustStrip,
  })),
);
const ComparisonTable = dynamic(() =>
  import("@/components/marketing/ComparisonTable").then((m) => ({
    default: m.ComparisonTable,
  })),
);
const LogoStrip = dynamic(() =>
  import("@/components/marketing/LogoStrip").then((m) => ({
    default: m.LogoStrip,
  })),
);
const CtaBanner = dynamic(() =>
  import("@/components/marketing/CtaBanner").then((m) => ({
    default: m.CtaBanner,
  })),
);

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
