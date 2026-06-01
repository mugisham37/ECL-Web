"use client";

import { useEffect, useRef } from "react";
import { ComputeRing } from "../ComputeRing";
import { ComputeStageTracker } from "../ComputeStageTracker";
import { useRunWizard } from "../RunWizardContext";
import { DEFAULT_COMPUTE_STAGES } from "@/lib/new-run-types";
import type { ComputeStage } from "@/lib/new-run-types";

export function ComputeStep() {
  const { state, dispatch } = useRunWizard();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Reset stages
    const stages: ComputeStage[] = DEFAULT_COMPUTE_STAGES.map((s) => ({ ...s, status: "pending" }));
    stages[0] = { ...stages[0], status: "active" };
    dispatch({ type: "SET_COMPUTE_STAGES", stages: [...stages] });
    dispatch({ type: "SET_COMPUTE_PROGRESS", pct: 0 });

    const total = DEFAULT_COMPUTE_STAGES.reduce((acc, s) => acc + s.durationMs, 0);
    let elapsed = 0;

    // Tick progress every 100ms
    const tick = setInterval(() => {
      elapsed += 100;
      const pct = Math.min(99, Math.round((elapsed / total) * 100));
      dispatch({ type: "SET_COMPUTE_PROGRESS", pct });
    }, 100);

    // Sequence stages
    let stageElapsed = 0;
    DEFAULT_COMPUTE_STAGES.forEach((s, idx) => {
      const t = setTimeout(() => {
        const updated: ComputeStage[] = DEFAULT_COMPUTE_STAGES.map((ss, i) => ({
          ...ss,
          status:
            i < idx + 1 ? "done" :
            i === idx + 1 ? "active" :
            "pending",
          elapsed: i < idx + 1 ? `${(ss.durationMs / 1000).toFixed(1)}s` : undefined,
        }));
        dispatch({ type: "SET_COMPUTE_STAGES", stages: updated });
      }, stageElapsed + s.durationMs);
      timersRef.current.push(t);
      stageElapsed += s.durationMs;
    });

    // Finish
    const finishTimer = setTimeout(() => {
      clearInterval(tick);
      dispatch({ type: "SET_COMPUTE_PROGRESS", pct: 100 });
      const done: ComputeStage[] = DEFAULT_COMPUTE_STAGES.map((s) => ({
        ...s, status: "done",
        elapsed: `${(s.durationMs / 1000).toFixed(1)}s`,
      }));
      dispatch({ type: "SET_COMPUTE_STAGES", stages: done });

      setTimeout(() => {
        dispatch({
          type: "SET_RESULT",
          result: { id: "c81a…77fe", fullId: "c81a4f9d-2c1b-4e77-9a3f-771afe2c77fe", totalEcl: 1284500, coverageRatio: "2.41%", currency: "KES" },
        });
        dispatch({ type: "GO_TO_STEP", step: "success" });
      }, 500);
    }, total);

    timersRef.current.push(finishTimer);

    return () => {
      clearInterval(tick);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
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
