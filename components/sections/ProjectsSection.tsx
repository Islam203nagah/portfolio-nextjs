import type { Profile } from "../../types/profile";
import { FolderGit2, ArrowUpRight } from "lucide-react";

export function ProjectsSection({ profile }: { profile: Profile }) {
  const projects = profile.projects || [];

  return (
    <section id="projects" className="space-y-5 rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-slate-900/40 p-6 shadow-lg shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/40 backdrop-blur-xl transition-all duration-300 w-full">
      <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-white/5 pb-3">
        <FolderGit2 className="h-5.5 w-5.5 text-violet-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured Projects</h2>
      </div>
      
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.length ? (
          projects.map((p, index) => (
            <article key={`${p.name}-${index}`} className="group relative rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/40 p-5 hover:border-violet-500/30 dark:hover:border-violet-500/20 transition-all duration-300 hover:shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {p.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {p.description}
                </p>
              </div>
              {p.link && (
                <div className="mt-4 pt-3 border-t border-slate-200/30 dark:border-white/5">
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    <span>View Project</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </article>
          ))
        ) : (
          <p className="text-slate-400 col-span-2">Projects will appear here once you add them in the admin panel.</p>
        )}
      </div>
    </section>
  );
}
