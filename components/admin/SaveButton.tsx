"use client";

import { cn } from "../../lib/utils";
import { Save } from "lucide-react";

interface SaveButtonProps {
  onClick: () => void;
  loading: boolean;
}

export function SaveButton({ onClick, loading }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn('flex', 'items-center', 'gap-2', 'rounded-xl', 'bg-violet-600', 'px-5', 'py-2.5', 'text-sm', 'font-bold', 'text-white', 'shadow-md', 'shadow-violet-500/20', 'transition', 'hover:bg-violet-500', 'hover:scale-[1.02]', 'active:scale-[0.98]', 'disabled:opacity-50')}
    >
      {loading ? (
        <>
          <span className={cn('h-3.5', 'w-3.5', 'rounded-full', 'border-2', 'border-white/30', 'border-t-white', 'animate-spin')} />
          Saving…
        </>
      ) : (
        <>
          <Save className={cn('h-4', 'w-4')} />
          Save Changes
        </>
      )}
    </button>
  );
}
