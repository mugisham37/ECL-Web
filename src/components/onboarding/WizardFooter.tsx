"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AnimatePresence, motion } from "framer-motion";
import { useWizard, isStepValid, getStepHint } from "./WizardContext";

interface WizardFooterProps {
  onContinue: () => void;
  pending?: boolean;
  error?: string;
}

export function WizardFooter({ onContinue, pending = false, error }: WizardFooterProps) {
  const { state, dispatch } = useWizard();
  const { step } = state;

  const isNumericStep = typeof step === "number";
  const stepNum = isNumericStep ? (step as number) : -1;
  const isWelcome = step === "welcome";
  const isLastStep = stepNum === 4;
  const canContinue = isStepValid(state, step);
  const hint = !canContinue ? getStepHint(step) : "";

  function handleBack() {
    if (stepNum === 0) dispatch({ type: "GO_TO_STEP", step: "welcome" });
    else if (stepNum > 0) dispatch({ type: "GO_TO_STEP", step: (stepNum - 1) as 0 | 1 | 2 | 3 | 4 });
  }

  if (step === "welcome" || step === "done") return null;

  return (
    <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between gap-3 wizard-footer">
        {/* Back */}
        <Button variant="ghost" size="default" onClick={handleBack}>
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <div className="flex items-center gap-2.5 right-actions">
          {/* Skip (visible on steps 0–3) */}
          {!isLastStep && (
            <Button
              variant="ghost"
              size="default"
              onClick={() => dispatch({ type: "OPEN_SKIP_MODAL" })}
            >
              Skip for now
            </Button>
          )}

          {/* Continue / Finish */}
          <div className="relative">
            <Button
              size="default"
              disabled={!canContinue || pending}
              onClick={onContinue}
              className="gap-1.5"
              style={!canContinue ? { opacity: 0.5, pointerEvents: "none" } : {}}
            >
              {pending ? (
                <>
                  <Spinner size="sm" />
                  {isLastStep ? "Finishing…" : "Working…"}
                </>
              ) : isLastStep ? (
                <>
                  Finish setup
                  <Check className="size-4" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>

            <AnimatePresence>
              {hint && !canContinue && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full mt-1.5 right-0 text-xs whitespace-nowrap"
                  style={{ color: "var(--text-subtle)" }}
                >
                  {hint}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-center text-sm mt-3"
            style={{ color: "var(--destructive, #dc2626)" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 640px) {
          .wizard-footer { flex-direction: column-reverse; align-items: stretch; }
          .right-actions { flex-direction: column-reverse; }
          .wizard-footer .btn, .right-actions .btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
