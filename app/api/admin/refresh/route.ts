import { NextResponse } from "next/server";
import {
  refreshSession,
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  ACCESS_TOKEN_TTL_MS,
  REFRESH_TOKEN_TTL_MS,
} from "../../../../lib/admin";

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((value) => {
        const [key, ...rest] = value.trim().split("=");
        return [key, rest.join("=")];
      })
    );

    const oldRefreshToken = cookies[REFRESH_COOKIE_NAME];
    if (!oldRefreshToken) {
      return NextResponse.json({ ok: false, error: "No refresh token provided" }, { status: 401 });
    }

    const rotatedSession = await refreshSession(oldRefreshToken);
    if (!rotatedSession) {
      // Invalid or expired refresh token
      const response = NextResponse.json({ ok: false, error: "Session expired or invalid" }, { status: 401 });
      
      // Clear cookies
      response.cookies.set({ name: ACCESS_COOKIE_NAME, value: "", maxAge: 0, path: "/" });
      response.cookies.set({ name: REFRESH_COOKIE_NAME, value: "", maxAge: 0, path: "/" });
      return response;
    }

    const { accessToken, refreshToken } = rotatedSession;
    const response = NextResponse.json({ ok: true });

    // Set new Access Token (15 min)
    response.cookies.set({
      name: ACCESS_COOKIE_NAME,
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(ACCESS_TOKEN_TTL_MS / 1000),
    });

    // Set rotated Refresh Token (7 days)
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
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to refresh token" }, { status: 500 });
  }
}
