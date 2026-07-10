"use client";

import { cn } from "../../lib/utils";
import { Field } from "./Field";
import { SectionCard } from "./SectionCard";
import { Plus, Trash2 } from "lucide-react";
import type { Profile, EducationItem } from "../../types/profile";

const inputCls =
  "w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20";

const emptyEducation = (): EducationItem => ({
  degree: "",
  institution: "",
  year: "",
  gpa: "",
  project: "",
});

interface EducationTabProps {
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
}

export function EducationTab({ profile, onProfileChange }: EducationTabProps) {
  const setEducation = (education: EducationItem[]) =>
    onProfileChange({ ...profile, education });

  return (
    <SectionCard title="Education & Certification" subtitle="Add your academic background">
      <div className="space-y-4">
        {(profile.education || []).map((item, index) => (
          <div
            key={index}
            className={cn('group', 'relative', 'rounded-2xl', 'border', 'border-slate-200', 'dark:border-slate-800', 'bg-white/50', 'dark:bg-slate-900/20', 'p-5', 'transition', 'hover:border-slate-350', 'dark:hover:border-slate-700')}
          >
            <div className={cn('mb-3', 'flex', 'items-center', 'justify-between')}>
              <span className={cn('rounded-lg', 'bg-violet-500/10', 'px-2.5', 'py-1', 'text-xs', 'font-semibold', 'text-violet-600', 'dark:text-violet-400', 'border', 'border-violet-500/20')}>
                Education #{index + 1}
              </span>
              <button
                onClick={() => setEducation(profile.education.filter((_, i) => i !== index))}
                className={cn('flex', 'items-center', 'gap-1.5', 'rounded-lg', 'px-2.5', 'py-1', 'text-xs', 'font-semibold', 'text-slate-500', 'hover:text-red-500', 'hover:bg-red-500/10', 'transition-colors')}
              >
                <Trash2 className={cn('h-3.5', 'w-3.5')} /> Remove
              </button>
            </div>

            <div className={cn('grid', 'gap-4', 'sm:grid-cols-2')}>
              <Field label="Degree" required>
                <input
                  className={inputCls}
                  value={item.degree}
                  onChange={(e) => {
                    const next = [...profile.education];
                    next[index] = { ...item, degree: e.target.value };
                    setEducation(next);
                  }}
                  placeholder="e.g. Bachelor's in Chemical Engineering"
                />
              </Field>
              <Field label="Institution" required>
                <input
                  className={inputCls}
                  value={item.institution}
                  onChange={(e) => {
                    const next = [...profile.education];
                    next[index] = { ...item, institution: e.target.value };
                    setEducation(next);
                  }}
                  placeholder="e.g. Minia University"
                />
              </Field>
              <Field label="Year / Period">
                <input
                  className={inputCls}
                  value={item.year}
                  onChange={(e) => {
                    const next = [...profile.education];
                    next[index] = { ...item, year: e.target.value };
                    setEducation(next);
                  }}
                  placeholder="e.g. 2019 – 2024"
                />
              </Field>
              <Field label="GPA">
                <input
                  className={inputCls}
                  value={item.gpa}
                  onChange={(e) => {
                    const next = [...profile.education];
                    next[index] = { ...item, gpa: e.target.value };
                    setEducation(next);
                  }}
                  placeholder="e.g. 3.54 / 4.0"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Graduation Project">
                  <input
                    className={inputCls}
                    value={item.project}
                    onChange={(e) => {
                      const next = [...profile.education];
                      next[index] = { ...item, project: e.target.value };
                      setEducation(next);
                    }}
                    placeholder="e.g. Delayed Coker Unit"
                  />
                </Field>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => setEducation([...profile.education, emptyEducation()])}
          className={cn('flex', 'w-full', 'items-center', 'justify-center', 'gap-2', 'rounded-xl', 'border', 'border-dashed', 'border-slate-300', 'dark:border-slate-800', 'py-3.5', 'text-xs', 'font-bold', 'text-slate-500', 'hover:border-violet-500/50', 'hover:bg-violet-500/5', 'hover:text-violet-600', 'dark:hover:text-violet-400', 'transition-colors')}
        >
          <Plus className={cn('h-4', 'w-4')} /> Add Education
        </button>
      </div>
    </SectionCard>
  );
}
