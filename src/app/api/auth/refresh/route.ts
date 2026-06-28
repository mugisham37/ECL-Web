import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Server-side refresh proxy: reads the ecl_refresh cookie from the browser,
 * forwards the refresh call to the backend (Vercel → Render), and pipes the
 * rotated Set-Cookie header back so the browser gets the new refresh token.
 *
 * This route is called by the NextAuth jwt callback for proactive server-side
 * token refresh, avoiding the "Access token has expired" flash on page load.
 */
export async function POST(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });
  }

  const refreshCookie = request.cookies.get("ecl_refresh");
  if (!refreshCookie) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${backendUrl.replace(/\/$/, "")}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { Cookie: `ecl_refresh=${refreshCookie.value}` },
    });
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }

  if (!backendRes.ok) {
    return NextResponse.json({ error: "Refresh failed" }, { status: backendRes.status });
  }

  const body = (await backendRes.json()) as { data?: { access_token?: string } };
  const response = NextResponse.json(body);

  // Forward the rotated ecl_refresh cookie from Render back to the browser.
  const setCookieHeader = backendRes.headers.get("set-cookie");
  if (setCookieHeader) {
    response.headers.set("set-cookie", setCookieHeader);
  }

  return response;
}
