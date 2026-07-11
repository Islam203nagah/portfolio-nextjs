import * as fs from "node:fs";
import * as path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

const OWNER = process.env.GITHUB_OWNER || "";
const REPO = process.env.GITHUB_REPO || "";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const TOKEN = process.env.GITHUB_TOKEN || "";

const API_BASE = "https://api.github.com";

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-admin",
  };
}

/** Read from GitHub API; fallback to local files on error */
export async function readJSON<T>(ghPath: string): Promise<T> {
  // In production (Vercel), try GitHub first
  if (TOKEN) {
    try {
      const url = `${API_BASE}/repos/${OWNER}/${REPO}/contents/${ghPath}?ref=${BRANCH}`;
      const res = await fetch(url, { headers: headers() });

      if (res.status === 404) return {} as T;

      if (res.ok) {
        const data = await res.json();
        const content = Buffer.from(data.content, "base64").toString("utf-8");
        try {
          return JSON.parse(content) as T;
        } catch {
          console.warn(`Corrupt JSON in ${ghPath}, returning empty fallback`);
          return {} as T;
        }
      }
    } catch {
      // fall through to local
    }
  }

  // Local fallback
  const localFilePath = path.join(DATA_DIR, path.basename(ghPath));
  try {
    const localContent = fs.readFileSync(localFilePath, "utf-8");
    return JSON.parse(localContent) as T;
  } catch {
    return {} as T;
  }
}

/* ─── Single-commit batch write (fallback to local) ───────────── */
export async function writeJSONBatch(
  files: { path: string; data: unknown }[],
  commitMessage: string
): Promise<void> {
  if (!files.length) return;

  // Always write to local files first
  for (const file of files) {
    const localPath = path.join(DATA_DIR, path.basename(file.path));
    try {
      fs.writeFileSync(localPath, JSON.stringify(file.data, null, 2) + "\n", "utf-8");
    } catch (e) {
      console.warn(`Failed to write local ${localPath}:`, e);
    }
  }

  // Try GitHub; silently skip if unavailable
  if (!TOKEN) return;

  try {
    const refUrl = `${API_BASE}/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`;
    const refRes = await fetch(refUrl, { headers: headers() });
    if (!refRes.ok) return;
    const refData = await refRes.json();
    const headSha: string = refData.object.sha;

    const commitUrl = `${API_BASE}/repos/${OWNER}/${REPO}/git/commits/${headSha}`;
    const commitRes = await fetch(commitUrl, { headers: headers() });
    if (!commitRes.ok) return;
    const commitData = await commitRes.json();
    const baseTreeSha: string = commitData.tree.sha;

    const treeEntries: { path: string; mode: "100644"; type: "blob"; sha: string }[] = [];
    for (const file of files) {
      const content = JSON.stringify(file.data, null, 2);
      const blobRes = await fetch(
        `${API_BASE}/repos/${OWNER}/${REPO}/git/blobs`,
        {
          method: "POST",
          headers: { ...headers(), "Content-Type": "application/json" },
          body: JSON.stringify({ content, encoding: "utf-8" }),
        }
      );
      if (!blobRes.ok) return;
      const blobData = await blobRes.json();
      treeEntries.push({ path: file.path, mode: "100644", type: "blob", sha: blobData.sha });
    }

    const treeRes = await fetch(
      `${API_BASE}/repos/${OWNER}/${REPO}/git/trees`,
      {
        method: "POST",
        headers: { ...headers(), "Content-Type": "application/json" },
        body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }),
      }
    );
    if (!treeRes.ok) return;
    const treeData = await treeRes.json();
    const newTreeSha: string = treeData.sha;

    const newCommitRes = await fetch(
      `${API_BASE}/repos/${OWNER}/${REPO}/git/commits`,
      {
        method: "POST",
        headers: { ...headers(), "Content-Type": "application/json" },
        body: JSON.stringify({ message: commitMessage, tree: newTreeSha, parents: [headSha] }),
      }
    );
    if (!newCommitRes.ok) return;
    const newCommitData = await newCommitRes.json();
    const newCommitSha: string = newCommitData.sha;

    await fetch(refUrl, {
      method: "PATCH",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({ sha: newCommitSha, force: false }),
    });
  } catch (e) {
    console.warn("GitHub write skipped — API unavailable:", e);
  }
}
