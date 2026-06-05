"use client";

import { useEffect, useRef } from "react";
import { ComputeRing } from "../ComputeRing";
import { ComputeStageTracker } from "../ComputeStageTracker";
import { useRunWizard } from "../RunWizardContext";
import { useApiSession } from "@/hooks/use-api-session";
import { executeRun, fetchRun } from "@/lib/api/runs";
import { mapEngineProgress, mapRunListItem } from "@/lib/api/mappers";

const POLL_INTERVAL_MS = 2_000;

export function ComputeStep() {
  const { state, dispatch } = useRunWizard();
  const { token, tenantId } = useApiSession();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current || !state.runId || !token || !tenantId) return;
    startedRef.current = true;

    dispatch({ type: "SET_COMPUTE_PROGRESS", pct: 0 });

    // Kick off the engine
    executeRun(token, tenantId, state.runId).catch(() => {});

    // Poll for status
    pollRef.current = setInterval(async () => {
      if (!state.runId || !token || !tenantId) return;
      try {
        const raw = await fetchRun(token, tenantId, state.runId);

        const stages = mapEngineProgress(raw.engine_progress ?? null);
        dispatch({ type: "SET_COMPUTE_STAGES", stages });

        const doneCount = stages.filter((s) => s.status === "done").length;
        const pct = Math.min(99, Math.round((doneCount / stages.length) * 100));
        dispatch({ type: "SET_COMPUTE_PROGRESS", pct });

        if (raw.status === "complete") {
          clearInterval(pollRef.current!);
          dispatch({ type: "SET_COMPUTE_PROGRESS", pct: 100 });
          const item = mapRunListItem(raw);
          dispatch({
            type: "SET_RESULT",
            result: {
              id: item.id,
              fullId: item.fullId,
              totalEcl: item.eclAmount ?? 0,
              coverageRatio: item.coverage ?? "—",
              currency: item.currency,
            },
          });
          setTimeout(() => dispatch({ type: "GO_TO_STEP", step: "success" }), 500);
        } else if (raw.status === "failed") {
          clearInterval(pollRef.current!);
          dispatch({
            type: "SET_FAILURE",
            details: {
              stage: raw.failure_stage ?? "unknown",
              message: raw.failure_message ?? "An unexpected error occurred.",
              ref: raw.failure_ref ?? "—",
            },
          });
          setTimeout(() => dispatch({ type: "GO_TO_STEP", step: "failure" }), 300);
        }
      } catch {
        // transient — keep polling
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="run-card">
      <div className="compute-wrap">
        <ComputeRing progress={state.computeProgress} />
        <h2 style={{ fontSize: "var(--fs-h2)" }}>Computing your ECL</h2>
        <p className="rc-sub" style={{ marginTop: 6 }}>
          This usually takes under a minute for a portfolio this size.
        </p>
        <ComputeStageTracker stages={state.computeStages} />
      </div>
    </div>
  );
}
