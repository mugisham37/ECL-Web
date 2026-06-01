"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWizard } from "./WizardContext";

const STEPS = [
  { key: 0, label: "Profile" },
  { key: 1, label: "Segments" },
  { key: 2, label: "Collateral" },
  { key: 3, label: "Team" },
  { key: 4, label: "Review" },
] as const;

export function StepIndicator() {
  const { state, dispatch } = useWizard();
  const currentStep = typeof state.step === "number" ? state.step : -1;

  return (
    <nav
      aria-label="Setup progress"
      className="flex items-center mb-9 step-indicator"
    >
      {STEPS.map((step, i) => {
        const isDone = currentStep > step.key;
        const isActive = currentStep === step.key;

        return (
          <div key={step.key} className="flex items-center step-indicator-item">
            {/* Pill */}
            <button
              className={cn(
                "flex items-center gap-2 text-xs font-medium whitespace-nowrap transition-all",
                isDone && "cursor-pointer",
                !isDone && !isActive && "cursor-default"
              )}
              style={{
                color: isDone
                  ? "var(--text-muted)"
                  : isActive
                  ? "var(--text)"
                  : "var(--text-subtle)",
                background: "none",
                border: "none",
                padding: 0,
              }}
              onClick={() => isDone && dispatch({ type: "GO_TO_STEP", step: step.key })}
              disabled={!isDone}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className="size-[26px] rounded-full flex items-center justify-center flex-none text-xs transition-all duration-180"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: isDone ? "var(--accent)" : "var(--surface)",
                  border: isDone
                    ? "none"
                    : isActive
                    ? "1.5px solid var(--accent)"
                    : "1.5px solid var(--border-strong)",
                  color: isDone
                    ? "#fff"
                    : isActive
                    ? "var(--accent)"
                    : "var(--text-subtle)",
                  boxShadow: isActive
                    ? "0 0 0 3px var(--accent-subtle)"
                    : "none",
                }}
              >
                {isDone ? <Check className="size-[13px]" /> : i + 1}
              </span>
              <span className="step-label-txt">{step.label}</span>
            </button>

            {/* Connecting line */}
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-[1.5px] mx-2.5 min-w-4 step-line transition-colors duration-180"
                style={{
                  background: isDone ? "var(--accent)" : "var(--border)",
                  minWidth: 16,
                }}
              />
            )}
          </div>
        );
      })}

      <style>{`
        @media (max-width: 1023px) {
          .step-indicator { flex-direction: column; align-items: stretch; gap: 0; margin-bottom: 24px; }
          .step-indicator-item { flex-direction: column; align-items: flex-start; }
          .step-line { width: 1.5px !important; height: 14px; min-width: 0 !important; margin: 0 0 0 12px !important; align-self: flex-start; flex: none !important; }
          .step-label-txt { display: inline; }
        }
        @media (max-width: 640px) {
          .step-label-txt { display: none; }
        }
      `}</style>
    </nav>
  );
}
