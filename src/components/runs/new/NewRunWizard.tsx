"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { RunWizardProvider, useRunWizard, canContinueFrom, isUploadReady } from "./RunWizardContext";
import { RunWizardHeader } from "./RunWizardHeader";
import { RunWizardStepper } from "./RunWizardStepper";
import { RunWizardFooter } from "./RunWizardFooter";
import { WizardCancelModal } from "./WizardCancelModal";
import { UploadStep } from "./steps/UploadStep";
import { ValidateStep } from "./steps/ValidateStep";
import { ConfirmStep } from "./steps/ConfirmStep";
import { ComputeStep } from "./steps/ComputeStep";
import { SuccessTerminal } from "./steps/SuccessTerminal";
import { FailureTerminal } from "./steps/FailureTerminal";
import { stepIndex } from "@/lib/new-run-types";
import type { NewRunStep } from "@/lib/new-run-types";
import { useApiSession } from "@/hooks/use-api-session";
import { deleteRun } from "@/lib/api/runs";

// ── Step component map ─────────────────────────────────────────────────────

const STEP_COMPONENTS: Record<NewRunStep, React.ComponentType> = {
  upload:   UploadStep,
  validate: ValidateStep,
  confirm:  ConfirmStep,
  compute:  ComputeStep,
  success:  SuccessTerminal,
  failure:  FailureTerminal,
};

// ── Motion variants for directional slide ──────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 18 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -18 }),
};

// ── Inner component (reads context) ───────────────────────────────────────

function ReviewerRedirect() {
  const router = useRouter();
  const { role, isLoading } = useApiSession();

  useEffect(() => {
    if (!isLoading && role === "reviewer") {
      router.replace("/runs");
    }
  }, [role, isLoading, router]);

  return null;
}

function WizardInner() {
  const { state, dispatch } = useRunWizard();
  const router = useRouter();
  const { token, tenantId } = useApiSession();

  const { step, prevStep, cancelModalOpen, runName } = state;

  const isTerminal = step === "success" || step === "failure";
  const isCompute  = step === "compute";
  const showFooter = !isTerminal && !isCompute;
  const terminalState: "success" | "failure" | null =
    step === "success" ? "success" : step === "failure" ? "failure" : null;

  // +1 = forward (slide content left), -1 = backward (slide content right)
  const direction = stepIndex(step) >= stepIndex(prevStep) ? 1 : -1;

  // ── Navigation handlers ────────────────────────────────────────────────

  function handleNext() {
    if (step === "upload")    dispatch({ type: "GO_TO_STEP", step: "validate" });
    else if (step === "validate") dispatch({ type: "GO_TO_STEP", step: "confirm" });
    else if (step === "confirm")  dispatch({ type: "GO_TO_STEP", step: "compute" });
  }

  function handleBack() {
    if (step === "validate") dispatch({ type: "GO_TO_STEP", step: "upload" });
    else if (step === "confirm")  dispatch({ type: "GO_TO_STEP", step: "validate" });
  }

  function handleCancel() {
    dispatch({ type: "OPEN_CANCEL_MODAL" });
  }

  function handleDiscard() {
    dispatch({ type: "CLOSE_CANCEL_MODAL" });
    // Delete the draft run in the background — fire and forget
    if (state.runId && token && tenantId) {
      deleteRun(token, tenantId, state.runId).catch(() => {});
    }
    router.push("/runs");
  }

  function handleKeep() {
    dispatch({ type: "CLOSE_CANCEL_MODAL" });
  }

  const StepComponent = STEP_COMPONENTS[step];

  return (
    <>
      {/* Header — always visible */}
      <RunWizardHeader runName={runName} onExit={handleCancel} />

      {/* Stepper — always visible (handles done/error terminal state) */}
      <RunWizardStepper currentStep={step} terminalState={terminalState} />

      {/* Active step with directional slide transition */}
      <div className="run-stage">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer — hidden during compute and terminal screens */}
      {showFooter && (
        <RunWizardFooter
          currentStep={step}
          canContinue={canContinueFrom(state)}
          onBack={handleBack}
          onCancel={handleCancel}
          onNext={handleNext}
        />
      )}

      {/* Cancel confirmation modal */}
      <WizardCancelModal
        open={cancelModalOpen}
        onKeep={handleKeep}
        onDiscard={handleDiscard}
      />
    </>
  );
}

// ── Public export — wraps inner with the state provider ───────────────────

export function NewRunWizard() {
  return (
    <RunWizardProvider>
      <ReviewerRedirect />
      <WizardInner />
    </RunWizardProvider>
  );
}
