import type { Profile } from "../../types/profile";
import { Globe } from "lucide-react";

export function LanguagesSection({ profile }: { profile: Profile }) {
  const languages = profile.languages || [];

  return (
    <section id="languages" className="space-y-5 rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-slate-900/40 p-6 shadow-lg shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/40 backdrop-blur-xl transition-all duration-300 w-full">
      <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-white/5 pb-3">
        <Globe className="h-5.5 w-5.5 text-violet-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Languages</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {languages.length ? (
          languages.map((item, index) => (
            <div key={index} className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/40 px-4 py-3 hover:border-violet-500/30 transition-all duration-300">
              <span className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase">{item.level}</span>
            </div>
          ))
        ) : (
          <p className="text-slate-400">Languages will appear here once added.</p>
        )}
      </div>
    </section>
  );
}
