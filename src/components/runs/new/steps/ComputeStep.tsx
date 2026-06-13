"use client";

import { useEffect, useRef } from "react";
import { ComputeRing } from "../ComputeRing";
import { ComputeStageTracker } from "../ComputeStageTracker";
import { useRunWizard } from "../RunWizardContext";
import { useApiSession } from "@/hooks/use-api-session";
import { executeRun, fetchRun } from "@/lib/api/runs";
import { mapEngineProgress, mapRunListItem } from "@/lib/api/mappers";

const POLL_INTERVAL_MS = 2_000;
const COMPUTE_TIMEOUT_MS = 8 * 60 * 1000;
const MAX_POLL_FAILURES = 5;

export function ComputeStep() {
  const { state, dispatch } = useRunWizard();
  const { token, tenantId } = useApiSession();
  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  function clearTimers() {
    if (pollRef.current)    clearInterval(pollRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }

  function goToFailure(stage: string, message: string) {
    clearTimers();
    dispatch({ type: "SET_FAILURE", details: { stage, message, ref: "—" } });
    setTimeout(() => dispatch({ type: "GO_TO_STEP", step: "failure" }), 0);
  }

  useEffect(() => {
    if (startedRef.current || !state.runId || !token || !tenantId) return;
    startedRef.current = true;

    dispatch({ type: "SET_COMPUTE_PROGRESS", pct: 0 });

    // Kick off the engine — surface any error immediately
    executeRun(token, tenantId, state.runId).catch((err: unknown) => {
      goToFailure(
        "execute",
        err instanceof Error
          ? err.message
          : "Failed to start computation. Check that all three files are uploaded and validated.",
      );
    });

    // Absolute timeout — if nothing finishes in 8 min, tell the user
    timeoutRef.current = setTimeout(() => {
      goToFailure(
        "timeout",
        "Computation exceeded 8 minutes. The Celery worker may be down — run: make worker in the server terminal.",
      );
    }, COMPUTE_TIMEOUT_MS);

    // Poll for status
    let failedPolls = 0;

    pollRef.current = setInterval(async () => {
      if (!state.runId || !token || !tenantId) return;
      try {
        const raw = await fetchRun(token, tenantId, state.runId);
        failedPolls = 0;

        const stages = mapEngineProgress(raw.engine_progress ?? null);
        dispatch({ type: "SET_COMPUTE_STAGES", stages });

        const doneCount   = stages.filter((s) => s.status === "done").length;
        const activeCount = stages.filter((s) => s.status === "active").length;
        const pct = Math.min(99, Math.round(((doneCount + activeCount * 0.5) / stages.length) * 100));
        dispatch({ type: "SET_COMPUTE_PROGRESS", pct });

        if (raw.status === "complete") {
          clearTimers();
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
          clearTimers();
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
        failedPolls++;
        if (failedPolls >= MAX_POLL_FAILURES) {
          goToFailure("polling", "Lost connection while monitoring compute progress. Check your network.");
        }
      }
    }, POLL_INTERVAL_MS);

    return () => clearTimers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasStarted = state.computeStages.some(
    (s) => s.status === "active" || s.status === "done",
  );

  return (
    <div className="run-card">
      <div className="compute-wrap">
        <ComputeRing progress={state.computeProgress} />
        <h2 style={{ fontSize: "var(--fs-h2)" }}>Computing your ECL</h2>
        <p className="rc-sub" style={{ marginTop: 6 }}>
          {hasStarted
            ? "This usually takes under a minute for a portfolio this size."
            : "Queued — waiting for a compute worker to pick up the job…"}
        </p>
        <ComputeStageTracker stages={state.computeStages} />
      </div>
    </div>
  );
}
