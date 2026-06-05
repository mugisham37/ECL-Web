"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFormError } from "@/components/auth/AuthFormError";
import { mfaAction, type AuthFormState } from "@/app/actions/auth";

interface MfaFormProps {
  challengeToken: string;
}

export function MfaForm({ challengeToken }: MfaFormProps) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    mfaAction,
    undefined,
  );

  const hasError = !!state?.error;

  return (
    <AuthCard shake={hasError} key={state?.error}>
      <h2
        className="font-semibold"
        style={{ fontSize: "var(--fs-h1)", letterSpacing: "-0.01em", color: "var(--text)" }}
      >
        Two-factor authentication
      </h2>
      <p
        className="text-sm mt-2"
        style={{ color: "var(--text-muted)" }}
      >
        Enter the 6-digit code from your authenticator app.
      </p>

      <form action={action} className="flex flex-col gap-4 mt-6">
        <input type="hidden" name="challengeToken" value={challengeToken} />

        <AuthFormError message={state?.error} />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="code" style={{ fontWeight: 500, color: "var(--text)" }}>
            Authentication code
          </Label>
          <Input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            disabled={pending}
            required={false}
            style={{ letterSpacing: "0.25em", textAlign: "center", fontSize: "var(--fs-h2)" }}
          />
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
              Verifying…
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </form>

      <p className="text-center mt-5 text-sm" style={{ color: "var(--text-muted)" }}>
        <Link
          href="/sign-in"
          className="font-medium no-underline hover:underline"
          style={{ color: "var(--accent)" }}
        >
          Back to sign in
        </Link>
      </p>
    </AuthCard>
  );
}
