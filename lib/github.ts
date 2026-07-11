import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const branch = process.env.GITHUB_BRANCH || 'main';

interface GitHubFile {
  content: string;
  sha: string;
}

/**
 * Fetches the content and SHA of a file from the GitHub repository.
 * @param path - The path to the file in the repository (e.g., 'data/profile.json').
 * @returns A promise that resolves to the file content and SHA, or null if not found.
 */
export async function getFile(path: string): Promise<GitHubFile | null> {
  // Try GitHub first
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    if (Array.isArray(data) || !("content" in data)) {
      return null;
    }

    return {
      content: Buffer.from(data.content, "base64").toString("utf-8"),
      sha: data.sha,
    };
  } catch (error: any) {
    if (error.status === 404) {
      console.warn(`File not found in GitHub repo: ${path}`);
    } else {
      console.warn(`GitHub API error for ${path}: ${error.message}`);
    }
  }

  // Local fallback
  try {
    const localPath = require("node:path").join(process.cwd(), require("node:path").dirname(path), require("node:path").basename(path));
    const content = require("node:fs").readFileSync(localPath, "utf-8");
    return { content, sha: "" };
  } catch {
    return null;
  }
}

/**
 * Updates a file in the GitHub repository by creating a new commit.
 * @param path - The path to the file to update.
 * @param content - The new content for the file (will be stringified).
 * @param message - The commit message.
 * @param currentSha - The current SHA of the file to avoid conflicts.
 * @returns A promise that resolves when the commit is created.
 */
export async function updateFile(
  path: string,
  content: any,
  message: string,
  currentSha: string
) {
  // Always write to local file
  try {
    const localPath = require("node:path").join(process.cwd(), "data", require("node:path").basename(path));
    require("node:fs").writeFileSync(localPath, JSON.stringify(content, null, 2) + "\n", "utf-8");
  } catch {
    // read-only filesystem (Vercel) — skip
  }

  try {
    const stringifiedContent = JSON.stringify(content, null, 2);
    const contentBase64 = Buffer.from(stringifiedContent).toString("base64");

    // Fetch the latest SHA if not provided (handles missing SHAs from local fallback)
    let sha = currentSha;
    if (!sha) {
      try {
        const { data } = await octokit.repos.getContent({ owner, repo, path, ref: branch });
        if (!Array.isArray(data) && 'sha' in data) {
          sha = data.sha;
        }
      } catch {
        // file doesn't exist yet, creation without SHA is fine
      }
    }

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: contentBase64,
      sha,
      branch,
    });
  } catch (error) {
    console.warn(`GitHub write error for ${path}: ${error instanceof Error ? error.message : error}`);
  }
}