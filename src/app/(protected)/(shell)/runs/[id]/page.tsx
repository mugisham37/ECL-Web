import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RunDetailView } from "@/components/runs/RunDetailView";
import { fetchRun } from "@/lib/api/runs";
import { mapRunDetail } from "@/lib/api/mappers";
import { ApiError } from "@/lib/api/client";

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

  try {
    const raw = await fetchRun(session.accessToken, session.user.tenantId, id);
    const run = mapRunDetail(raw);
    return <RunDetailView run={run} />;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    notFound();
  }
}
