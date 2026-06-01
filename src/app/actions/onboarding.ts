"use server";

import { OnboardingSchema } from "@/lib/onboarding-schema";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type OnboardingActionState = { error?: string } | undefined;

export async function finishOnboardingAction(
  _state: OnboardingActionState,
  formData: FormData
): Promise<OnboardingActionState> {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const payloadStr = formData.get("payload");
  if (!payloadStr || typeof payloadStr !== "string") {
    return { error: "Missing form data. Please try again." };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(payloadStr);
  } catch {
    return { error: "Invalid form data. Please try again." };
  }

  const validated = OnboardingSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Please complete all required fields." };
  }

  // TODO: call backend API to persist workspace configuration and send team invites
  // const result = await createWorkspaceConfig(session.user.id, validated.data)
  // if (!result.ok) return { error: result.message }

  redirect("/dashboard");
}

export async function saveAndExitAction(): Promise<void> {
  // TODO: call backend API to persist current wizard progress
  redirect("/dashboard");
}
