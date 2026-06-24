import type { Metadata } from "next";
import { RunsListLoader } from "@/components/runs/RunsListLoader";

export const metadata: Metadata = {
  title: "Runs — ECL Platform",
};

export default function RunsPage() {
  return <RunsListLoader />;
}
