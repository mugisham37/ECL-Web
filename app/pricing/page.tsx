import { MarketingLayout } from "@/app/components/marketing/MarketingLayout";
import { PricingSection } from "@/app/components/marketing/PricingSection";
import { FaqAccordion } from "@/app/components/marketing/FaqAccordion";
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
