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
  | { error?: string; success?: boolean; email?: string }
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
      switch (e.type) {
        case "CredentialsSignin":
          return { error: "Email or password incorrect." };
        case "CallbackRouteError":
          return { error: "Sign-in failed. Please try again." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
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

  // TODO: call backend API to send reset email
  // await sendPasswordResetEmail(validated.data.email)

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

  // TODO: call backend API to verify token + update password
  // const result = await resetPassword(validated.data.token, validated.data.password)
  // if (!result.ok) return { error: 'This link has expired.' }

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

  // TODO: call backend API to activate invite + sign in
  // await activateInvite(validated.data)

  redirect("/dashboard");
}
