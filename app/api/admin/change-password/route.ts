import { NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  hashAdminPassword,
  getAdminUserFromRequest,
} from "../../../../lib/admin";

export async function POST(request: Request) {
  try {
    const username = getAdminUserFromRequest(request);
    if (!username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || typeof currentPassword !== "string") {
      return NextResponse.json({ error: "Current password is required" }, { status: 400 });
    }
    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
    }

    const valid = await verifyAdminCredentials(username, currentPassword);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    const newHash = hashAdminPassword(newPassword);

    console.log(
      `[Password Change] New hash for "${username}": ${newHash}\n` +
        `Add this to your environment variables as ADMIN_PASSWORD_HASH to persist.\n` +
        `(Without it, the default ADMIN_PASSWORD will be used on next restart.)`
    );

    return NextResponse.json({
      ok: true,
      message:
        "Password updated for this session. To make it permanent, set ADMIN_PASSWORD_HASH in your environment variables.",
    });
  } catch {
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
