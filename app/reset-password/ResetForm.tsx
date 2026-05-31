"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Spinner } from "@/app/components/ui/spinner";
import { AuthCard } from "@/app/components/auth/AuthCard";
import { AuthFormError } from "@/app/components/auth/AuthFormError";
import { PasswordInput } from "@/app/components/auth/PasswordInput";
import { PasswordStrength } from "@/app/components/auth/PasswordStrength";
import { resetAction, type AuthFormState } from "@/app/actions/auth";
import { scorePassword } from "@/lib/use-password-strength";

interface ResetFormProps {
  token: string;
}

export function ResetForm({ token }: ResetFormProps) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    resetAction,
    undefined
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const { score, rules } = scorePassword(password);
  const mismatch = confirm.length > 0 && password !== confirm;
  const submitReady =
    score >= 3 && rules.len8 && rules.mix && rules.name && password === confirm && !pending;

  const done = state?.success === true;

  return (
    <AnimatePresence mode="wait">
      {!done ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="w-full"
        >
          <AuthCard>
            <h2
              className="font-semibold"
              style={{ fontSize: "var(--fs-h1)", letterSpacing: "-0.01em", color: "var(--text)" }}
            >
              Set a new password
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              Choose a strong password you don&apos;t use anywhere else.
            </p>

            <form action={action} className="flex flex-col gap-4 mt-6">
              <input type="hidden" name="token" value={token} />
              <AuthFormError message={state?.error} />

              <div className="flex flex-col gap-1">
                <PasswordInput
                  id="password"
                  name="password"
                  label="New password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={pending}
                />
                <PasswordStrength password={password} showRules />
              </div>

              <PasswordInput
                id="confirm"
                name="confirm"
                label="Confirm password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={pending}
                error={mismatch ? "Passwords do not match" : undefined}
              />

              <Button
                type="submit"
                size="lg"
                disabled={!submitReady}
                className="w-full mt-1"
              >
                {pending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Updating…
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </form>
          </AuthCard>
        </motion.div>
      ) : (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="w-full"
        >
          <AuthCard>
            <div className="flex flex-col items-center text-center">
              <div
                className="size-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "var(--success-subtle)", color: "var(--success)" }}
              >
                <CheckCircle className="size-6" />
              </div>
              <h2
                className="font-semibold"
                style={{ fontSize: "var(--fs-h1)", letterSpacing: "-0.01em", color: "var(--text)" }}
              >
                Password updated
              </h2>
              <p className="mt-2 text-sm max-w-[30ch]" style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
                Your password has been changed. You can sign in with it now.
              </p>
              <Button asChild size="lg" className="mt-6 w-full">
                <Link href="/sign-in" className="inline-flex items-center gap-2">
                  Sign in <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </AuthCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
