"use server";

import { signIn } from "@/lib/auth";
import {
  LoginSchema,
  SignUpSchema,
  ForgotSchema,
  ResetSchema,
  InviteSchema,
} from "@/lib/auth-schema";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export type AuthFormState =
  | { error?: string; success?: boolean; email?: string; challengeToken?: string }
  | undefined;

// Helper: parse checkbox value from FormData (value is "on" or null)
function parseBool(val: FormDataEntryValue | null): boolean {
  return val === "on" || val === "true";
}

export async function loginAction(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
    remember: parseBool(formData.get("remember")),
  };

  const validated = LoginSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Invalid credentials." };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      remember: String(validated.data.remember),
      redirectTo: "/dashboard",
    });
  } catch (e) {
    if (e instanceof AuthError) {
      if (e.type === "CallbackRouteError") {
        const cause = (e as unknown as { cause?: { err?: Error } }).cause?.err;
        const msg = cause?.message ?? "";
        if (msg.startsWith("MFA_REQUIRED:")) {
          return { error: "MFA_REQUIRED", challengeToken: msg.slice("MFA_REQUIRED:".length) };
        }
        return { error: "Sign-in failed. Please try again." };
      }
      if (e.type === "CredentialsSignin") {
        return { error: "Email or password incorrect." };
      }
      return { error: "Something went wrong. Please try again." };
    }
    throw e;
  }
}

export async function mfaAction(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const challengeToken = formData.get("challengeToken") as string | null;
  const code = formData.get("code") as string | null;
  if (!challengeToken || !code) return { error: "Invalid request." };

  try {
    await signIn("mfa-credentials", {
      challengeToken,
      code,
      redirectTo: "/dashboard",
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: "Invalid or expired code. Try again." };
    }
    throw e;
  }
}

export async function signUpAction(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    companyName: formData.get("companyName"),
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
    terms: parseBool(formData.get("terms")),
  };

  const validated = SignUpSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Please check your inputs." };
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      company_name: validated.data.companyName,
      email: validated.data.email,
      name: validated.data.name,
      password: validated.data.password,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const detail = (err as Record<string, string>).detail;
    if (detail?.toLowerCase().includes("email")) {
      return { error: "An account with this email already exists." };
    }
    return { error: detail ?? "Registration failed. Please try again." };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirectTo: "/setup/onboarding",
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: "Registration succeeded but sign-in failed. Please log in." };
    }
    throw e;
  }
}

export async function forgotAction(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = { email: formData.get("email") };
  const validated = ForgotSchema.safeParse(raw);
  if (!validated.success) {
    return { error: "Please enter a valid email address." };
  }

  await fetch(`${BACKEND_URL}/api/v1/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: validated.data.email }),
  }).catch(() => {});

  // Always succeed — do not reveal email existence
  return { success: true, email: validated.data.email };
}

export async function resetAction(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    token: formData.get("token"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  };

  const validated = ResetSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Please check your inputs." };
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: validated.data.token, password: validated.data.password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const code = (err as Record<string, string>).code ?? "";
    if (code === "TOKEN_EXPIRED" || code === "TOKEN_INVALID") {
      return { error: "This link has expired. Request a new one." };
    }
    return { error: "Password reset failed. Please try again." };
  }

  return { success: true };
}

export async function inviteAction(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    token: formData.get("token"),
    name: formData.get("name"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
    terms: parseBool(formData.get("terms")),
  };

  const validated = InviteSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Please check your inputs." };
  }

  // Validate the invite token first
  const validateRes = await fetch(
    `${BACKEND_URL}/api/v1/invites/validate/${encodeURIComponent(validated.data.token)}`,
  );
  if (!validateRes.ok) {
    return { error: "Invalid or expired invite link." };
  }

  // Accept the invite (creates account)
  const acceptRes = await fetch(`${BACKEND_URL}/api/v1/invites/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: validated.data.token,
      name: validated.data.name,
      password: validated.data.password,
    }),
  });

  if (!acceptRes.ok) {
    const err = await acceptRes.json().catch(() => ({}));
    return { error: (err as Record<string, string>).detail ?? "Failed to activate your account. Please try again." };
  }

  redirect("/sign-in?activated=1");
}
