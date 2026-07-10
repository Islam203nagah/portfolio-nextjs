import { NextResponse } from "next/server";
import {
  clearDatabaseSession,
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
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

    const refreshToken = cookies[REFRESH_COOKIE_NAME];
    if (refreshToken) {
      await clearDatabaseSession(refreshToken);
    }

    const response = NextResponse.json({ ok: true });

    // Clear Access Token Cookie
    response.cookies.set({
      name: ACCESS_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    // Clear Refresh Token Cookie
    response.cookies.set({
      name: REFRESH_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "Logout failed" }, { status: 500 });
  }
}
