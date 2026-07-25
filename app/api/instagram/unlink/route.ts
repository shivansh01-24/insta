import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { unlinkInstagramAccount } from "@/services/instagram.service";

export async function POST() {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await unlinkInstagramAccount(session.userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to unlink account";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
