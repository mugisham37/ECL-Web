import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RunsListView } from "@/components/runs/RunsListView";
import { fetchRuns } from "@/lib/api/runs";
import { mapRunListItem } from "@/lib/api/mappers";

export const metadata: Metadata = {
  title: "Runs — ECL Platform",
};

export default async function RunsPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  try {
    const result = await fetchRuns(session.accessToken, session.user.tenantId, {
      per_page: 50,
    });
    const runs = (result.items ?? []).map(mapRunListItem);
    return (
      <RunsListView
        runs={runs}
        tenantName={session.user.tenantName ?? "Workspace"}
      />
    );
  } catch {
    return (
      <RunsListView
        runs={[]}
        tenantName={session.user.tenantName ?? "Workspace"}
      />
    );
  }
}
