import { NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  hashAdminPassword,
  getAdminUserFromRequest,
} from "../../../../lib/admin";
import clientPromise from "../../../../lib/mongodb";

export async function POST(request: Request) {
  try {
    const username = getAdminUserFromRequest(request);
    if (!username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || typeof currentPassword !== "string") {
      return NextResponse.json(
        { error: "Current password is required" },
        { status: 400 }
      );
    }
    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Verify current password against stored credentials
    const valid = await verifyAdminCredentials(username, currentPassword);
    if (!valid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Hash new password and persist to MongoDB admin_settings collection
    const newHash = hashAdminPassword(newPassword);
    const client = await clientPromise;
    const db = client.db("Portfiolo");
    await db.collection("admin_settings").updateOne(
      { key: "password" },
      { $set: { key: "password", username: username, hash: newHash } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}
