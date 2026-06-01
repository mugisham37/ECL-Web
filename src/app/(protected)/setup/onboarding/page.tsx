import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set up your workspace — ECL Platform",
};

export default function OnboardingPage() {
  // Auth check temporarily disabled for visual preview
  return (
    <OnboardingWizard
      userName="Tendai Mwangi"
      orgName="Savanna"
    />
  );
}
