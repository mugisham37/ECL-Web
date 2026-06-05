import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { NewRunWizard } from "@/components/runs/new/NewRunWizard";

export const metadata: Metadata = {
  title: "New Run — ECL Platform",
};

export default async function NewRunPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  if (session.user.role === "reviewer") redirect("/runs");
  return <NewRunWizard />;
}
