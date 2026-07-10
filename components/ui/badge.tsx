import * as React from "react";
import { cn } from "../../lib/utils";

export function Badge({ className, children }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-slate-200/80 dark:bg-slate-950/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200 transition-colors duration-300 border border-slate-300/40 dark:border-slate-800/50", className)}>
      {children}
    </span>
  );
}
