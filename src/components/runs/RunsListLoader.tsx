"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useAuthedQuery } from "@/hooks/use-authed-query";
import { fetchRuns } from "@/lib/api/runs";
import { mapRunListItem } from "@/lib/api/mappers";
import { RunsListView } from "./RunsListView";
import { SkeletonBlock } from "@/components/dashboard/shared/SkeletonBlock";
import { BackendUnavailableNotice } from "@/components/shared/BackendUnavailableNotice";

const RUNS_PER_PAGE = 50;

export function RunsListLoader() {
  const { data: session, status: sessionStatus } = useSession();
  const tenantName = session?.user?.tenantName ?? "Workspace";
  const currency = session?.user?.currency ?? "USD";
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useAuthedQuery(
    ["runs-list", session?.user?.tenantId, page],
    (token, tenantId) => fetchRuns(token, tenantId, { per_page: RUNS_PER_PAGE, page }),
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
  const total = data?.meta?.total ?? runs.length;
  const totalPages = Math.max(1, Math.ceil(total / RUNS_PER_PAGE));

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
      <RunsListView
        runs={runs}
        tenantName={tenantName}
        currency={currency}
        page={page}
        totalPages={totalPages}
        totalCount={total}
        onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
        onNextPage={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
    </>
  );
}
