"use client";

import { cn } from "../../lib/utils";

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function Field({ label, required, error, children }: FieldProps) {
  return (
    <label className={cn('block', 'w-full')}>
      <span className={cn('mb-1.5', 'flex', 'items-center', 'gap-1', 'text-[10px]', 'font-bold', 'uppercase', 'tracking-wider', 'text-slate-500', 'dark:text-slate-400')}>
        {label}
        {required && <span className={cn('text-violet-500', 'dark:text-violet-400')}>*</span>}
      </span>
      {children}
      {error && <p className={cn('mt-1', 'text-xs', 'text-red-500', 'dark:text-red-400')}>{error}</p>}
    </label>
  );
}
