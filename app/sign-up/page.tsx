import { SignUpForm } from "./SignUpForm";
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import { AuthLogo } from "@/app/components/auth/AuthLogo";
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
