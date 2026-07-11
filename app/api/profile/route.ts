import { NextResponse } from "next/server";
import { getFile, writeJSONBatch } from "../../../lib/github";
import { z } from "zod";
import { getToken } from "../../../lib/token";

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

const scalarSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  linkedIn: z.string().url().optional(),
  summary: z.string().min(1),
  photo: z.string().optional(),
  maritalStatus: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  militaryStatus: z.string().optional(),
});

async function readJSON(path: string): Promise<any | null> {
  const file = await getFile(path);
  if (!file) return null;
  try {
    return JSON.parse(file.content);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const [profile, skills, experience, education, trainings, projects, achievements, languages] = await Promise.all(
      FILES.map(f => readJSON(`data/${f}`))
    );

    if (!profile) {
      return NextResponse.json({ error: "Profile data not found." }, { status: 404 });
    }

    return NextResponse.json({
      ...profile,
      skills: Array.isArray(skills) ? skills : [],
      experience: Array.isArray(experience) ? experience : [],
      education: Array.isArray(education) ? education : [],
      trainings: Array.isArray(trainings) ? trainings : [],
      projects: Array.isArray(projects) ? projects : [],
      achievements: Array.isArray(achievements) ? achievements : [],
      languages: Array.isArray(languages) ? languages : [],
    });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile data." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const payload = body.data || body;

    // Validate only scalar fields
    const validation = scalarSchema.safeParse(payload);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data", details: validation.error.flatten() }, { status: 400 });
    }

    // Write each section to its own file
    const sections: { path: string; data: any }[] = [
      { path: "data/profile.json", data: validation.data },
    ];

    const arrays: [string, string][] = [
      ["skills", "skills.json"],
      ["experience", "experience.json"],
      ["education", "education.json"],
      ["trainings", "trainings.json"],
      ["projects", "projects.json"],
      ["achievements", "achievements.json"],
      ["languages", "languages.json"],
    ];

    for (const [key, file] of arrays) {
      const value = payload[key];
      if (value !== undefined) {
        sections.push({ path: "data/" + file, data: Array.isArray(value) ? value : [] });
      }
    }

    // Write all sections in a single commit (avoids SHA conflicts)
    await writeJSONBatch(sections, "Update portfolio — " + new Date().toISOString().split("T")[0]);

    return NextResponse.json({ ok: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("POST /api/profile error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}