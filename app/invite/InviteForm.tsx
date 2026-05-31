"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Spinner } from "@/app/components/ui/spinner";
import { AuthCard } from "@/app/components/auth/AuthCard";
import { AuthFormError } from "@/app/components/auth/AuthFormError";
import { PasswordInput } from "@/app/components/auth/PasswordInput";
import { PasswordStrength } from "@/app/components/auth/PasswordStrength";
import { TermsCheckbox } from "@/app/components/auth/TermsCheckbox";
import { inviteAction, type AuthFormState } from "@/app/actions/auth";
import { scorePassword } from "@/lib/use-password-strength";

interface InviteFormProps {
  token: string;
  orgName: string;
  inviterName: string;
}

export function InviteForm({ token, orgName, inviterName }: InviteFormProps) {
  const router = useRouter();
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    inviteAction,
    undefined
  );
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const forbidden = [name.split(/\s+/)[0], orgName.toLowerCase()].filter(Boolean);
  const { score, rules } = scorePassword(password, forbidden);
  const mismatch = confirm.length > 0 && password !== confirm;
  const submitReady =
    name.trim().length >= 2 &&
    score >= 3 &&
    rules.len8 &&
    password === confirm &&
    termsChecked &&
    !pending;

  // After successful Server Action, the redirect happens server-side.
  // Show a brief "redirecting" state before next-auth session kicks in.
  useEffect(() => {
    if (state?.success) {
      setRedirecting(true);
      const t = setTimeout(() => router.push("/dashboard"), 1500);
      return () => clearTimeout(t);
    }
  }, [state?.success, router]);

  const done = redirecting;

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
            <div
              className="text-xs font-medium uppercase tracking-widest mb-4"
              style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}
            >
              You&apos;ve been invited by{" "}
              <strong style={{ color: "var(--text-muted)" }}>{inviterName}</strong>
            </div>

            <h2
              className="font-semibold"
              style={{ fontSize: "var(--fs-h1)", letterSpacing: "-0.01em", color: "var(--text)" }}
            >
              Join {orgName}
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              Create your account to get started.
            </p>

            <form action={action} className="flex flex-col gap-4 mt-6">
              <input type="hidden" name="token" value={token} />
              <AuthFormError message={state?.error} />

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" style={{ fontWeight: 500, color: "var(--text)" }}>
                  Full name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Tendai Mwangi"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={pending}
                  required={false}
                />
              </div>

              <div className="flex flex-col gap-1">
                <PasswordInput
                  id="password"
                  name="password"
                  label="Password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={pending}
                />
                <PasswordStrength password={password} forbidden={forbidden} />
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

              <TermsCheckbox onCheckedChange={setTermsChecked} />

              <Button
                type="submit"
                size="lg"
                disabled={!submitReady}
                className="w-full mt-1"
              >
                {pending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Joining…
                  </>
                ) : (
                  "Accept invite and sign in"
                )}
              </Button>
            </form>

            <p className="text-center mt-5 text-sm" style={{ color: "var(--text-muted)" }}>
              Wrong account?{" "}
              <Link
                href="/sign-in"
                className="font-medium no-underline hover:underline"
                style={{ color: "var(--accent)" }}
              >
                Sign in instead
              </Link>
            </p>
          </AuthCard>
        </motion.div>
      ) : (
        <motion.div
          key="success"
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
                Welcome to {orgName}
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                Your account is ready.
              </p>
              <div className="flex items-center gap-2 mt-5" style={{ color: "var(--text-muted)" }}>
                <Spinner size="sm" />
                <span className="text-sm">Taking you to your dashboard…</span>
              </div>
            </div>
          </AuthCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
