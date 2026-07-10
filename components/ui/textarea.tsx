import * as React from "react";
import { cn } from "../../lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[80px] w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-300",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
