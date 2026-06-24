import { NextResponse } from "next/server";
import { probeBackend } from "@/lib/backend-health";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await probeBackend(process.env.BACKEND_URL);

  return NextResponse.json(
    { ...result, ok: result.reachable },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
