import { createHmac } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "portfolio-jwt-secret-key-32-chars-long-standard";
const ACCESS_COOKIE_NAME = "portfolio_access_token";

function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function verifyJwt(token: string): { username: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [part1, part2, signature] = parts;

    const expectedSignature = base64url(
      createHmac("sha256", JWT_SECRET).update(`${part1}.${part2}`).digest()
    );
    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(part2, "base64").toString("utf-8"));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload as { username: string };
  } catch {
    return null;
  }
}

export async function getToken({ req }: { req: Request }): Promise<{ username: string } | null> {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((value) => {
      const [key, ...rest] = value.trim().split("=");
      return [key, rest.join("=")];
    })
  );

  const accessToken = cookies[ACCESS_COOKIE_NAME];
  if (!accessToken) {
    return null;
  }

  const payload = verifyJwt(accessToken);
  return payload;
}