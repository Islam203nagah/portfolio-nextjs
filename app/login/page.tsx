"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import { api } from "../../lib/apiClient";
import { Field } from "../../components/admin/Field";
import { Toast } from "../../components/admin/Toast";
import { Lock } from "lucide-react";

const inputCls =
  "w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});

    try {
      const res = await api.post("/api/admin/login", { username: username.trim(), password });
      if (res.data.ok) {
        setToast({ message: "Welcome back, " + username.trim(), type: "success" });
        setTimeout(() => router.push("/admin"), 500);
      } else {
        setToast({ message: res.data.error || "Invalid credentials", type: "error" });
      }
    } catch (err: any) {
      setToast({ message: err.response?.data?.error || "Login failed", type: "error" });
    }
  }

  return (
    <main className={cn('flex', 'min-h-screen', 'items-center', 'justify-center', 'bg-slate-50', 'dark:bg-slate-950', 'px-4', 'py-16', 'transition-colors', 'duration-300')}>
      <div className={cn('w-full', 'max-w-md')}>

        <div className={cn('mb-8', 'text-center', 'animate-fade-in')}>
          <div className={cn('mx-auto', 'mb-4', 'flex', 'h-14', 'w-14', 'items-center', 'justify-center', 'rounded-2xl', 'bg-violet-500/10', 'text-3xl', 'shadow-lg', 'border', 'border-violet-500/20', 'text-violet-600')}>
            <Lock className={cn('h-6', 'w-6')} />
          </div>
          <h1 className={cn('text-2xl', 'font-extrabold', 'text-slate-900', 'dark:text-white')}>Admin Dashboard</h1>
          <p className={cn('mt-1.5', 'text-sm', 'text-slate-500', 'dark:text-slate-400')}>Secure entry for admin actions</p>
        </div>

        <form
          onSubmit={login}
          className={cn('rounded-[2rem]', 'border', 'border-slate-200', 'dark:border-white/10', 'bg-white/90', 'dark:bg-slate-900/80', 'p-8', 'shadow-2xl', 'backdrop-blur-md', 'transition-all', 'duration-300', 'animate-fade-in')}
        >
          <div className="space-y-4">
            <Field label="Username" required error={errors.username}>
              <input
                id="admin-username"
                className={inputCls}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                autoComplete="username"
              />
            </Field>
            <Field label="Password" required error={errors.password}>
              <input
                id="admin-password"
                className={inputCls}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
              />
            </Field>
          </div>

          <button
            type="submit"
            className={cn('mt-6', 'w-full', 'rounded-xl', 'bg-violet-600', 'py-3', 'text-sm', 'font-bold', 'text-white', 'shadow-md', 'shadow-violet-500/20', 'hover:bg-violet-500', 'hover:scale-[1.01]', 'active:scale-[0.99]', 'transition-all')}
          >
            Sign in
          </button>
        </form>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}
