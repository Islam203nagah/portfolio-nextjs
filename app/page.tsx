"use client";

import { useEffect, useState } from "react";
import { ProfileWidget } from "../components/profile-widget";
import { AboutSection } from "../components/sections/AboutSection";
import { ProjectsSection } from "../components/sections/ProjectsSection";
import { ExperienceSection } from "../components/sections/ExperienceSection";
import { ContactForm } from "../components/contact-form";
import type { Profile } from "../types/profile";
import { Sparkles, Cpu } from "lucide-react";

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then(setProfile)
      .catch(() => null);
  }, []);

  if (!profile) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-violet-400/30 border-t-violet-400 animate-spin" />
          <p className="text-sm text-slate-400">Loading profile…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-16 space-y-16">
      
      {/* ── Hero Section (Full Width) ────────────────────────── */}
      <section className="text-center md:text-left space-y-6 max-w-4xl mx-auto py-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-950/70 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition-all duration-300">
          <Cpu className="h-4 w-4 text-violet-500" />
          <span>{profile.title || "Petroleum Engineer"}</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            {profile.name}
          </h1>
          <p className="text-lg sm:text-xl leading-8 text-slate-600 dark:text-slate-300 max-w-2xl">
            {profile.summary}
          </p>
        </div>
      </section>

      {/* ── Content Sections (Full Width Flow) ────────────────── */}
      <div className="space-y-12 max-w-4xl mx-auto">
        <AboutSection profile={profile} />
        <ExperienceSection profile={profile} />
        <ProjectsSection profile={profile} />
      </div>

      {/* ── Contact & Sidebar Widget ─────────────────────────── */}
      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        <ProfileWidget />
        <ContactForm />
      </div>

    </main>
  );
}
