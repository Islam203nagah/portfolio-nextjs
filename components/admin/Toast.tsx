"use client";

import { useEffect } from "react";
import { cn } from "../../lib/utils";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors =
    type === "success"
      ? "border-emerald-500/40 bg-emerald-950/95 text-emerald-200"
      : type === "error"
      ? "border-red-500/40 bg-red-400/95 text-red-600"
      : "border-violet-500/40 bg-violet-950/95 text-violet-200";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold shadow-2xl backdrop-blur-md animate-fade-in ${colors}`}
    >
      <span className={cn('flex', 'h-5', 'w-5', 'flex-shrink-0', 'items-center', 'justify-center', 'rounded-full', 'bg-current/10', 'text-xs', 'font-bold')}>
        {type === "success" ? "✓" : type === "error" ? "✕" : "i"}
      </span>
      {message}
      <button onClick={onClose} className={cn('ml-2', 'opacity-65', 'hover:opacity-100', 'transition-opacity')}>
        ✕
      </button>
    </div>
  );
}
