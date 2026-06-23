"use client";

import { useAuthedQuery } from "@/hooks/use-authed-query";
import { useApiSession } from "@/hooks/use-api-session";
import { fetchRun } from "@/lib/api/runs";
import { mapRunDetail } from "@/lib/api/mappers";
import { RunDetailView } from "./RunDetailView";
import { SkeletonBlock } from "@/components/dashboard/shared/SkeletonBlock";

interface RunDetailLoaderProps {
  runId: string;
}

export function RunDetailLoader({ runId }: RunDetailLoaderProps) {
  const { tenantId } = useApiSession();
  const { data: run, isLoading, error } = useAuthedQuery(
    ["run-detail", tenantId, runId],
    (token, tid) => fetchRun(token, tid, runId).then(mapRunDetail),
    { staleTime: 30_000 },
  );

  if (isLoading || !run) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "32px 0" }}>
        <SkeletonBlock height={48} />
        <SkeletonBlock height={100} />
        <SkeletonBlock height={300} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "48px 0", textAlign: "center", color: "var(--text-muted)" }}>
        <p style={{ fontSize: "var(--fs-h3)", color: "var(--text)", marginBottom: 8 }}>
          Could not load run
        </p>
        <p style={{ fontSize: "var(--fs-body)" }}>
          {error.message ?? "An unexpected error occurred. Check that the API server is running."}
        </p>
      </div>
    );
  }

  return <RunDetailView run={run} />;
}
