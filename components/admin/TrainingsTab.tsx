"use client";

import { cn } from "../../lib/utils";
import { Field } from "./Field";
import { SectionCard } from "./SectionCard";
import { Plus, Trash2 } from "lucide-react";
import type { Profile, TrainingItem } from "../../types/profile";

const inputCls =
  "w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20";

const emptyTraining = (): TrainingItem => ({
  company: "",
  date: "",
  description: "",
});

interface TrainingsTabProps {
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
}

export function TrainingsTab({ profile, onProfileChange }: TrainingsTabProps) {
  const setTrainings = (trainings: TrainingItem[]) =>
    onProfileChange({ ...profile, trainings });

  return (
    <SectionCard title="Training" subtitle="Short training programs and internships">
      <div className="space-y-4">
        {(profile.trainings || []).map((item, index) => (
          <div
            key={index}
            className={cn('group', 'relative', 'rounded-2xl', 'border', 'border-slate-200', 'dark:border-slate-800', 'bg-white/50', 'dark:bg-slate-900/20', 'p-5', 'transition', 'hover:border-slate-350', 'dark:hover:border-slate-700')}
          >
            <div className={cn('mb-3', 'flex', 'items-center', 'justify-between')}>
              <span className={cn('rounded-lg', 'bg-violet-500/10', 'px-2.5', 'py-1', 'text-xs', 'font-semibold', 'text-violet-600', 'dark:text-violet-400', 'border', 'border-violet-500/20')}>
                Training #{index + 1}
              </span>
              <button
                onClick={() => setTrainings(profile.trainings.filter((_, i) => i !== index))}
                className={cn('flex', 'items-center', 'gap-1.5', 'rounded-lg', 'px-2.5', 'py-1', 'text-xs', 'font-semibold', 'text-slate-500', 'hover:text-red-500', 'hover:bg-red-500/10', 'transition-colors')}
              >
                <Trash2 className={cn('h-3.5', 'w-3.5')} /> Remove
              </button>
            </div>

            <div className={cn('grid', 'gap-4', 'sm:grid-cols-2')}>
              <Field label="Company / Organization" required>
                <input
                  className={inputCls}
                  value={item.company}
                  onChange={(e) => {
                    const next = [...profile.trainings];
                    next[index] = { ...item, company: e.target.value };
                    setTrainings(next);
                  }}
                  placeholder="e.g. Pharaonic Petroleum Company"
                />
              </Field>
              <Field label="Date / Period">
                <input
                  className={inputCls}
                  value={item.date}
                  onChange={(e) => {
                    const next = [...profile.trainings];
                    next[index] = { ...item, date: e.target.value };
                    setTrainings(next);
                  }}
                  placeholder="e.g. July 2023"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Description">
                  <input
                    className={inputCls}
                    value={item.description}
                    onChange={(e) => {
                      const next = [...profile.trainings];
                      next[index] = { ...item, description: e.target.value };
                      setTrainings(next);
                    }}
                    placeholder="Brief description of the training"
                  />
                </Field>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => setTrainings([...profile.trainings, emptyTraining()])}
          className={cn('flex', 'w-full', 'items-center', 'justify-center', 'gap-2', 'rounded-xl', 'border', 'border-dashed', 'border-slate-300', 'dark:border-slate-800', 'py-3.5', 'text-xs', 'font-bold', 'text-slate-500', 'hover:border-violet-500/50', 'hover:bg-violet-500/5', 'hover:text-violet-600', 'dark:hover:text-violet-400', 'transition-colors')}
        >
          <Plus className={cn('h-4', 'w-4')} /> Add Training
        </button>
      </div>
    </SectionCard>
  );
}
