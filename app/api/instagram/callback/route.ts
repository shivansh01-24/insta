import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { handleOAuthCallback } from "@/services/instagram.service";
import { logEvent } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorReason = searchParams.get("error_reason");
  const errorDescription = searchParams.get("error_description");

  const baseUrl = request.nextUrl.origin;

  if (error || errorReason) {
    const message = errorDescription || errorReason || "Meta OAuth permission was denied or cancelled.";
    logEvent("warn", {
      event: "OAUTH_FAILURE",
      details: { error, errorReason, errorDescription },
    });
    return NextResponse.redirect(new URL(`/dashboard?error=${encodeURIComponent(message)}`, baseUrl));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL(`/dashboard?error=${encodeURIComponent("Missing authorization code or state token from Meta.")}`, baseUrl));
  }

  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Your session expired. Please log in again to complete connection.")}`, baseUrl));
  }

  try {
    await handleOAuthCallback(session.userId, code, state);
    return NextResponse.redirect(new URL("/dashboard?success=instagram_connected", baseUrl));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to connect Instagram account";
    return NextResponse.redirect(new URL(`/dashboard?error=${encodeURIComponent(message)}`, baseUrl));
  }
}
