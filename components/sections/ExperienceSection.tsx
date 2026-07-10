import type { Profile } from "../../types/profile";
import { Briefcase, Calendar, Building2 } from "lucide-react";

export function ExperienceSection({ profile }: { profile: Profile }) {
  const experience = profile.experience || [];

  return (
    <section id="experience" className="space-y-5 rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-slate-900/40 p-6 shadow-lg shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/40 backdrop-blur-xl transition-all duration-300 w-full">
      <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-white/5 pb-3">
        <Briefcase className="h-5.5 w-5.5 text-violet-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Work Experience</h2>
      </div>
      
      <div className="relative pl-6 border-l border-slate-200 dark:border-white/5 space-y-6 ml-2.5">
        {experience.length ? (
          experience.map((e, index) => (
            <div key={`${e.company}-${e.role}-${index}`} className="relative group animate-slide-right">
              {/* Timeline bubble */}
              <div className="absolute -left-[29px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white dark:bg-slate-950 border-2 border-violet-500 group-hover:scale-125 transition-transform duration-300" />
              
              <div className="rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/40 p-5 hover:border-violet-500/30 dark:hover:border-violet-500/20 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{e.role}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-600 dark:text-slate-350">
                      <Building2 className="h-4 w-4 text-slate-400 dark:text-slate-400" />
                      <span>{e.company}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-center text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{e.period}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{e.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-400">Experience will appear here once you add it in the admin panel.</p>
        )}
      </div>
    </section>
  );
}
