import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RunDetailView } from "@/components/runs/RunDetailView";
import { getMockRunDetail } from "@/lib/runs-mock";

interface RunDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: RunDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const run = getMockRunDetail(id);
  return { title: run ? `${run.name} — Runs — ECL Platform` : "Run — ECL Platform" };
}

export default async function RunDetailPage({ params }: RunDetailPageProps) {
  const { id } = await params;
  const run = getMockRunDetail(id);
  if (!run) notFound();
  return <RunDetailView run={run} />;
}
