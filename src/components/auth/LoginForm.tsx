"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFormError } from "@/components/auth/AuthFormError";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { RememberMe } from "@/components/auth/RememberMe";
import { loginAction, type AuthFormState } from "@/app/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    loginAction,
    undefined
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.error === "MFA_REQUIRED" && state?.challengeToken) {
      router.push(`/sign-in/mfa?t=${encodeURIComponent(state.challengeToken)}`);
    }
  }, [state, router]);

  const hasError = !!state?.error && state.error !== "MFA_REQUIRED";

  return (
    <AuthCard shake={hasError} key={state?.error}>
      <h2
        className="font-semibold"
        style={{ fontSize: "var(--fs-h1)", letterSpacing: "-0.01em", color: "var(--text)" }}
      >
        Sign in
      </h2>

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

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          autoComplete="current-password"
          disabled={pending}
        />

        <div className="flex items-center justify-between gap-3">
          <RememberMe />
          <Link
            href="/forgot-password"
            className="text-sm font-medium no-underline whitespace-nowrap hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="w-full mt-1"
        >
          {pending ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="text-center mt-5 text-sm" style={{ color: "var(--text-muted)" }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium no-underline hover:underline"
          style={{ color: "var(--accent)" }}
        >
          Create workspace
        </Link>
      </p>
    </AuthCard>
  );
}
