"use client";

import { cn } from "../../lib/utils";
import { Field } from "./Field";
import { SectionCard } from "./SectionCard";
import { Plus, Trash2 } from "lucide-react";
import type { Profile, AchievementItem } from "../../types/profile";

const inputCls =
  "w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20";

const emptyAchievement = (): AchievementItem => ({
  title: "",
  description: "",
});

interface AchievementsTabProps {
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
}

export function AchievementsTab({ profile, onProfileChange }: AchievementsTabProps) {
  const setAchievements = (achievements: AchievementItem[]) =>
    onProfileChange({ ...profile, achievements });

  return (
    <SectionCard title="Key Achievements" subtitle="Academic and professional accomplishments">
      <div className="space-y-4">
        {(profile.achievements || []).map((item, index) => (
          <div
            key={index}
            className={cn('group', 'relative', 'rounded-2xl', 'border', 'border-slate-200', 'dark:border-slate-800', 'bg-white/50', 'dark:bg-slate-900/20', 'p-5', 'transition', 'hover:border-slate-350', 'dark:hover:border-slate-700')}
          >
            <div className={cn('mb-3', 'flex', 'items-center', 'justify-between')}>
              <span className={cn('rounded-lg', 'bg-amber-500/10', 'px-2.5', 'py-1', 'text-xs', 'font-semibold', 'text-amber-600', 'dark:text-amber-400', 'border', 'border-amber-500/20')}>
                Achievement #{index + 1}
              </span>
              <button
                onClick={() => setAchievements(profile.achievements.filter((_, i) => i !== index))}
                className={cn('flex', 'items-center', 'gap-1.5', 'rounded-lg', 'px-2.5', 'py-1', 'text-xs', 'font-semibold', 'text-slate-500', 'hover:text-red-500', 'hover:bg-red-500/10', 'transition-colors')}
              >
                <Trash2 className={cn('h-3.5', 'w-3.5')} /> Remove
              </button>
            </div>

            <div className="space-y-3">
              <Field label="Title" required>
                <input
                  className={inputCls}
                  value={item.title}
                  onChange={(e) => {
                    const next = [...profile.achievements];
                    next[index] = { ...item, title: e.target.value };
                    setAchievements(next);
                  }}
                  placeholder="e.g. 3rd Place in Department"
                />
              </Field>
              <Field label="Description">
                <input
                  className={inputCls}
                  value={item.description}
                  onChange={(e) => {
                    const next = [...profile.achievements];
                    next[index] = { ...item, description: e.target.value };
                    setAchievements(next);
                  }}
                  placeholder="Brief description of the achievement"
                />
              </Field>
            </div>
          </div>
        ))}

        <button
          onClick={() => setAchievements([...profile.achievements, emptyAchievement()])}
          className={cn('flex', 'w-full', 'items-center', 'justify-center', 'gap-2', 'rounded-xl', 'border', 'border-dashed', 'border-slate-300', 'dark:border-slate-800', 'py-3.5', 'text-xs', 'font-bold', 'text-slate-500', 'hover:border-amber-500/50', 'hover:bg-amber-500/5', 'hover:text-amber-600', 'dark:hover:text-amber-400', 'transition-colors')}
        >
          <Plus className={cn('h-4', 'w-4')} /> Add Achievement
        </button>
      </div>
    </SectionCard>
  );
}
