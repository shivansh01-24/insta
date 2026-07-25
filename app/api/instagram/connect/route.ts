import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { initiateOAuthConnect } from "@/services/instagram.service";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
  }

  try {
    const oauthUrl = await initiateOAuthConnect(session.userId);
    return NextResponse.redirect(oauthUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to initiate Meta OAuth";
    return NextResponse.redirect(new URL(`/dashboard?error=${encodeURIComponent(message)}`, process.env.NEXTAUTH_URL || "http://localhost:3000"));
  }
}
