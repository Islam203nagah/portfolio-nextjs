import * as React from "react";
import { cn } from "../../lib/utils";

export function Avatar({ src, alt, size = 48, className }: { src?: string; alt?: string; size?: number; className?: string }) {
  return (
    <div style={{ width: size, height: size }} className={cn("overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex-shrink-0 shadow-md", className)}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-slate-500 dark:text-slate-400 text-sm font-semibold">
          ?
        </div>
      )}
    </div>
  );
}
