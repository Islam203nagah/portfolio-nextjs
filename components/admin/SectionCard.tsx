"use client";

import { cn } from "../../lib/utils";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <div className={cn('rounded-2xl', 'border', 'border-slate-200', 'dark:border-white/5', 'bg-white/70', 'dark:bg-slate-900/40', 'p-6', 'shadow-md', 'dark:shadow-xl', 'dark:shadow-black/20')}>
      <div className={cn('mb-5', 'border-b', 'border-slate-200', 'dark:border-white/5', 'pb-4')}>
        <h2 className={cn('text-sm', 'font-bold', 'text-slate-800', 'dark:text-white', 'uppercase', 'tracking-wider')}>{title}</h2>
        {subtitle && <p className={cn('mt-1', 'text-xs', 'text-slate-500', 'dark:text-slate-400', 'font-medium')}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
