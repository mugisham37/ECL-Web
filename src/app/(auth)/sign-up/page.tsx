import { SignUpForm } from "./SignUpForm";
import { AuthLayout } from "@/src/components/auth/AuthLayout";
import { AuthLogo } from "@/src/components/auth/AuthLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create workspace — ECL Platform",
};

export default function SignUpPage() {
  return (
    <AuthLayout wide>
      <AuthLogo />
      <SignUpForm />
    </AuthLayout>
  );
}
