"use client";

import { cn } from "../../lib/utils";
import { SaveButton } from "./SaveButton";
import { Menu } from "lucide-react";

type Tab = "profile" | "experience" | "projects" | "skills" | "security" | "education" | "trainings" | "achievements" | "languages";

interface NavConfigItem {
  id: Tab;
  icon: React.ReactNode;
  label: string;
}

interface AdminHeaderProps {
  activeTab: Tab;
  navItems: NavConfigItem[];
  saving: boolean;
  onSave: () => void;
  onMenuToggle: () => void;
}

export function AdminHeader({ activeTab, navItems, saving, onSave, onMenuToggle }: AdminHeaderProps) {
  return (
    <div className={cn('sticky', 'top-0', 'z-10', 'border-b', 'border-slate-200', 'dark:border-white/5', 'bg-white/90', 'dark:bg-slate-950/80', 'backdrop-blur-md', 'px-6', 'py-4', 'transition-colors', 'duration-300')}>
      <div className={cn('flex', 'items-center', 'justify-between')}>
        <div className={cn('flex', 'items-center', 'gap-3')}>
          <button
            onClick={onMenuToggle}
            className={cn('lg:hidden', 'rounded-xl', 'p-2', 'border', 'border-slate-200', 'dark:border-white/5', 'hover:bg-slate-100', 'dark:hover:bg-white/5', 'text-slate-600', 'dark:text-slate-300')}
          >
            <Menu className={cn('h-5', 'w-5')} />
          </button>

          <div>
            <h1 className={cn('text-base', 'font-bold', 'text-slate-900', 'dark:text-white', 'flex', 'items-center', 'gap-2', 'uppercase', 'tracking-wide')}>
              {navItems.find((n) => n.id === activeTab)?.icon}
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <p className={cn('text-[10px]', 'font-semibold', 'text-slate-400', 'dark:text-slate-500', 'uppercase', 'tracking-wide')}>
              Modify portfolio details
            </p>
          </div>
        </div>
        {activeTab !== "security" && (
          <SaveButton onClick={onSave} loading={saving} />
        )}
      </div>
    </div>
  );
}
