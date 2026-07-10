import { cn } from "../lib/utils";
export function Footer() {
  return (
    <footer className={cn('border-t', 'border-slate-200', 'dark:border-white/5', 'bg-transparent', 'py-8')}>
      <div className={cn('container', 'text-center', 'text-sm', 'text-slate-500', 'dark:text-slate-400')}>© {new Date().getFullYear()} — Built with Next.js and Tailwind, by Islam Nagah</div>
    </footer>
  );
}
