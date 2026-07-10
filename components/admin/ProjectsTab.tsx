"use client";

import { cn } from "../../lib/utils";
import { Field } from "./Field";
import { SectionCard } from "./SectionCard";
import { Plus, Trash2 } from "lucide-react";
import type { Profile, ProjectItem } from "../../types/profile";

const inputCls =
  "w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20";

const textareaCls = `${inputCls} resize-y min-h-28`;

const emptyProject = (): ProjectItem => ({ name: "", description: "", link: "" });

interface ProjectsTabProps {
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
}

export function ProjectsTab({ profile, onProfileChange }: ProjectsTabProps) {
  const setProjects = (projects: ProjectItem[]) =>
    onProfileChange({ ...profile, projects });

  return (
    <SectionCard title="Projects" subtitle="Showcase your notable applications or research">
      <div className="space-y-4">
        {(profile.projects || []).map((item, index) => (
          <div
            key={index}
            className={cn('group', 'relative', 'rounded-2xl', 'border', 'border-slate-200', 'dark:border-slate-800', 'bg-white/50', 'dark:bg-slate-900/20', 'p-5', 'transition', 'hover:border-slate-350', 'dark:hover:border-slate-700')}
          >
            <div className={cn('mb-3', 'flex', 'items-center', 'justify-between')}>
              <span className={cn('rounded-lg', 'bg-emerald-500/10', 'px-2.5', 'py-1', 'text-xs', 'font-semibold', 'text-emerald-600', 'dark:text-emerald-400', 'border', 'border-emerald-500/20')}>
                Project #{index + 1}
              </span>
              <button
                onClick={() => setProjects(profile.projects.filter((_, i) => i !== index))}
                className={cn('flex', 'items-center', 'gap-1.5', 'rounded-lg', 'px-2.5', 'py-1', 'text-xs', 'font-semibold', 'text-slate-500', 'hover:text-red-500', 'hover:bg-red-500/10', 'transition-colors')}
              >
                <Trash2 className={cn('h-3.5', 'w-3.5')} /> Remove
              </button>
            </div>

            <div className="space-y-3">
              <Field label="Project Title" required>
                <input
                  className={inputCls}
                  value={item.name}
                  onChange={(e) => {
                    const next = [...profile.projects];
                    next[index] = { ...item, name: e.target.value };
                    setProjects(next);
                  }}
                  placeholder="Project name"
                />
              </Field>
              <Field label="Description" required>
                <textarea
                  className={textareaCls}
                  value={item.description}
                  onChange={(e) => {
                    const next = [...profile.projects];
                    next[index] = { ...item, description: e.target.value };
                    setProjects(next);
                  }}
                  placeholder="Explain what the project is..."
                />
              </Field>
              <Field label="Link / URL">
                <input
                  className={inputCls}
                  value={item.link || ""}
                  onChange={(e) => {
                    const next = [...profile.projects];
                    next[index] = { ...item, link: e.target.value };
                    setProjects(next);
                  }}
                  placeholder="https://github.com/..."
                />
              </Field>
            </div>
          </div>
        ))}

        <button
          onClick={() => setProjects([...profile.projects, emptyProject()])}
          className={cn('flex', 'w-full', 'items-center', 'justify-center', 'gap-2', 'rounded-xl', 'border', 'border-dashed', 'border-slate-300', 'dark:border-slate-800', 'py-3.5', 'text-xs', 'font-bold', 'text-slate-500', 'hover:border-emerald-500/50', 'hover:bg-emerald-500/5', 'hover:text-emerald-600', 'dark:hover:text-emerald-400', 'transition-colors')}
        >
          <Plus className={cn('h-4', 'w-4')} /> Add Project Showcase
        </button>
      </div>
    </SectionCard>
  );
}
