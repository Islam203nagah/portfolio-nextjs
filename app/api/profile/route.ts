import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { getAdminUserFromRequest } from "../../../lib/admin";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Portfiolo");
    const profile = await db.collection("profile").findOne({});

    if (!profile) {
      return NextResponse.json({
        name: "",
        title: "",
        location: "",
        summary: "",
        skills: [],
        experience: [],
        projects: [],
        education: [],
        trainings: [],
        achievements: [],
        languages: [],
        maritalStatus: "",
        dateOfBirth: "",
        nationality: "",
        militaryStatus: "",
      });
    }

    const { _id, ...rest } = profile as Record<string, unknown>;
    return NextResponse.json(rest);
  } catch {
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

    const sanitizeStrings = (arr: unknown[]) =>
      arr.filter((s): s is string => typeof s === "string");

    const sanitizeObjects = (arr: unknown[], fields: string[]) =>
      arr.filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
        .map((item: Record<string, any>) => {
          const obj: Record<string, string> = {};
          for (const f of fields) obj[f] = typeof item[f] === "string" ? item[f] : "";
          return obj;
        });

    const sanitizedPayload = {
      name: typeof payload.name === "string" ? payload.name.trim() : "",
      title: typeof payload.title === "string" ? payload.title.trim() : "",
      location: typeof payload.location === "string" ? payload.location.trim() : "",
      email: typeof payload.email === "string" ? payload.email.trim() : "",
      linkedIn: typeof payload.linkedIn === "string" ? payload.linkedIn.trim() : "",
      phone: typeof payload.phone === "string" ? payload.phone.trim() : "",
      summary: typeof payload.summary === "string" ? payload.summary.trim() : "",
      skills: Array.isArray(payload.skills) ? sanitizeStrings(payload.skills) : [],
      experience: Array.isArray(payload.experience) ? sanitizeObjects(payload.experience, ["company", "role", "period", "description"]) : [],
      projects: Array.isArray(payload.projects) ? sanitizeObjects(payload.projects, ["name", "description", "link"]) : [],
      photo: typeof payload.photo === "string" ? payload.photo.trim() : "",
      education: Array.isArray(payload.education) ? sanitizeObjects(payload.education, ["degree", "institution", "year", "gpa", "project"]) : [],
      trainings: Array.isArray(payload.trainings) ? sanitizeObjects(payload.trainings, ["company", "date", "description"]) : [],
      achievements: Array.isArray(payload.achievements) ? sanitizeObjects(payload.achievements, ["title", "description"]) : [],
      languages: Array.isArray(payload.languages) ? sanitizeObjects(payload.languages, ["name", "level"]) : [],
      maritalStatus: typeof payload.maritalStatus === "string" ? payload.maritalStatus.trim() : "",
      dateOfBirth: typeof payload.dateOfBirth === "string" ? payload.dateOfBirth.trim() : "",
      nationality: typeof payload.nationality === "string" ? payload.nationality.trim() : "",
      militaryStatus: typeof payload.militaryStatus === "string" ? payload.militaryStatus.trim() : "",
    };

    if (!sanitizedPayload.name || !sanitizedPayload.title) {
      return NextResponse.json({ error: "Name and title are required" }, { status: 400 });
    }

    if (sanitizedPayload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedPayload.email)) {
      return NextResponse.json({ error: "Email must be a valid address" }, { status: 400 });
    }

    if (sanitizedPayload.linkedIn && !/^https?:\/\//i.test(sanitizedPayload.linkedIn)) {
      return NextResponse.json({ error: "LinkedIn must be a valid URL" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("Portfiolo");

    await db.collection("profile").replaceOne({}, sanitizedPayload, { upsert: true });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not write profile" }, { status: 500 });
  }
}
