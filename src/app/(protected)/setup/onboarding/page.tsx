import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set up your workspace — ECL Platform",
};

export default async function OnboardingPage() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const userName = session.user?.name ?? "Administrator";
  const orgName = session.user?.name?.split(" ")[0] ?? "your institution";

  return (
    <OnboardingWizard
      userName={userName}
      orgName={orgName}
    />
  );
}
