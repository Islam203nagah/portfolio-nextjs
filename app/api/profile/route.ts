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

    const sanitizedPayload = {
      name: typeof payload.name === "string" ? payload.name.trim() : "",
      title: typeof payload.title === "string" ? payload.title.trim() : "",
      location: typeof payload.location === "string" ? payload.location.trim() : "",
      email: typeof payload.email === "string" ? payload.email.trim() : "",
      linkedIn: typeof payload.linkedIn === "string" ? payload.linkedIn.trim() : "",
      phone: typeof payload.phone === "string" ? payload.phone.trim() : "",
      summary: typeof payload.summary === "string" ? payload.summary.trim() : "",
      skills: Array.isArray(payload.skills) ? payload.skills.filter((skill: unknown): skill is string => typeof skill === "string") : [],
      experience: Array.isArray(payload.experience)
        ? payload.experience.filter((item: unknown): item is Record<string, unknown> => !!item && typeof item === "object").map((item: Record<string, any>) => ({
            company: typeof item.company === "string" ? item.company : "",
            role: typeof item.role === "string" ? item.role : "",
            period: typeof item.period === "string" ? item.period : "",
            description: typeof item.description === "string" ? item.description : "",
          }))
        : [],
      projects: Array.isArray(payload.projects)
        ? payload.projects.filter((item: unknown): item is Record<string, unknown> => !!item && typeof item === "object").map((item: Record<string, any>) => ({
            name: typeof item.name === "string" ? item.name : "",
            description: typeof item.description === "string" ? item.description : "",
            link: typeof item.link === "string" ? item.link : "",
          }))
        : [],
      photo: typeof payload.photo === "string" ? payload.photo.trim() : "",
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
