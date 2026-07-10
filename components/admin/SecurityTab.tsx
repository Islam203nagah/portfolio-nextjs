"use client";

import { cn } from "../../lib/utils";
import { Field } from "./Field";
import { SectionCard } from "./SectionCard";
import { Lock } from "lucide-react";

const inputCls =
  "w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20";

interface SecurityTabProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  errors: Record<string, string>;
  pwSaving: boolean;
  onCurrentPasswordChange: (v: string) => void;
  onNewPasswordChange: (v: string) => void;
  onConfirmPasswordChange: (v: string) => void;
  onChangePassword: (e: React.FormEvent) => Promise<void>;
}

export function SecurityTab({
  currentPassword,
  newPassword,
  confirmPassword,
  errors,
  pwSaving,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onChangePassword,
}: SecurityTabProps) {
  return (
    <>
      <SectionCard title="Password Update" subtitle="Change credentials to log in">
        <form onSubmit={onChangePassword} className={cn('space-y-4', 'max-w-md')}>
          <Field label="Current Password" required error={errors.currentPassword}>
            <input
              id="current-password"
              className={inputCls}
              type="password"
              value={currentPassword}
              onChange={(e) => onCurrentPasswordChange(e.target.value)}
              placeholder="Current Password"
              autoComplete="current-password"
            />
          </Field>
          <Field label="New Password" required error={errors.newPassword}>
            <input
              id="new-password"
              className={inputCls}
              type="password"
              value={newPassword}
              onChange={(e) => onNewPasswordChange(e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
          </Field>
          <Field label="Confirm New Password" required error={errors.confirmPassword}>
            <input
              id="confirm-password"
              className={inputCls}
              type="password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
          </Field>
          <button
            type="submit"
            disabled={pwSaving}
            className={cn('flex', 'items-center', 'gap-2', 'rounded-xl', 'bg-slate-800', 'dark:bg-slate-100', 'text-white', 'dark:text-slate-950', 'px-5', 'py-2.5', 'text-xs', 'font-bold', 'hover:bg-slate-700', 'dark:hover:bg-slate-200', 'transition-colors', 'disabled:opacity-50')}
          >
            {pwSaving ? (
              <>
                <span className={cn('h-3.5', 'w-3.5', 'rounded-full', 'border-2', 'border-slate-400', 'border-t-slate-800', 'animate-spin')} />
                Updating…
              </>
            ) : (
              <>
                <Lock className={cn('h-3.5', 'w-3.5')} />
                Update Password
              </>
            )}
          </button>
        </form>
      </SectionCard>

      <SectionCard title="Session & Protection Details" subtitle="Active sessions security">
        <div className={cn('grid', 'gap-4', 'sm:grid-cols-2')}>
          <div className={cn('rounded-xl', 'border', 'border-slate-200', 'dark:border-slate-800', 'p-4', 'bg-slate-50', 'dark:bg-slate-900/30')}>
            <p className={cn('text-[10px]', 'font-bold', 'text-slate-400', 'uppercase', 'tracking-wide')}>Status</p>
            <p className={cn('text-sm', 'font-semibold', 'text-emerald-600', 'dark:text-emerald-400', 'flex', 'items-center', 'gap-1.5', 'mt-1')}>
              <span className={cn('h-2', 'w-2', 'rounded-full', 'bg-emerald-500', 'shadow', 'shadow-emerald-500/50', 'animate-pulse')} />
              Protected Connection
            </p>
          </div>
          <div className={cn('rounded-xl', 'border', 'border-slate-200', 'dark:border-slate-800', 'p-4', 'bg-slate-50', 'dark:bg-slate-900/30')}>
            <p className={cn('text-[10px]', 'font-bold', 'text-slate-400', 'uppercase', 'tracking-wide')}>Token Rotation</p>
            <p className={cn('text-sm', 'font-semibold', 'text-slate-750', 'dark:text-slate-200', 'mt-1')}>
              Access (15m) + Rotated Refresh (7d)
            </p>
          </div>
        </div>
      </SectionCard>
    </>
  );
}
