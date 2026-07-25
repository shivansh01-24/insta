import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { logEvent } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === env.META_WEBHOOK_VERIFY_TOKEN) {
    logEvent("info", {
      event: "WEBHOOK_VERIFY",
      details: { status: "verification_successful" },
    });
    return new NextResponse(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
  }

  logEvent("warn", {
    event: "WEBHOOK_VERIFY",
    details: { status: "verification_failed", reason: "Token mismatch or invalid mode" },
  });
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    logEvent("info", {
      event: "WEBHOOK_EVENT",
      details: { object: payload?.object || "unknown" },
    });
    return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
  } catch {
    return NextResponse.json({ status: "INVALID_PAYLOAD" }, { status: 200 });
  }
}
