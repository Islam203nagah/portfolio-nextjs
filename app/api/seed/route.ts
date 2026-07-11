import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { writeJSONBatch, updateFile } from "../../../lib/github";

const FILES = [
  "profile.json",
  "skills.json",
  "experience.json",
  "education.json",
  "trainings.json",
  "projects.json",
  "achievements.json",
  "languages.json",
];

export async function GET() {
  try {
    const sections = [];

    for (const file of FILES) {
      try {
        const content = readFileSync(join(process.cwd(), "data", file), "utf-8");
        sections.push({ path: "data/" + file, content: JSON.parse(content) });
      } catch (e) {
        console.warn(`Could not read ${file}: skipping`);
      }
    }

    if (sections.length === 0) {
      return NextResponse.json({ error: "No data files found" }, { status: 404 });
    }

    await writeJSONBatch(sections, "Initial seed into KV");

    return NextResponse.json({
      ok: true,
      message: `Seeded ${sections.length} files into KV`,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed KV" }, { status: 500 });
  }
}
