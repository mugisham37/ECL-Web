import type { Metadata } from "next";
import { ResultsExplorer } from "@/components/results/ResultsExplorer";

export const metadata: Metadata = {
  title: "Results — ECL Platform",
};

export default function ResultsPage() {
  return <ResultsExplorer />;
}
