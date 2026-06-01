"use client";

import { Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWizard } from "./WizardContext";
import { saveAndExitAction } from "@/app/actions/onboarding";

export function SkipModal() {
  const { state, dispatch } = useWizard();
  const isSkip = state.skipModalOpen;
  const isRequired = state.requiredModalOpen;
  const open = isSkip || isRequired;

  function close() {
    dispatch({ type: "CLOSE_MODAL" });
  }

  async function handleSaveAndExit() {
    dispatch({ type: "FINISH_DONE", variant: "saved" });
    close();
    await saveAndExitAction();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && close()}>
      <DialogContent
        className="max-w-[440px] gap-0 p-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {isSkip && (
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.24 }}
          >
            <div
              className="size-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
            >
              <Clock className="size-5" />
            </div>
            <DialogHeader className="text-left mb-0 p-0">
              <DialogTitle style={{ fontSize: "var(--fs-h2)", color: "var(--text)" }}>
                Save and finish later?
              </DialogTitle>
              <DialogDescription
                className="mt-2"
                style={{ color: "var(--text-muted)", lineHeight: 1.55 }}
              >
                Your progress is saved. You&apos;ll see a reminder on your dashboard,
                and your team can&apos;t run ECLs until setup is complete.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2.5 mt-6">
              <Button variant="secondary" className="flex-1" onClick={close}>
                Keep setting up
              </Button>
              <Button className="flex-1" onClick={handleSaveAndExit}>
                Save and exit
              </Button>
            </div>
          </motion.div>
        )}

        {isRequired && (
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.24 }}
          >
            <div
              className="size-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "var(--warning-subtle)", color: "var(--warning)" }}
            >
              <AlertTriangle className="size-5" />
            </div>
            <DialogHeader className="text-left mb-0 p-0">
              <DialogTitle style={{ fontSize: "var(--fs-h2)", color: "var(--text)" }}>
                A little more is required
              </DialogTitle>
              <DialogDescription
                className="mt-2"
                style={{ color: "var(--text-muted)", lineHeight: 1.55 }}
              >
                You need at least one segment and one collateral type before your
                workspace can run an ECL. You can skip team invites, but not these.
              </DialogDescription>
            </DialogHeader>
            <Button className="w-full mt-6" onClick={close}>
              Finish required steps
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
