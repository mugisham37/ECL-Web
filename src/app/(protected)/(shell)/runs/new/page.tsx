import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { NewRunWizard } from "@/components/runs/new/NewRunWizard";
import { createRun } from "@/lib/api/runs";
import { ApiError } from "@/lib/api/client";

export const metadata: Metadata = {
  title: "New Run — ECL Platform",
};

const DEFAULT_RUN_NAME = "May 2026";

export default async function NewRunPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  if (session.user.role === "reviewer") redirect("/runs");

  let initialRunId: string | null = null;
  let initialRunInitError: string | null = null;

  if (!session.user.tenantId || !session.accessToken) {
    initialRunInitError =
      "Your session is missing workspace context. Sign out and sign in again.";
  } else {
    try {
      const raw = await createRun(session.accessToken, session.user.tenantId, {
        name: DEFAULT_RUN_NAME,
        reporting_period: DEFAULT_RUN_NAME,
      });
      initialRunId = raw.fullId ?? raw.id;
    } catch (err: unknown) {
      initialRunInitError =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to start a new run. Check your connection and try again.";
    }
  }

  return (
    <NewRunWizard
      initialRunId={initialRunId}
      initialRunInitError={initialRunInitError}
    />
  );
}
