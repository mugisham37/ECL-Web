"use client";

import { useSession } from "next-auth/react";
import { useAuthedQuery } from "@/hooks/use-authed-query";
import { fetchRuns } from "@/lib/api/runs";
import { mapRunListItem } from "@/lib/api/mappers";
import { RunsListView } from "./RunsListView";
import { SkeletonBlock } from "@/components/dashboard/shared/SkeletonBlock";
import { BackendUnavailableNotice } from "@/components/shared/BackendUnavailableNotice";

export function RunsListLoader() {
  const { data: session, status: sessionStatus } = useSession();
  const tenantName = session?.user?.tenantName ?? "Workspace";

  const { data, isLoading, isError, error, refetch } = useAuthedQuery(
    ["runs-list", session?.user?.tenantId],
    (token, tenantId) => fetchRuns(token, tenantId, { per_page: 50 }),
    { staleTime: 30_000 },
  );

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "32px 0" }}>
        <SkeletonBlock height={48} />
        <SkeletonBlock height={300} />
      </div>
    );
  }

  const runs = isError || !data ? [] : (data.items ?? []).map(mapRunListItem);

  return (
    <>
      {isError && (
        <div style={{ marginBottom: 16 }}>
          <BackendUnavailableNotice
            title="Could not load runs"
            error={error}
            onRetry={() => void refetch()}
          />
        </div>
      )}
      <RunsListView runs={runs} tenantName={tenantName} />
    </>
  );
}
