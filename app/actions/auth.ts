"use server";

import { signIn } from "@/auth";
import {
  LoginSchema,
  SignUpSchema,
  ForgotSchema,
  ResetSchema,
  InviteSchema,
} from "@/lib/auth-schema";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

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
    return { error: validated.error.errors[0]?.message ?? "Invalid credentials." };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
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
    return { error: validated.error.errors[0]?.message ?? "Please check your inputs." };
  }

  // TODO: call backend API to create workspace + admin user
  // const result = await createWorkspace(validated.data)
  // if (!result.ok) return { error: result.message }

  redirect("/setup/onboarding");
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
    return { error: validated.error.errors[0]?.message ?? "Please check your inputs." };
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
    return { error: validated.error.errors[0]?.message ?? "Please check your inputs." };
  }

  // TODO: call backend API to activate invite + sign in
  // await activateInvite(validated.data)

  redirect("/dashboard");
}
