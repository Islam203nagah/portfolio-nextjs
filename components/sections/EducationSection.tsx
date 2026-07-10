import type { Profile } from "../../types/profile";
import { GraduationCap, Award, BookOpen } from "lucide-react";

export function EducationSection({ profile }: { profile: Profile }) {
  const edu = profile.education || [];

  return (
    <section id="education" className="space-y-5 rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-slate-900/40 p-6 shadow-lg shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/40 backdrop-blur-xl transition-all duration-300 w-full">
      <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-white/5 pb-3">
        <GraduationCap className="h-5.5 w-5.5 text-violet-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Education & Certification</h2>
      </div>

      <div className="space-y-4">
        {edu.length ? (
          edu.map((item, index) => (
            <div key={index} className="rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/40 p-5 hover:border-violet-500/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.degree}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{item.institution}</p>
                </div>
                <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20 whitespace-nowrap">{item.year}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {item.gpa && (
                  <span className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-emerald-500" />
                    GPA: {item.gpa}
                  </span>
                )}
                {item.project && (
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-violet-500" />
                    Project: {item.project}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-400">Education details will appear here once added.</p>
        )}
      </div>
    </section>
  );
}
