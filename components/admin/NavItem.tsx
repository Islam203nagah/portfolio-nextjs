"use client";

import { cn } from "../../lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

export function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-violet-600/20 text-violet-600 dark:text-violet-300 shadow-sm border border-violet-500/10"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"
      }`}
    >
      <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-base transition-colors ${
        active ? "bg-violet-600/30 text-violet-600 dark:text-violet-300" : "bg-slate-200/50 dark:bg-white/5 group-hover:bg-slate-200 dark:group-hover:bg-white/10"
      }`}>
        {icon}
      </span>
      {label}
      {active && (
        <span className={cn('ml-auto', 'h-1.5', 'w-1.5', 'rounded-full', 'bg-violet-500', 'dark:bg-violet-400')} />
      )}
    </button>
  );
}
