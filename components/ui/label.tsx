import * as React from "react";
import { cn } from "../../lib/utils";

export function Label({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-1.5", className)} {...props}>
      {children}
    </label>
  );
}
