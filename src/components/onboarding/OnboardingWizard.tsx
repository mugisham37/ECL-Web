"use client";

import { useRef, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
import {
  finishOnboardingAction,
  autoSaveProgressAction,
  getOnboardingProgressAction,
} from "@/app/actions/onboarding";
import type { WizardState } from "./WizardContext";

interface WizardInnerProps {
  userName?: string;
  orgName?: string;
}

function WizardInner({ userName, orgName }: WizardInnerProps) {
  const { state, dispatch } = useWizard();
  const { step } = state;
  const formRef = useRef<HTMLFormElement>(null);
  const { update } = useSession();
  const router = useRouter();

  const [submitState, submitAction, pending] = useActionState(finishOnboardingAction, undefined);

  // Redirect to dashboard after successful onboarding, updating the session first.
  // `update` and `router` are intentionally omitted from deps — `update` gets a new
  // reference every time the session changes (Auth.js useCallback with [session] deps),
  // which would re-trigger this effect on every session update and create an infinite loop.
  useEffect(() => {
    if (!submitState?.success) return;
    let active = true;
    async function complete() {
      await update({ isOnboardingComplete: true });
      if (!active) return;
      router.push("/dashboard");
    }
    void complete();
    return () => { active = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitState?.success]);

  // Restore saved progress from backend on first mount
  useEffect(() => {
    async function restoreProgress() {
      const progress = await getOnboardingProgressAction();
      if (!progress) return;
      dispatch({
        type: "RESTORE_PROGRESS",
        data: progress as Partial<Pick<WizardState, "profile" | "segments" | "collateral" | "invites" | "step">>,
      });
    }
    void restoreProgress();
  // Only run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isNumeric = typeof step === "number";
  const stepNum = isNumeric ? (step as number) : -1;
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

    const nextStep = (stepNum + 1) as 1 | 2 | 3 | 4;
    dispatch({ type: "GO_TO_STEP", step: nextStep });

    // Auto-save progress in the background
    void autoSaveProgressAction({
      profile: state.profile,
      segments: state.segments,
      collateral: state.collateral,
      invites: state.invites,
      step: nextStep,
    });
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

              <WizardFooter
                onContinue={handleContinue}
                pending={pending}
                error={submitState?.error}
              />
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
  const { data: session } = useSession();
  const resolvedUserName = userName ?? session?.user?.name ?? "";
  const resolvedOrgName = orgName ?? session?.user?.tenantName ?? "";

  return (
    <WizardProvider initialName={resolvedOrgName}>
      <WizardInner userName={resolvedUserName} orgName={resolvedOrgName} />
    </WizardProvider>
  );
}
