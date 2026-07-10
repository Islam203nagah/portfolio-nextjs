import * as React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/40 p-6 shadow-lg shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/40 backdrop-blur-xl transition-all duration-300",
        className
      )}
      {...props}
    />
  );
}
