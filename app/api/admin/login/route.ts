import { NextResponse } from "next/server";
import {
  createSession,
  verifyAdminCredentials,
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  ACCESS_TOKEN_TTL_MS,
  REFRESH_TOKEN_TTL_MS,
} from "../../../../lib/admin";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!(await verifyAdminCredentials(username, password))) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    const { accessToken, refreshToken } = createSession(username);
    const response = NextResponse.json({ ok: true, message: "Signed in successfully" });

    response.cookies.set({
      name: ACCESS_COOKIE_NAME,
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(ACCESS_TOKEN_TTL_MS / 1000),
    });

    response.cookies.set({
      name: REFRESH_COOKIE_NAME,
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(REFRESH_TOKEN_TTL_MS / 1000),
    });

    return response;
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json({ ok: false, error: "Login failed" }, { status: 500 });
  }
}
