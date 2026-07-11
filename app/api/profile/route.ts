import { NextResponse } from "next/server";
import { getAdminUserFromRequest } from "../../../lib/admin";
import { readJSON, writeJSON } from "../../../lib/github";

const DATA_PREFIX = "data";

const FILES = {
  profile: `${DATA_PREFIX}/profile.json`,
  experience: `${DATA_PREFIX}/experience.json`,
  education: `${DATA_PREFIX}/education.json`,
  trainings: `${DATA_PREFIX}/trainings.json`,
  projects: `${DATA_PREFIX}/projects.json`,
  skills: `${DATA_PREFIX}/skills.json`,
  achievements: `${DATA_PREFIX}/achievements.json`,
  languages: `${DATA_PREFIX}/languages.json`,
} as const;

const sanitizeStrings = (arr: unknown[]) =>
  arr.filter((s): s is string => typeof s === "string");

const sanitizeObjects = (arr: unknown[], fields: string[]) =>
  arr
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item: Record<string, any>) => {
      const obj: Record<string, string> = {};
      for (const f of fields) obj[f] = typeof item[f] === "string" ? item[f] : "";
      return obj;
    });

export async function GET() {
  try {
    const [profile, experience, education, trainings, projects, skills, achievements, languages] =
      await Promise.all([
        readJSON<any>(FILES.profile),
        readJSON<any[]>(FILES.experience),
        readJSON<any[]>(FILES.education),
        readJSON<any[]>(FILES.trainings),
        readJSON<any[]>(FILES.projects),
        readJSON<any[]>(FILES.skills),
        readJSON<any[]>(FILES.achievements),
        readJSON<any[]>(FILES.languages),
      ]);

    return NextResponse.json({
      name: profile.name || "",
      title: profile.title || "",
      location: profile.location || "",
      email: profile.email || "",
      linkedIn: profile.linkedIn || "",
      phone: profile.phone || "",
      summary: profile.summary || "",
      photo: profile.photo || "",
      maritalStatus: profile.maritalStatus || "",
      dateOfBirth: profile.dateOfBirth || "",
      nationality: profile.nationality || "",
      militaryStatus: profile.militaryStatus || "",
      skills: Array.isArray(skills) ? skills : [],
      experience: Array.isArray(experience) ? experience : [],
      education: Array.isArray(education) ? education : [],
      trainings: Array.isArray(trainings) ? trainings : [],
      projects: Array.isArray(projects) ? projects : [],
      achievements: Array.isArray(achievements) ? achievements : [],
      languages: Array.isArray(languages) ? languages : [],
    });
  } catch (err) {
    console.error("GitHub read error:", err);
    return NextResponse.json({ error: "Could not read profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const username = getAdminUserFromRequest(request);
    if (!username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return NextResponse.json({ error: "Invalid profile payload" }, { status: 400 });
    }

    const str = (key: string) =>
      typeof payload[key] === "string" ? payload[key].trim() : "";

    const profile = {
      name: str("name"),
      title: str("title"),
      location: str("location"),
      email: str("email"),
      linkedIn: str("linkedIn"),
      phone: str("phone"),
      summary: str("summary"),
      photo: str("photo"),
      maritalStatus: str("maritalStatus"),
      dateOfBirth: str("dateOfBirth"),
      nationality: str("nationality"),
      militaryStatus: str("militaryStatus"),
    };

    if (!profile.name || !profile.title) {
      return NextResponse.json({ error: "Name and title are required" }, { status: 400 });
    }

    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      return NextResponse.json({ error: "Email must be a valid address" }, { status: 400 });
    }

    if (profile.linkedIn && !/^https?:\/\//i.test(profile.linkedIn)) {
      return NextResponse.json({ error: "LinkedIn must be a valid URL" }, { status: 400 });
    }

    const experience = sanitizeObjects(
      Array.isArray(payload.experience) ? payload.experience : [],
      ["company", "role", "period", "description"]
    );

    const education = sanitizeObjects(
      Array.isArray(payload.education) ? payload.education : [],
      ["degree", "institution", "year", "gpa", "project"]
    );

    const trainings = sanitizeObjects(
      Array.isArray(payload.trainings) ? payload.trainings : [],
      ["company", "date", "description"]
    );

    const projects = sanitizeObjects(
      Array.isArray(payload.projects) ? payload.projects : [],
      ["name", "description", "link"]
    );

    const skills = sanitizeStrings(
      Array.isArray(payload.skills) ? payload.skills : []
    );

    const achievements = sanitizeObjects(
      Array.isArray(payload.achievements) ? payload.achievements : [],
      ["title", "description"]
    );

    const languages = sanitizeObjects(
      Array.isArray(payload.languages) ? payload.languages : [],
      ["name", "level"]
    );

    const timestamp = new Date().toISOString().slice(0, 10);
    const commitBase = `Update portfolio from admin panel — ${timestamp}`;

    await Promise.all([
      writeJSON(FILES.profile, profile, `${commitBase} (profile)`),
      writeJSON(FILES.experience, experience, `${commitBase} (experience)`),
      writeJSON(FILES.education, education, `${commitBase} (education)`),
      writeJSON(FILES.trainings, trainings, `${commitBase} (trainings)`),
      writeJSON(FILES.projects, projects, `${commitBase} (projects)`),
      writeJSON(FILES.skills, skills, `${commitBase} (skills)`),
      writeJSON(FILES.achievements, achievements, `${commitBase} (achievements)`),
      writeJSON(FILES.languages, languages, `${commitBase} (languages)`),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("GitHub write error:", err);
    return NextResponse.json({ error: "Could not write profile" }, { status: 500 });
  }
}
