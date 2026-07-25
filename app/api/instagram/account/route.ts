import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getConnectedInstagramAccount } from "@/services/instagram.service";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const account = await getConnectedInstagramAccount(session.userId);
    return NextResponse.json({ account });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch Instagram account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
