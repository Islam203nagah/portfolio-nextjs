"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin, Linkedin, Sparkles, Phone } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar } from "./ui/avatar";

interface ProfileData {
  name: string;
  title: string;
  location: string;
  email?: string;
  linkedIn?: string;
  phone?: string;
  summary: string;
  skills?: string[];
  photo?: string;
}

export function ProfileWidget() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((response) => response.json())
      .then(setProfile)
      .catch(() => setProfile(null));
  }, []);

  if (!profile) {
    return (
      <Card className="space-y-4 animate-pulse">
        <div className="h-4 w-40 rounded-full bg-slate-200 dark:bg-slate-700/70" />
        <div className="h-3 w-32 rounded-full bg-slate-200 dark:bg-slate-700/70" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700/70" />
          <div className="h-3 w-5/6 rounded-full bg-slate-200 dark:bg-slate-700/70" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-6 animate-fade-in hover:shadow-xl hover:shadow-violet-500/5 dark:hover:shadow-black/50 transition-all duration-300">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar src={profile.photo || undefined} alt={profile.name} size={72} />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500 font-semibold">Profile</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{profile.name}</h2>
              <p className="mt-0.5 text-sm font-medium text-slate-600 dark:text-slate-300">{profile.title}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-violet-500/10 dark:bg-slate-950/60 p-3.5 text-violet-600 dark:text-slate-100 border border-violet-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{profile.summary}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.5rem] bg-slate-100/60 dark:bg-slate-950/40 p-4 border border-slate-200/50 dark:border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Location</p>
          <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <MapPin className="h-4 w-4 text-violet-500" /> {profile.location || "Available worldwide"}
          </div>
        </div>
        
        <div className="rounded-[1.5rem] bg-slate-100/60 dark:bg-slate-950/40 p-4 border border-slate-200/50 dark:border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Contact</p>
          <div className="mt-2 space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            {profile.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-violet-500" /> 
                <a className="truncate hover:text-violet-600 dark:hover:text-white transition-colors" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </div>
            )}
            
            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-violet-500" />
                <a className="hover:text-violet-600 dark:hover:text-white transition-colors" href={`tel:${profile.phone}`}>
                  {profile.phone}
                </a>
              </div>
            )}

            {profile.linkedIn && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-violet-500" />
                <a className="hover:text-violet-600 dark:hover:text-white transition-colors" href={profile.linkedIn} target="_blank" rel="noreferrer">
                  LinkedIn profile
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {profile.skills && profile.skills.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Skills</p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.slice(0, 10).map((skill: string) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        </div>
      )}

      {profile.linkedIn && (
        <Button className="w-full justify-center" onClick={() => window.open(profile.linkedIn, "_blank")}>
          Visit LinkedIn
        </Button>
      )}
    </Card>
  );
}
