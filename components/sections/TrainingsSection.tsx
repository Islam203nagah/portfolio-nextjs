import type { Profile } from "../../types/profile";
import { FlaskConical, Calendar } from "lucide-react";

export function TrainingsSection({ profile }: { profile: Profile }) {
  const trainings = profile.trainings || [];

  return (
    <section id="trainings" className="space-y-5 rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-slate-900/40 p-6 shadow-lg shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/40 backdrop-blur-xl transition-all duration-300 w-full">
      <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-white/5 pb-3">
        <FlaskConical className="h-5.5 w-5.5 text-violet-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Training</h2>
      </div>

      <div className="space-y-3">
        {trainings.length ? (
          trainings.map((item, index) => (
            <div key={index} className="flex items-start gap-3 rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/40 p-4 hover:border-violet-500/30 transition-all duration-300">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500 border border-violet-500/20">
                <FlaskConical className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.company}</h3>
                {item.date && (
                  <p className="flex items-center gap-1 mt-1 text-xs font-semibold text-violet-600 dark:text-violet-400">
                    <Calendar className="h-3 w-3" />
                    {item.date}
                  </p>
                )}
                {item.description && (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-400">Training details will appear here once added.</p>
        )}
      </div>
    </section>
  );
}
