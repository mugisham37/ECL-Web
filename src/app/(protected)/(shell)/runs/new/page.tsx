import type { Metadata } from "next";
import { NewRunWizard } from "@/components/runs/new/NewRunWizard";

export const metadata: Metadata = {
  title: "New Run — ECL Platform",
};

export default function NewRunPage() {
  return <NewRunWizard />;
}
