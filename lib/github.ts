const OWNER = process.env.GITHUB_OWNER || "";
const REPO = process.env.GITHUB_REPO || "";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const TOKEN = process.env.GITHUB_TOKEN || "";

if (!OWNER || !REPO || !TOKEN) {
  throw new Error(
    "GitHub credentials not configured. Set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO environment variables."
  );
}

const API_BASE = "https://api.github.com";

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-admin",
  };
}

export async function readJSON<T>(path: string): Promise<T> {
  const url = `${API_BASE}/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: headers() });

  if (res.status === 404) {
    return {} as T;
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub read error (${res.status}): ${text}`);
  }

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return JSON.parse(content) as T;
}

/* ─── Single-commit batch write ───────────────────────────────── */
export async function writeJSONBatch(
  files: { path: string; data: unknown }[],
  commitMessage: string
): Promise<void> {
  if (!files.length) return;

  // 1. Get current HEAD ref
  const refUrl = `${API_BASE}/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`;
  const refRes = await fetch(refUrl, { headers: headers() });
  if (!refRes.ok) throw new Error(`Failed to get ref: ${await refRes.text()}`);
  const refData = await refRes.json();
  const headSha: string = refData.object.sha;

  // 2. Get the current commit to retrieve the base tree SHA
  const commitUrl = `${API_BASE}/repos/${OWNER}/${REPO}/git/commits/${headSha}`;
  const commitRes = await fetch(commitUrl, { headers: headers() });
  if (!commitRes.ok) throw new Error(`Failed to get commit: ${await commitRes.text()}`);
  const commitData = await commitRes.json();
  const baseTreeSha: string = commitData.tree.sha;

  // 3. Create a blob for each file
  const treeEntries: { path: string; mode: "100644"; type: "blob"; sha: string }[] = [];
  for (const file of files) {
    const content = JSON.stringify(file.data, null, 2);
    const blobRes = await fetch(
      `${API_BASE}/repos/${OWNER}/${REPO}/git/blobs`,
      {
        method: "POST",
        headers: { ...headers(), "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          encoding: "utf-8",
        }),
      }
    );
    if (!blobRes.ok) throw new Error(`Failed to create blob for ${file.path}: ${await blobRes.text()}`);
    const blobData = await blobRes.json();
    treeEntries.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blobData.sha,
    });
  }

  // 4. Create a tree with all entries
  const treeRes = await fetch(
    `${API_BASE}/repos/${OWNER}/${REPO}/git/trees`,
    {
      method: "POST",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeEntries,
      }),
    }
  );
  if (!treeRes.ok) throw new Error(`Failed to create tree: ${await treeRes.text()}`);
  const treeData = await treeRes.json();
  const newTreeSha: string = treeData.sha;

  // 5. Create a commit
  const newCommitRes = await fetch(
    `${API_BASE}/repos/${OWNER}/${REPO}/git/commits`,
    {
      method: "POST",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({
        message: commitMessage,
        tree: newTreeSha,
        parents: [headSha],
      }),
    }
  );
  if (!newCommitRes.ok) throw new Error(`Failed to create commit: ${await newCommitRes.text()}`);
  const newCommitData = await newCommitRes.json();
  const newCommitSha: string = newCommitData.sha;

  // 6. Update branch ref to point to the new commit
  const updateRefRes = await fetch(refUrl, {
    method: "PATCH",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({ sha: newCommitSha, force: false }),
  });
  if (!updateRefRes.ok) throw new Error(`Failed to update ref: ${await updateRefRes.text()}`);
}
