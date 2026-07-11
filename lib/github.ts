import { createClient } from "@vercel/kv";

let kv: ReturnType<typeof createClient>;

function getClient() {
  if (!kv) {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    if (!url || !token) {
      return null;
    }
    kv = createClient({ url, token });
  }
  return kv;
}

interface GitHubFile {
  content: string;
  sha: string;
}

const KV_PREFIX = "portfolio:";

/**
 * Fetches content of a file. In KV mode, the path argument is used as the key.
 * @param path - e.g., 'data/profile.json'
 */
export async function getFile(path: string): Promise<GitHubFile | null> {
  const client = getClient();
  if (client) {
    try {
      const key = KV_PREFIX + path.replace(/\//g, ":");
      const value = await client.get(key);
      if (value === null) return null;
      const content = typeof value === 'string' ? value : JSON.stringify(value);
      return { content, sha: "" };
    } catch (error) {
      console.error(`[KV] getFile error for ${path}:`, error);
      return null;
    }
  }

  // Local fallback
  try {
    const { readFileSync } = require("fs");
    const { join } = require("path");
    const localPath = join(process.cwd(), "data", path.split("/").pop()!);
    const content = readFileSync(localPath, "utf-8");
    return { content, sha: "" };
  } catch {
    return null;
  }
}

/**
 * Updates a single file in KV.
 */
export async function updateFile(
  path: string,
  content: any,
  _message?: string,
  _currentSha?: string
) {
  // Also write locally
  try {
    const { writeFileSync } = require("fs");
    const { join } = require("path");
    const localPath = join(process.cwd(), "data", path.split("/").pop()!);
    writeFileSync(localPath, JSON.stringify(content, null, 2) + "\n", "utf-8");
  } catch { /* skip */ }

  const client = getClient();
  if (client) {
    try {
      const key = KV_PREFIX + path.replace(/\//g, ":");
      await client.set(key, JSON.stringify(content));
      console.log(`[KV] Updated ${key}`);
    } catch (error) {
      console.error(`[KV] updateFile error for ${path}:`, error);
    }
  }
}

/**
 * Writes multiple files to KV in a single batch.
 */
export async function writeJSONBatch(files: { path: string; content: any }[], _message?: string) {
  // Write locally
  for (const { path, content } of files) {
    try {
      const { writeFileSync } = require("fs");
      const { join } = require("path");
      const localPath = join(process.cwd(), "data", path.split("/").pop()!);
      writeFileSync(localPath, JSON.stringify(content, null, 2) + "\n", "utf-8");
    } catch { /* skip */ }
  }

  const client = getClient();
  if (client) {
    try {
      const entries: Record<string, string> = {};
      for (const { path, content } of files) {
        entries[KV_PREFIX + path.replace(/\//g, ":")] = JSON.stringify(content);
      }
      await client.mset(entries);
      console.log(`[KV] Batch updated ${files.length} keys`);
    } catch (error) {
      console.error("[KV] writeJSONBatch error:", error);
    }
  }
}