import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "crypto";
import clientPromise from "./mongodb";

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
      return null; // Expired
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

async function getStoredHash(username: string): Promise<string> {
  try {
    const client = await clientPromise;
    const db = client.db("Portfiolo");
    const doc = await db.collection("admin_settings").findOne({ key: "password" }) as Record<string, unknown> | null;
    if (doc && typeof doc.hash === "string" && doc.username === username) {
      return doc.hash;
    }
  } catch {
    // Fallback to env
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

  const expectedHash = await getStoredHash(username);
  const providedHash = hashAdminPassword(password);

  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const providedBuffer = Buffer.from(providedHash, "hex");

  if (expectedBuffer.length !== providedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, providedBuffer);
}

/* ─── Database-Backed Refresh & Access Token flow ─────────────── */

export async function createDatabaseSession(username: string): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = signJwt({ username }, ACCESS_TOKEN_TTL_MS);
  const refreshToken = randomBytes(40).toString("hex");

  const client = await clientPromise;
  const db = client.db("Portfiolo");

  // Save refresh token to MongoDB
  await db.collection("refresh_tokens").insertOne({
    token: refreshToken,
    username,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    createdAt: new Date(),
  });

  // Clean up old expired tokens while we're here (background garbage collection)
  db.collection("refresh_tokens").deleteMany({ expiresAt: { $lt: new Date() } }).catch(() => null);

  return { accessToken, refreshToken };
}

export async function refreshSession(oldRefreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  const client = await clientPromise;
  const db = client.db("Portfiolo");

  // Lookup the refresh token
  const tokenDoc = await db.collection("refresh_tokens").findOne({ token: oldRefreshToken }) as {
    token: string;
    username: string;
    expiresAt: Date;
  } | null;

  if (!tokenDoc) return null;

  // Check expiration
  if (tokenDoc.expiresAt.getTime() <= Date.now()) {
    await db.collection("refresh_tokens").deleteOne({ token: oldRefreshToken });
    return null;
  }

  // Token is valid! Rotate it: delete old one, create new access + refresh tokens
  await db.collection("refresh_tokens").deleteOne({ token: oldRefreshToken });

  const accessToken = signJwt({ username: tokenDoc.username }, ACCESS_TOKEN_TTL_MS);
  const refreshToken = randomBytes(40).toString("hex");

  await db.collection("refresh_tokens").insertOne({
    token: refreshToken,
    username: tokenDoc.username,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    createdAt: new Date(),
  });

  return { accessToken, refreshToken };
}

export async function clearDatabaseSession(refreshToken: string): Promise<void> {
  try {
    const client = await clientPromise;
    const db = client.db("Portfiolo");
    await db.collection("refresh_tokens").deleteOne({ token: refreshToken });
  } catch {
    // Ignore error
  }
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
