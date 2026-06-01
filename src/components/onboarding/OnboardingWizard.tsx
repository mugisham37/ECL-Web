"use client";

import { useRef, useActionState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WizardProvider, useWizard, isStepValid } from "./WizardContext";
import { OnboardingLayout } from "./OnboardingLayout";
import { StepIndicator } from "./StepIndicator";
import { WizardFooter } from "./WizardFooter";
import { SkipModal } from "./SkipModal";
import { WelcomeScreen } from "./WelcomeScreen";
import { DoneScreen } from "./DoneScreen";
import { ProfileStep } from "./steps/ProfileStep";
import { SegmentsStep } from "./steps/SegmentsStep";
import { CollateralStep } from "./steps/CollateralStep";
import { TeamStep } from "./steps/TeamStep";
import { ReviewStep } from "./steps/ReviewStep";
import { finishOnboardingAction } from "@/app/actions/onboarding";

interface WizardInnerProps {
  userName?: string;
  orgName?: string;
}

function WizardInner({ userName, orgName }: WizardInnerProps) {
  const { state, dispatch } = useWizard();
  const { step } = state;
  const formRef = useRef<HTMLFormElement>(null);

  const [, submitAction, pending] = useActionState(finishOnboardingAction, undefined);

  const isNumeric = typeof step === "number";
  const stepNum = isNumeric ? (step as number) : -1;
  // Derive slide direction from state (both are plain React state, not refs)
  const prevStepNum = typeof state.prevStep === "number" ? state.prevStep : -1;
  const direction: 1 | -1 = stepNum >= prevStepNum ? 1 : -1;

  function handleContinue() {
    if (!isStepValid(state, step)) return;

    if (stepNum === 4) {
      const payload = JSON.stringify({
        profile: state.profile,
        segments: state.segments,
        collateral: state.collateral,
        invites: state.invites,
      });
      if (formRef.current) {
        const input = formRef.current.querySelector<HTMLInputElement>('[name="payload"]');
        if (input) input.value = payload;
        formRef.current.requestSubmit();
      }
      return;
    }

    dispatch({ type: "GO_TO_STEP", step: (stepNum + 1) as 1 | 2 | 3 | 4 });
  }

  const isWide = step === 4 || step === "welcome";

  return (
    <OnboardingLayout wide={isWide}>
      {/* Hidden form for server action submission */}
      <form ref={formRef} action={submitAction} className="hidden">
        <input type="hidden" name="payload" defaultValue="" />
      </form>

      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <WelcomeScreen key="welcome" userName={userName} orgName={orgName} />
        )}

        {step === "done" && <DoneScreen key="done" />}

        {isNumeric && (
          <motion.div
            key={`step-${stepNum}`}
            initial={{ opacity: 0, x: direction * 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 12 }}
            transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
          >
            {/* Step indicator */}
            <StepIndicator />

            {/* Step card */}
            <motion.div
              layout
              className="rounded-xl"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                padding: "clamp(24px,4vw,40px)",
              }}
            >
              {stepNum === 0 && <ProfileStep />}
              {stepNum === 1 && <SegmentsStep />}
              {stepNum === 2 && <CollateralStep />}
              {stepNum === 3 && <TeamStep />}
              {stepNum === 4 && <ReviewStep />}

              <WizardFooter onContinue={handleContinue} pending={pending} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SkipModal />
    </OnboardingLayout>
  );
}

interface OnboardingWizardProps {
  userName?: string;
  orgName?: string;
}

export function OnboardingWizard({ userName, orgName }: OnboardingWizardProps) {
  return (
    <WizardProvider initialName={orgName ?? ""}>
      <WizardInner userName={userName} orgName={orgName} />
    </WizardProvider>
  );
}
