"use client";

import { cn } from "../../lib/utils";
import { Field } from "./Field";
import { SectionCard } from "./SectionCard";
import { Label } from "../ui/label";
import { Image as ImageIcon } from "lucide-react";
import type { Profile } from "../../types/profile";

const inputCls =
  "w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20";

const textareaCls = `${inputCls} resize-y min-h-28`;

interface ProfileTabProps {
  profile: Profile;
  errors: Record<string, string>;
  onProfileChange: (profile: Profile) => void;
  onPhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileTab({ profile, errors, onProfileChange, onPhotoSelect }: ProfileTabProps) {
  const set = (partial: Partial<Profile>) => onProfileChange({ ...profile, ...partial });

  return (
    <>
      <SectionCard title="Personal Information" subtitle="Publicly visible information on your page">
        <div className={cn('grid', 'gap-5', 'sm:grid-cols-2')}>
          <Field label="Full Name" required error={errors.name}>
            <input
              id="profile-name"
              className={inputCls}
              value={profile.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="e.g. Mohamed bn Sultan"
            />
          </Field>

          <Field label="Professional Title" required error={errors.title}>
            <input
              id="profile-title"
              className={inputCls}
              value={profile.title}
              onChange={(e) => set({ title: e.target.value })}
              placeholder="e.g. Petroleum Engineer"
            />
          </Field>

          <Field label="Location" error={errors.location}>
            <input
              id="profile-location"
              className={inputCls}
              value={profile.location}
              onChange={(e) => set({ location: e.target.value })}
              placeholder="e.g. Asyut, Egypt"
            />
          </Field>

          <Field label="Phone Number" error={errors.phone}>
            <input
              id="profile-phone"
              className={inputCls}
              value={profile.phone || ""}
              onChange={(e) => set({ phone: e.target.value })}
              placeholder="e.g. +20 101 234 5678"
            />
          </Field>

          <Field label="Email Address" error={errors.email}>
            <input
              id="profile-email"
              className={inputCls}
              type="email"
              value={profile.email || ""}
              onChange={(e) => set({ email: e.target.value })}
              placeholder="you@example.com"
            />
          </Field>

          <Field label="LinkedIn URL" error={errors.linkedIn}>
            <input
              id="profile-linkedin"
              className={inputCls}
              value={profile.linkedIn || ""}
              onChange={(e) => set({ linkedIn: e.target.value })}
              placeholder="https://linkedin.com/in/username"
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Personal Details" subtitle="Additional personal information">
        <div className={cn('grid', 'gap-5', 'sm:grid-cols-2')}>
          <Field label="Nationality">
            <input
              id="profile-nationality"
              className={inputCls}
              value={profile.nationality || ""}
              onChange={(e) => set({ nationality: e.target.value })}
              placeholder="e.g. Egyptian"
            />
          </Field>
          <Field label="Date of Birth">
            <input
              id="profile-dob"
              className={inputCls}
              value={profile.dateOfBirth || ""}
              onChange={(e) => set({ dateOfBirth: e.target.value })}
              placeholder="e.g. 8 December 1999"
            />
          </Field>
          <Field label="Marital Status">
            <input
              id="profile-marital"
              className={inputCls}
              value={profile.maritalStatus || ""}
              onChange={(e) => set({ maritalStatus: e.target.value })}
              placeholder="e.g. Married"
            />
          </Field>
          <Field label="Military Status">
            <input
              id="profile-military"
              className={inputCls}
              value={profile.militaryStatus || ""}
              onChange={(e) => set({ militaryStatus: e.target.value })}
              placeholder="e.g. Exempted"
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Profile Photo" subtitle="Browse local file or set image URL">
        <div className={cn('flex', 'flex-col', 'sm:flex-row', 'items-center', 'gap-6')}>
          <div className={cn('h-24', 'w-24', 'overflow-hidden', 'rounded-full', 'border-2', 'border-slate-200', 'dark:border-white/10', 'bg-slate-200', 'dark:bg-slate-800', 'shadow-md', 'flex-shrink-0', 'flex', 'items-center', 'justify-center')}>
            {profile.photo ? (
              <img src={profile.photo} alt="Profile" className={cn('h-full', 'w-full', 'object-cover')} />
            ) : (
              <ImageIcon className={cn('h-8', 'w-8', 'text-slate-400')} />
            )}
          </div>

          <div className={cn('space-y-3', 'w-full')}>
            <div>
              <Label htmlFor="image-upload" className={cn('cursor-pointer', 'inline-flex', 'items-center', 'gap-2', 'rounded-xl', 'bg-slate-100', 'hover:bg-slate-200', 'dark:bg-white/5', 'dark:hover:bg-white/10', 'px-4', 'py-2', 'text-xs', 'font-bold', 'text-slate-700', 'dark:text-slate-250', 'border', 'border-slate-300', 'dark:border-slate-800', 'shadow-sm', 'transition-all', 'duration-300')}>
                <ImageIcon className={cn('h-4', 'w-4')} />
                <span>Browse Photo...</span>
              </Label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={onPhotoSelect}
                className="hidden"
              />
            </div>

            <Field label="Or paste photo image URL" error={errors.photo}>
              <input
                id="profile-photo"
                className={inputCls}
                value={profile.photo || ""}
                onChange={(e) => set({ photo: e.target.value })}
                placeholder="https://example.com/photo.jpg"
              />
            </Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Summary / Biography" subtitle="Tell visitor about your background">
        <Field label="Summary Description" error={errors.summary}>
          <textarea
            id="profile-summary"
            className={textareaCls}
            value={profile.summary || ""}
            onChange={(e) => set({ summary: e.target.value })}
            placeholder="Short description of your background and goals…"
          />
        </Field>
      </SectionCard>
    </>
  );
}
