"use server";

import { OnboardingSchema } from "@/lib/onboarding-schema";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type OnboardingActionState = { error?: string } | undefined;

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

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

  const { profile, segments, collateral, invites } = validated.data;
  const tenantId = session.user.tenantId;

  const body = {
    profile: {
      institution_name: profile.institutionName,
      currency: profile.currency,
      timezone: profile.timezone,
      cadence: profile.cadence,
    },
    segments: segments.map((s) => ({ name: s.name, code: s.code ?? null })),
    collateral: collateral.map((c) => ({
      name: c.name,
      haircut: c.haircut,
      ttr: c.ttr,
    })),
    invites: invites.map((i) => ({ email: i.email, role: i.role })),
  };

  const res = await fetch(
    `${BACKEND_URL}/api/v1/onboarding/${tenantId}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return {
      error:
        (err as Record<string, string>).detail ??
        "Failed to save workspace configuration.",
    };
  }

  redirect("/dashboard");
}

export async function saveAndExitAction(
  progress: Record<string, unknown>
): Promise<void> {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const tenantId = session.user.tenantId;

  await fetch(`${BACKEND_URL}/api/v1/onboarding/${tenantId}/save-progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({ progress }),
  }).catch(() => null); // best-effort save; don't block the redirect

  redirect("/dashboard");
}
