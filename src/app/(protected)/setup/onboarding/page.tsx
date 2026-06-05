import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Set up your workspace — ECL Platform",
};

export default async function OnboardingPage() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <OnboardingWizard
      userName={session.user.name ?? ""}
      orgName={session.user.tenantName ?? ""}
    />
  );
}
