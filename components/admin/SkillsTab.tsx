"use client";

import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { Field } from "./Field";
import { SectionCard } from "./SectionCard";
import type { Profile } from "../../types/profile";

const inputCls =
  "w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20";

interface SkillsTabProps {
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
}

export function SkillsTab({ profile, onProfileChange }: SkillsTabProps) {
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    if (profile) {
      setSkillInput((profile.skills || []).join(", "));
    }
  }, [profile?.skills?.length]);

  return (
    <SectionCard title="Skills" subtitle="Add tech stack tags which display on profile">
      <div className="space-y-5">
        <div className={cn('min-h-16', 'flex', 'flex-wrap', 'gap-2.5', 'rounded-xl', 'border', 'border-slate-200', 'dark:border-slate-800', 'bg-white/50', 'dark:bg-slate-900/20', 'p-4')}>
          {(profile.skills || []).length === 0 ? (
            <p className={cn('text-xs', 'font-semibold', 'text-slate-400')}>No skills added yet. Use field below to insert tags.</p>
          ) : (
            (profile.skills || []).map((skill, index) => (
              <span
                key={index}
                className={cn('flex', 'items-center', 'gap-1.5', 'rounded-lg', 'border', 'border-violet-500/20', 'bg-violet-500/10', 'px-3', 'py-1', 'text-xs', 'font-semibold', 'text-violet-600', 'dark:text-violet-300')}
              >
                {skill}
                <button
                  onClick={() =>
                    onProfileChange({
                      ...profile,
                      skills: (profile.skills || []).filter((_, i) => i !== index),
                    })
                  }
                  className={cn('ml-1', 'rounded', 'hover:text-red-500', 'transition-colors', 'text-[10px]')}
                >
                  ✕
                </button>
              </span>
            ))
          )}
        </div>

        <div className={cn('flex', 'gap-3')}>
          <Field label="Skills (separate with comma)">
            <input
              id="skills-input"
              className={inputCls}
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onBlur={(e) => {
                if (!profile) return;
                const parsed = e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                onProfileChange({ ...profile, skills: parsed });
                setSkillInput(parsed.join(", "));
              }}
              placeholder="e.g. Petroleum Engineering, Refinery Operations, HYSYS"
            />
          </Field>
        </div>
      </div>
    </SectionCard>
  );
}
