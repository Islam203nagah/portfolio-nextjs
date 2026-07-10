"use client";

import { cn } from "../../lib/utils";
import { Field } from "./Field";
import { SectionCard } from "./SectionCard";
import { Plus, Trash2 } from "lucide-react";
import type { Profile, LanguageItem } from "../../types/profile";

const inputCls =
  "w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20";

const emptyLanguage = (): LanguageItem => ({
  name: "",
  level: "",
});

interface LanguagesTabProps {
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
}

export function LanguagesTab({ profile, onProfileChange }: LanguagesTabProps) {
  const setLanguages = (languages: LanguageItem[]) =>
    onProfileChange({ ...profile, languages });

  return (
    <SectionCard title="Languages" subtitle="Languages you speak and their proficiency">
      <div className="space-y-4">
        {(profile.languages || []).map((item, index) => (
          <div
            key={index}
            className={cn('group', 'relative', 'rounded-2xl', 'border', 'border-slate-200', 'dark:border-slate-800', 'bg-white/50', 'dark:bg-slate-900/20', 'p-5', 'transition', 'hover:border-slate-350', 'dark:hover:border-slate-700')}
          >
            <div className={cn('mb-3', 'flex', 'items-center', 'justify-between')}>
              <span className={cn('rounded-lg', 'bg-violet-500/10', 'px-2.5', 'py-1', 'text-xs', 'font-semibold', 'text-violet-600', 'dark:text-violet-400', 'border', 'border-violet-500/20')}>
                Language #{index + 1}
              </span>
              <button
                onClick={() => setLanguages(profile.languages.filter((_, i) => i !== index))}
                className={cn('flex', 'items-center', 'gap-1.5', 'rounded-lg', 'px-2.5', 'py-1', 'text-xs', 'font-semibold', 'text-slate-500', 'hover:text-red-500', 'hover:bg-red-500/10', 'transition-colors')}
              >
                <Trash2 className={cn('h-3.5', 'w-3.5')} /> Remove
              </button>
            </div>

            <div className={cn('grid', 'gap-4', 'sm:grid-cols-2')}>
              <Field label="Language" required>
                <input
                  className={inputCls}
                  value={item.name}
                  onChange={(e) => {
                    const next = [...profile.languages];
                    next[index] = { ...item, name: e.target.value };
                    setLanguages(next);
                  }}
                  placeholder="e.g. Arabic"
                />
              </Field>
              <Field label="Proficiency Level" required>
                <input
                  className={inputCls}
                  value={item.level}
                  onChange={(e) => {
                    const next = [...profile.languages];
                    next[index] = { ...item, level: e.target.value };
                    setLanguages(next);
                  }}
                  placeholder="e.g. Native, B2, Fluent"
                />
              </Field>
            </div>
          </div>
        ))}

        <button
          onClick={() => setLanguages([...profile.languages, emptyLanguage()])}
          className={cn('flex', 'w-full', 'items-center', 'justify-center', 'gap-2', 'rounded-xl', 'border', 'border-dashed', 'border-slate-300', 'dark:border-slate-800', 'py-3.5', 'text-xs', 'font-bold', 'text-slate-500', 'hover:border-violet-500/50', 'hover:bg-violet-500/5', 'hover:text-violet-600', 'dark:hover:text-violet-400', 'transition-colors')}
        >
          <Plus className={cn('h-4', 'w-4')} /> Add Language
        </button>
      </div>
    </SectionCard>
  );
}
