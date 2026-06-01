import { Check, X } from "lucide-react";
import { STEP_ORDER, stepIndex } from "@/lib/new-run-types";
import type { NewRunStep } from "@/lib/new-run-types";

const STEP_LABELS: Record<string, string> = {
  upload: "Upload",
  validate: "Validate",
  confirm: "Confirm",
  compute: "Compute",
};

interface RunWizardStepperProps {
  currentStep: NewRunStep;
  terminalState?: "success" | "failure" | null;
}

export function RunWizardStepper({ currentStep, terminalState }: RunWizardStepperProps) {
  const curIdx = stepIndex(currentStep);

  return (
    <nav className="run-steps" aria-label="Run wizard progress">
      {STEP_ORDER.map((step, i) => {
        const isActive = i === curIdx && !terminalState;
        const isDone = i < curIdx || (terminalState === "success" && i === 3);
        const isError = terminalState === "failure" && i === 3;

        let cls = "";
        if (isDone) cls = "done";
        else if (isActive) cls = "active";
        else if (isError) cls = "error";

        const markerContent = isDone ? (
          <Check size={13} />
        ) : isError ? (
          <X size={13} />
        ) : (
          i + 1
        );

        return (
          <div key={step} style={{ display: "contents" }}>
            <div className={`rs ${cls}`}>
              <span className="n" aria-hidden="true">{markerContent}</span>
              <span className="lbl-txt">{STEP_LABELS[step]}</span>
            </div>
            {i < STEP_ORDER.length - 1 && (
              <span className={`line${isDone ? " done-line" : ""}`} aria-hidden="true" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
