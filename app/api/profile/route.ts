import { NextResponse } from "next/server";
import { getFile, updateFile } from "../../../lib/github";
import { z } from "zod";
import { getToken } from "../../../lib/token";

const PROFILE_PATH = "data/profile.json";

const profileSchema = z.object({
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

export async function GET() {
  try {
    const file = await getFile(PROFILE_PATH);
    if (!file) {
      return NextResponse.json({ error: "Profile data not found." }, { status: 404 });
    }
    const profileData = JSON.parse(file.content);
    return NextResponse.json(profileData);
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
    // Accept either { data: {...} } or just {...} directly
    const payload = body.data || body;
    const validation = profileSchema.safeParse(payload);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data", details: validation.error.flatten() }, { status: 400 });
    }

    const file = await getFile(PROFILE_PATH);
    const sha = file?.sha || "";

    await updateFile(PROFILE_PATH, validation.data, "Update profile data", sha);
    return NextResponse.json({ ok: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("POST /api/profile error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}