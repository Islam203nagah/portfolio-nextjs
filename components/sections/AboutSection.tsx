import type { Profile } from "../../types/profile";
import { User, MapPin, Briefcase, Cake, Flag, Heart, Shield } from "lucide-react";

export function AboutSection({ profile }: { profile: Profile }) {
  const currentExperience = profile.experience?.[0];

  return (
    <section id="about" className="space-y-5 rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-slate-900/40 p-6 shadow-lg shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/40 backdrop-blur-xl transition-all duration-300 w-full">
      <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-white/5 pb-3">
        <User className="h-5.5 w-5.5 text-violet-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">About Me</h2>
      </div>
      <p className="text-slate-600 dark:text-slate-300 leading-8 text-base">
        {profile.summary || "A passionate professional building impactful work."}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 mt-4 pt-2">
        <div className="flex items-start gap-2.5">
          <MapPin className="h-5 w-5 text-violet-500 mt-0.5" />
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Location</h3>
            <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{profile.location || "Available worldwide"}</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Briefcase className="h-5 w-5 text-violet-500 mt-0.5" />
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Current Role</h3>
            <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {currentExperience ? `${currentExperience.company} — ${currentExperience.role}` : "Open for new opportunities"}
            </p>
          </div>
        </div>
        {profile.nationality && (
          <div className="flex items-start gap-2.5">
            <Flag className="h-5 w-5 text-violet-500 mt-0.5" />
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Nationality</h3>
              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{profile.nationality}</p>
            </div>
          </div>
        )}
        {profile.dateOfBirth && (
          <div className="flex items-start gap-2.5">
            <Cake className="h-5 w-5 text-violet-500 mt-0.5" />
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Date of Birth</h3>
              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{profile.dateOfBirth}</p>
            </div>
          </div>
        )}
        {profile.maritalStatus && (
          <div className="flex items-start gap-2.5">
            <Heart className="h-5 w-5 text-violet-500 mt-0.5" />
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Marital Status</h3>
              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{profile.maritalStatus}</p>
            </div>
          </div>
        )}
        {profile.militaryStatus && (
          <div className="flex items-start gap-2.5">
            <Shield className="h-5 w-5 text-violet-500 mt-0.5" />
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Military Status</h3>
              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{profile.militaryStatus}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
