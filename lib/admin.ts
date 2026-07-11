import { scryptSync, timingSafeEqual, createHmac } from "crypto";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const ACCESS_TOKEN_TTL_MS = 1000 * 60 * 15; // 15 minutes
const REFRESH_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const ACCESS_COOKIE_NAME = "portfolio_access_token";
const REFRESH_COOKIE_NAME = "portfolio_refresh_token";

const DEFAULT_USERNAME = process.env.ADMIN_USERNAME || "admin";
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@2026!";
const PEPPER = process.env.ADMIN_PASSWORD_PEPPER || "portfolio-admin-pepper-v1";
const JWT_SECRET = process.env.JWT_SECRET || "portfolio-jwt-secret-key-32-chars-long-standard";

/* ─── JWT Helpers (Native Node Crypto) ────────────────────────── */
function base64url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function signJwt(payload: object, expiresInMs: number): string {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor((Date.now() + expiresInMs) / 1000);
  const fullPayload = { ...payload, exp };

  const part1 = base64url(Buffer.from(JSON.stringify(header)));
  const part2 = base64url(Buffer.from(JSON.stringify(fullPayload)));
  const signature = base64url(
    createHmac("sha256", JWT_SECRET).update(`${part1}.${part2}`).digest()
  );
  return `${part1}.${part2}.${signature}`;
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
      return null;
    }
    return payload as { username: string };
  } catch {
    return null;
  }
}

/* ─── Password Hashing ───────────────────────────────────────── */
export function hashAdminPassword(password: string): string {
  return scryptSync(password, PEPPER, 64).toString("hex");
}

function getStoredHash(username: string): string {
  // First check data/password.json (persisted via change-password endpoint)
  try {
    const p = join(process.cwd(), "data", "password.json");
    if (existsSync(p)) {
      const content = JSON.parse(readFileSync(p, "utf-8"));
      if (content.hash) return content.hash;
    }
  } catch {
    // ignore
  }
  return process.env.ADMIN_PASSWORD_HASH || hashAdminPassword(DEFAULT_PASSWORD);
}

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  if (!username || !password) return false;

  const expectedUsername = process.env.ADMIN_USERNAME || DEFAULT_USERNAME;
  if (username !== expectedUsername) return false;

  const expectedHash = getStoredHash(username);
  const providedHash = hashAdminPassword(password);

  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const providedBuffer = Buffer.from(providedHash, "hex");

  if (expectedBuffer.length !== providedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, providedBuffer);
}

/* ─── Stateless Session (no DB needed) ─────────────────────────── */
export function createSession(username: string): { accessToken: string; refreshToken: string } {
  const accessToken = signJwt({ username, type: "access" }, ACCESS_TOKEN_TTL_MS);
  const refreshToken = signJwt({ username, type: "refresh" }, REFRESH_TOKEN_TTL_MS);
  return { accessToken, refreshToken };
}

export function verifyRefreshToken(token: string): { username: string } | null {
  const payload = verifyJwt(token);
  if (!payload) return null;
  return (payload as any).type === "refresh" ? payload : null;
}

export function refreshSession(
  oldRefreshToken: string
): { accessToken: string; refreshToken: string } | null {
  const payload = verifyRefreshToken(oldRefreshToken);
  if (!payload) return null;
  return createSession(payload.username);
}

export function clearDatabaseSession(_refreshToken: string): void {
  // Stateless — nothing to clear on the server
}

export function getAdminUserFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((value) => {
      const [key, ...rest] = value.trim().split("=");
      return [key, rest.join("=")];
    })
  );

  const accessToken = cookies[ACCESS_COOKIE_NAME];
  if (!accessToken) return null;

  const payload = verifyJwt(accessToken);
  return payload ? payload.username : null;
}

export { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME, ACCESS_TOKEN_TTL_MS, REFRESH_TOKEN_TTL_MS };
