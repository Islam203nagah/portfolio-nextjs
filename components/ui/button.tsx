import * as React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 focus-visible:ring-slate-500",
  outline:
    "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-750 dark:text-slate-100 dark:hover:bg-white/5",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10",
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
