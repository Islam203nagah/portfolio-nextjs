import { NextResponse } from "next/server";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import {
  verifyAdminCredentials,
  hashAdminPassword,
  getAdminUserFromRequest,
} from "../../../../lib/admin";

const PASSWORD_FILE = join(process.cwd(), "data", "password.json");

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

    // Persist to data/password.json
    try {
      writeFileSync(PASSWORD_FILE, JSON.stringify({ hash: newHash }, null, 2) + "\n", "utf-8");
    } catch {
      // read-only filesystem (Vercel) — skip
    }

    return NextResponse.json({
      ok: true,
      message: "Password updated successfully.",
    });
  } catch {
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
