import { Octokit } from "@octokit/rest";

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.warn("[github] GITHUB_TOKEN not set — GitHub API calls will fail");
}

const octokit = new Octokit({
  auth: token,
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
  // Try raw.githubusercontent.com first (handles files > 1MB)
  try {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
    const res = await fetch(rawUrl);
    if (res.ok) {
      const content = await res.text();
      // Fetch SHA via Octokit
      let sha = "";
      try {
        const { data } = await octokit.repos.getContent({ owner, repo, path, ref: branch });
        if (!Array.isArray(data) && 'sha' in data) {
          sha = data.sha;
        }
      } catch { /* sha not critical */ }
      return { content, sha };
    }
  } catch (error: any) {
    console.warn(`Raw fetch error for ${path}: ${error.message}`);
  }

  // Fallback to Octokit API
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    if (Array.isArray(data) || !("content" in data)) {
      // If data is returned but empty content, fall back to raw
      if (Array.isArray(data) || !('sha' in data)) return null;
      return { content: "", sha: (data as any).sha };
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

  // Local fallback (only locally, not on Vercel)
  if (!process.env.VERCEL) {
    try {
      const localPath = require("node:path").join(process.cwd(), "data", require("node:path").basename(path));
      const content = require("node:fs").readFileSync(localPath, "utf-8");
      return { content, sha: "" };
    } catch {
      // not found
    }
  }

  return null;
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

    // Fetch the latest SHA if not provided
    let sha = currentSha;
    if (!sha) {
      try {
        const { data } = await octokit.repos.getContent({ owner, repo, path, ref: branch });
        if (!Array.isArray(data) && 'sha' in data) {
          sha = data.sha;
        }
      } catch (e: any) {
        console.warn(`[updateFile] Could not fetch SHA for ${path}: ${e.message}`);
      }
    }

    const result = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: contentBase64,
      sha,
      branch,
    });
    console.log(`[updateFile] Successfully wrote ${path}, commit: ${result.data?.commit?.sha}`);
  } catch (error) {
    console.error(`[updateFile] GitHub write error for ${path}: ${error instanceof Error ? error.message : error}`);
  }
}

/**
 * Writes multiple files in a single commit using the Git Data API (no SHA conflicts).
 */
export async function writeJSONBatch(files: { path: string; content: any }[], message: string) {
  // Also write locally
  for (const { path, content } of files) {
    try {
      const localPath = require("node:path").join(process.cwd(), "data", require("node:path").basename(path));
      require("node:fs").writeFileSync(localPath, JSON.stringify(content, null, 2) + "\n", "utf-8");
    } catch { /* skip */ }
  }

  try {
    // Get the latest commit SHA for the branch
    const { data: refData } = await octokit.git.getRef({ owner, repo, ref: `heads/${branch}` });
    const latestCommitSha = refData.object.sha;

    // Get the tree from the latest commit
    const { data: commitData } = await octokit.git.getCommit({ owner, repo, commit_sha: latestCommitSha });
    const baseTreeSha = commitData.tree.sha;

    // Create blobs and tree entries for each file
    const treeEntries = await Promise.all(
      files.map(async ({ path, content }) => {
        const stringified = JSON.stringify(content, null, 2);
        const { data: blob } = await octokit.git.createBlob({
          owner,
          repo,
          content: stringified,
          encoding: "utf-8",
        });
        return { path, mode: "100644" as const, type: "blob" as const, sha: blob.sha };
      })
    );

    // Create a new tree
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSha,
      tree: treeEntries,
    });

    // Create a commit
    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo,
      message,
      tree: newTree.sha,
      parents: [latestCommitSha],
    });

    // Update the branch reference
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    });

    console.log(`[writeJSONBatch] Success, commit: ${newCommit.sha}`);
  } catch (error) {
    console.error(`[writeJSONBatch] Error: ${error instanceof Error ? error.message : error}`);
  }
}