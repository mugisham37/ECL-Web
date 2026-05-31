import { MarketingLayout } from "@/src/components/marketing/MarketingLayout";
import { PricingSection } from "@/src/components/marketing/PricingSection";
import { FaqAccordion } from "@/src/components/marketing/FaqAccordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — ECL Platform",
  description:
    "Simple, transparent pricing for IFRS 9 Expected Credit Loss calculations. No hidden fees.",
};

export default function PricingPage() {
  return (
    <MarketingLayout>
      <PricingSection />
      <FaqAccordion />
    </MarketingLayout>
  );
}
