"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFormError } from "@/components/auth/AuthFormError";
import { ResendCountdown } from "@/components/auth/ResendCountdown";
import { forgotAction, type AuthFormState } from "@/app/actions/auth";

export function ForgotForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    forgotAction,
    undefined
  );

  const sent = state?.success === true;

  return (
    <AnimatePresence mode="wait">
      {!sent ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="w-full"
        >
          <AuthCard>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1.5 text-sm font-medium no-underline mb-5 hover:underline"
              style={{ color: "var(--text-muted)" }}
            >
              <ArrowLeft className="size-3.5" />
              Back to sign in
            </Link>

            <h2
              className="font-semibold"
              style={{ fontSize: "var(--fs-h1)", letterSpacing: "-0.01em", color: "var(--text)" }}
            >
              Reset your password
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
              Enter the email associated with your account and we&apos;ll send you
              a reset link.
            </p>

            <form action={action} className="flex flex-col gap-4 mt-6">
              <AuthFormError message={state?.error} />

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" style={{ fontWeight: 500, color: "var(--text)" }}>
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="you@savannabank.co.ke"
                  disabled={pending}
                  required={false}
                />
              </div>

              <Button type="submit" size="lg" disabled={pending} className="w-full">
                {pending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Sending…
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          </AuthCard>
        </motion.div>
      ) : (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="w-full"
        >
          <AuthCard>
            <div className="flex flex-col items-center text-center">
              <div
                className="size-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
              >
                <Mail className="size-6" />
              </div>
              <h2
                className="font-semibold"
                style={{ fontSize: "var(--fs-h1)", letterSpacing: "-0.01em", color: "var(--text)" }}
              >
                Check your email
              </h2>
              <p className="mt-2 text-sm max-w-[32ch]" style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
                We&apos;ve sent a reset link to{" "}
                <strong style={{ color: "var(--text)" }}>{state?.email}</strong>.
                {" "}The link expires in 1 hour.
              </p>

              <ResendCountdown onResend={() => {}} />

              <Link
                href="/sign-in"
                className="inline-flex items-center gap-1.5 text-sm font-medium no-underline mt-5 hover:underline"
                style={{ color: "var(--text-muted)" }}
              >
                <ArrowLeft className="size-3.5" />
                Back to sign in
              </Link>
            </div>
          </AuthCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
