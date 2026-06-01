import type { Metadata } from "next";
import { RunsListView } from "@/components/runs/RunsListView";
import { MOCK_RUNS_LIST } from "@/lib/runs-mock";

export const metadata: Metadata = {
  title: "Runs — ECL Platform",
};

export default function RunsPage() {
  return (
    <RunsListView
      runs={MOCK_RUNS_LIST}
      tenantName="Savanna Bank PLC"
    />
  );
}
