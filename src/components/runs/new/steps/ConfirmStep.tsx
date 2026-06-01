"use client";

import { useRunWizard } from "../RunWizardContext";
import { ConfirmGrid } from "../ConfirmGrid";

export function ConfirmStep() {
  const { state, dispatch } = useRunWizard();

  return (
    <div className="run-card">
      <h2>Confirm &amp; start</h2>
      <p className="rc-sub">
        Review the run below. Once started, the engine is deterministic — these exact inputs and engine version will always produce the same output.
      </p>
      <ConfirmGrid
        state={state}
        onToggleCombine={(v) => dispatch({ type: "SET_COMBINE_PD", value: v })}
      />
    </div>
  );
}
