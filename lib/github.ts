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

interface GitHubFile {
  content: string;
  sha: string;
}

async function getFile(path: string): Promise<GitHubFile> {
  const url = `${API_BASE}/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: headers() });

  if (res.status === 404) {
    return { content: "", sha: "" };
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub read error (${res.status}): ${text}`);
  }

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha };
}

async function updateFile(
  path: string,
  content: string,
  sha: string,
  message: string
): Promise<void> {
  const url = `${API_BASE}/repos/${OWNER}/${REPO}/contents/${path}`;
  const body = {
    message,
    content: Buffer.from(content, "utf-8").toString("base64"),
    sha,
    branch: BRANCH,
  };

  const res = await fetch(url, {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub write error (${res.status}): ${text}`);
  }
}

export async function readJSON<T>(path: string): Promise<T> {
  const { content } = await getFile(path);
  if (!content) return {} as T;
  return JSON.parse(content) as T;
}

export async function writeJSON(
  path: string,
  data: unknown,
  commitMessage: string
): Promise<void> {
  const { sha } = await getFile(path);
  const content = JSON.stringify(data, null, 2);
  await updateFile(path, content, sha, commitMessage);
}
