import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RunDetailLoader } from "@/components/runs/RunDetailLoader";

interface RunDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: RunDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Run ${id.slice(0, 8)} — Runs — ECL Platform` };
}

export default async function RunDetailPage({ params }: RunDetailPageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  return <RunDetailLoader runId={id} />;
}
