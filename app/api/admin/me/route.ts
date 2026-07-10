import { NextResponse } from "next/server";
import { getAdminUserFromRequest } from "../../../../lib/admin";

export async function GET(request: Request) {
  const username = getAdminUserFromRequest(request);
  if (!username) {
    return NextResponse.json({ ok: false, authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true, authenticated: true, user: username });
}
