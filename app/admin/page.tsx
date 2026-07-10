"use client";

import { useEffect, useState } from "react";
import type { ExperienceItem, Profile, ProjectItem } from "../../types/profile";
import { Label } from "../../components/ui/label";
import { api } from "../../lib/apiClient";
import { cn } from "../../lib/utils";
import {
  User,
  Briefcase,
  FolderGit2,
  Cpu,
  Lock,
  LogOut,
  Menu,
  X,
  Plus,
  Trash2,
  Save,
  Phone,
  Mail,
  Linkedin,
  MapPin,
  Image as ImageIcon,
  Shield,
  Activity,
  Sun,
  Moon,
  CheckCircle,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────── */
const emptyExperience = (): ExperienceItem => ({
  company: "",
  role: "",
  period: "",
  description: "",
});
const emptyProject = (): ProjectItem => ({ name: "", description: "", link: "" });

type Tab = "profile" | "experience" | "projects" | "skills" | "security";

/* ─── toast ─────────────────────────────────────────────────── */
interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors =
    type === "success"
      ? "border-emerald-500/40 bg-emerald-950/95 text-emerald-200"
      : type === "error"
      ? "border-red-500/40 bg-red-400/95 text-red-600"
      : "border-violet-500/40 bg-violet-950/95 text-violet-200";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold shadow-2xl backdrop-blur-md animate-fade-in ${colors}`}
    >
      <span className={cn('flex', 'h-5', 'w-5', 'flex-shrink-0', 'items-center', 'justify-center', 'rounded-full', 'bg-current/10', 'text-xs', 'font-bold')}>
        {type === "success" ? "✓" : type === "error" ? "✕" : "i"}
      </span>
      {message}
      <button onClick={onClose} className={cn('ml-2', 'opacity-65', 'hover:opacity-100', 'transition-opacity')}>
        ✕
      </button>
    </div>
  );
}

/* ─── sidebar nav item ───────────────────────────────────────── */
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-violet-600/20 text-violet-600 dark:text-violet-300 shadow-sm border border-violet-500/10"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"
      }`}
    >
      <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-base transition-colors ${
        active ? "bg-violet-600/30 text-violet-600 dark:text-violet-300" : "bg-slate-200/50 dark:bg-white/5 group-hover:bg-slate-200 dark:group-hover:bg-white/10"
      }`}>
        {icon}
      </span>
      {label}
      {active && (
        <span className={cn('ml-auto', 'h-1.5', 'w-1.5', 'rounded-full', 'bg-violet-500', 'dark:bg-violet-400')} />
      )}
    </button>
  );
}

/* ─── field components ──────────────────────────────────────── */
interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, required, error, children }: FieldProps) {
  return (
    <label className={cn('block', 'w-full')}>
      <span className={cn('mb-1.5', 'flex', 'items-center', 'gap-1', 'text-[10px]', 'font-bold', 'uppercase', 'tracking-wider', 'text-slate-500', 'dark:text-slate-400')}>
        {label}
        {required && <span className={cn('text-violet-500', 'dark:text-violet-400')}>*</span>}
      </span>
      {children}
      {error && <p className={cn('mt-1', 'text-xs', 'text-red-500', 'dark:text-red-400')}>{error}</p>}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20";

const textareaCls = `${inputCls} resize-y min-h-28`;

/* ─── section card ──────────────────────────────────────────── */
function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className={cn('rounded-2xl', 'border', 'border-slate-200', 'dark:border-white/5', 'bg-white/70', 'dark:bg-slate-900/40', 'p-6', 'shadow-md', 'dark:shadow-xl', 'dark:shadow-black/20')}>
      <div className={cn('mb-5', 'border-b', 'border-slate-200', 'dark:border-white/5', 'pb-4')}>
        <h2 className={cn('text-sm', 'font-bold', 'text-slate-800', 'dark:text-white', 'uppercase', 'tracking-wider')}>{title}</h2>
        {subtitle && <p className={cn('mt-1', 'text-xs', 'text-slate-500', 'dark:text-slate-400', 'font-medium')}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

/* ─── save button ───────────────────────────────────────────── */
function SaveButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn('flex', 'items-center', 'gap-2', 'rounded-xl', 'bg-violet-600', 'px-5', 'py-2.5', 'text-sm', 'font-bold', 'text-white', 'shadow-md', 'shadow-violet-500/20', 'transition', 'hover:bg-violet-500', 'hover:scale-[1.02]', 'active:scale-[0.98]', 'disabled:opacity-50')}
    >
      {loading ? (
        <>
          <span className={cn('h-3.5', 'w-3.5', 'rounded-full', 'border-2', 'border-white/30', 'border-t-white', 'animate-spin')} />
          Saving…
        </>
      ) : (
        <>
          <Save className={cn('h-4', 'w-4')} />
          Save Changes
        </>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [theme, setTheme] = useState("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Security tab state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") =>
    setToast({ message, type });

  /* ── interceptor auth catch ─────────────────────────────── */
  useEffect(() => {
    const handleUnauthorized = () => {
      setAuthenticated(false);
      setProfile(null);
      showToast("Session expired. Please log in again.", "error");
    };

    window.addEventListener("admin-unauthorized", handleUnauthorized);
    return () => window.removeEventListener("admin-unauthorized", handleUnauthorized);
  }, []);

  /* ── auth check ──────────────────────────────────────────── */
  useEffect(() => {
    // Sync theme on mount
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    api.get("/api/admin/me")
      .then((res) => {
        if (res.data.authenticated) {
          setAuthenticated(true);
          fetchProfile();
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  async function fetchProfile() {
    try {
      const res = await api.get("/api/profile");
      const data = res.data;
      setProfile({
        name: data.name || "",
        title: data.title || "",
        location: data.location || "",
        email: data.email || "",
        linkedIn: data.linkedIn || "",
        phone: data.phone || "",
        summary: data.summary || "",
        skills: Array.isArray(data.skills) ? data.skills : [],
        experience: Array.isArray(data.experience) && data.experience.length ? data.experience : [],
        projects: Array.isArray(data.projects) && data.projects.length ? data.projects : [],
        photo: data.photo || "",
      });
    } finally {
      setLoading(false);
    }
  }

  /* ── Theme Toggle ────────────────────────────────────────── */
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setTheme(nextTheme);
  };

  /* ── File Selector for Photo (Base64) ────────────────────── */
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Selected file must be an image", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be smaller than 2MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string" && profile) {
        setProfile({ ...profile, photo: reader.result });
        showToast("Profile image loaded. Don't forget to save changes!", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  /* ── login ───────────────────────────────────────────────── */
  async function login(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});
    showToast("Signing in…", "info");

    try {
      const res = await api.post("/api/admin/login", { username: username.trim(), password });
      if (res.data.ok) {
        setAuthenticated(true);
        setToast(null);
        await fetchProfile();
        showToast("Welcome back, " + username.trim(), "success");
      } else {
        showToast(res.data.error || "Invalid credentials", "error");
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || "Login failed", "error");
    }
  }

  /* ── save profile ────────────────────────────────────────── */
  async function save() {
    if (!profile) return;

    // Validate
    const newErrors: Record<string, string> = {};
    if (!profile.name.trim()) newErrors.name = "Name is required";
    if (!profile.title.trim()) newErrors.title = "Title is required";
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
      newErrors.email = "Enter a valid email address";
    if (profile.linkedIn && !/^https?:\/\//i.test(profile.linkedIn))
      newErrors.linkedIn = "LinkedIn URL must start with http:// or https://";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      showToast("Please fix the validation errors", "error");
      return;
    }
    setErrors({});
    setSaving(true);

    try {
      const res = await api.post("/api/profile", profile);
      setSaving(false);
      if (res.data.ok) {
        showToast("Profile saved successfully!", "success");
      } else {
        showToast(res.data.error || "Unable to save profile", "error");
      }
    } catch (err: any) {
      setSaving(false);
      showToast(err.response?.data?.error || "Unable to save profile", "error");
    }
  }

  /* ── change password ─────────────────────────────────────── */
  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!currentPassword) newErrors.currentPassword = "Current password is required";
    if (!newPassword || newPassword.length < 8) newErrors.newPassword = "New password must be at least 8 characters";
    if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});
    setPwSaving(true);

    try {
      const res = await api.post("/api/admin/change-password", { currentPassword, newPassword });
      setPwSaving(false);
      if (res.data.ok) {
        showToast("Password updated successfully!", "success");
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      } else {
        showToast(res.data.error || "Failed to change password", "error");
      }
    } catch (err: any) {
      setPwSaving(false);
      showToast(err.response?.data?.error || "Failed to change password", "error");
    }
  }

  /* ── logout ──────────────────────────────────────────────── */
  async function logout() {
    try {
      await api.post("/api/admin/logout");
    } finally {
      setAuthenticated(false);
      setPassword("");
      setProfile(null);
      showToast("Signed out", "info");
    }
  }

  const [skillInput, setSkillInput] = useState("");

  // Sync skillInput when profile loads
  useEffect(() => {
    if (profile) {
      setSkillInput((profile.skills || []).join(", "));
    }
  }, [profile?.skills?.length]);

  /* ── loading ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <main className={cn('flex', 'min-h-screen', 'items-center', 'justify-center', 'bg-slate-50', 'dark:bg-slate-950')}>
        <div className={cn('flex', 'flex-col', 'items-center', 'gap-4')}>
          <div className={cn('h-10', 'w-10', 'rounded-full', 'border-2', 'border-violet-500/30', 'border-t-violet-500', 'animate-spin')} />
          <p className={cn('text-sm', 'font-semibold', 'text-slate-400')}>Loading Dashboard…</p>
        </div>
      </main>
    );
  }

  /* ══════════════════════════════════════════════════════════
     LOGIN PAGE
  ══════════════════════════════════════════════════════════ */
  if (!authenticated) {
    return (
      <main className={cn('flex', 'min-h-screen', 'items-center', 'justify-center', 'bg-slate-50', 'dark:bg-slate-950', 'px-4', 'py-16', 'transition-colors', 'duration-300')}>
        <div className={cn('w-full', 'max-w-md')}>
          
          {/* Logo / brand */}
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

  if (!profile) {
    return (
      <main className={cn('flex', 'min-h-screen', 'items-center', 'justify-center', 'bg-slate-50', 'dark:bg-slate-950')}>
        <div className={cn('flex', 'flex-col', 'items-center', 'gap-4')}>
          <div className={cn('h-10', 'w-10', 'rounded-full', 'border-2', 'border-violet-500/30', 'border-t-violet-500', 'animate-spin')} />
          <p className={cn('text-sm', 'font-semibold', 'text-slate-400')}>Loading Profile Details…</p>
        </div>
      </main>
    );
  }

  /* ══════════════════════════════════════════════════════════
     DASHBOARD NAVIGATION CONFIG
  ══════════════════════════════════════════════════════════ */
  const navItems: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: "profile", icon: <User className={cn('h-4.5', 'w-4.5')} />, label: "Profile" },
    { id: "experience", icon: <Briefcase className={cn('h-4.5', 'w-4.5')} />, label: "Experience" },
    { id: "projects", icon: <FolderGit2 className={cn('h-4.5', 'w-4.5')} />, label: "Projects" },
    { id: "skills", icon: <Cpu className={cn('h-4.5', 'w-4.5')} />, label: "Skills" },
    { id: "security", icon: <Shield className={cn('h-4.5', 'w-4.5')} />, label: "Security" },
  ];

  const sidebarContent = (
    <div className={cn('flex', 'h-full', 'flex-col')}>
      {/* Brand Header */}
      <div className={cn('border-b', 'border-slate-200', 'dark:border-white/5', 'px-5', 'py-5', 'flex', 'items-center', 'justify-between')}>
        <div className={cn('flex', 'items-center', 'gap-3')}>
          <div className={cn('flex', 'h-9', 'w-9', 'items-center', 'justify-center', 'rounded-xl', 'bg-violet-500/10', 'text-violet-600', 'border', 'border-violet-500/20')}>
            <Activity className={cn('h-5', 'w-5')} />
          </div>
          <div>
            <p className={cn('text-sm', 'font-bold', 'text-slate-800', 'dark:text-white')}>Admin Panel</p>
            <p className={cn('text-[10px]', 'font-semibold', 'text-slate-400', 'dark:text-slate-500', 'uppercase', 'tracking-wide')}>Manager</p>
          </div>
        </div>

        
      </div>

      {/* Navigation */}
      <nav className={cn('flex-1', 'space-y-1', 'overflow-y-auto', 'px-3', 'py-4')}>
        <p className={cn('mb-2', 'px-3', 'text-[10px]', 'font-bold', 'uppercase', 'tracking-widest', 'text-slate-400', 'dark:text-slate-600')}>
          Section Content
        </p>
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => {
              setActiveTab(item.id);
              setMobileMenuOpen(false);
            }}
          />
        ))}
      </nav>

      {/* Footer Details */}
      <div className={cn('border-t', 'border-slate-200', 'dark:border-white/5', 'px-4', 'py-4', 'space-y-3')}>
        <div className={cn('flex', 'items-center', 'gap-2.5', 'rounded-xl', 'bg-slate-100', 'dark:bg-white/5', 'px-3', 'py-2.5', 'border', 'border-slate-200/50', 'dark:border-white/5')}>
          <div className={cn('flex', 'h-7', 'w-7', 'flex-shrink-0', 'items-center', 'justify-center', 'rounded-full', 'bg-violet-600/25', 'text-[10px]', 'font-bold', 'text-violet-600', 'dark:text-violet-300')}>
            AD
          </div>
          <div className="min-w-0">
            <p className={cn('truncate', 'text-xs', 'font-bold', 'text-slate-800', 'dark:text-white')}>Administrator</p>
            <p className={cn('text-[9px]', 'font-semibold', 'text-emerald-600', 'dark:text-emerald-400', 'flex', 'items-center', 'gap-1')}>
              <span className={cn('h-1.5', 'w-1.5', 'rounded-full', 'bg-emerald-500')} /> Active Session
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className={cn('flex', 'w-full', 'items-center', 'justify-center', 'gap-2', 'rounded-xl', 'border', 'border-red-500/20', 'bg-red-500/5', 'py-2.5', 'text-xs', 'font-bold', 'text-red-500', 'hover:bg-red-500/10', 'transition-colors')}
        >
          <LogOut className={cn('h-4', 'w-4')} /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className={cn('flex', 'min-h-screen', 'bg-slate-50', 'dark:bg-slate-950', 'transition-colors', 'duration-300')}>
      
      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside className={cn('hidden', 'lg:block', 'sticky', 'top-0', 'h-screen', 'w-64', 'border-r', 'border-slate-200', 'dark:border-white/5', 'bg-white/95', 'dark:bg-slate-950/90', 'backdrop-blur-xl')}>
        {sidebarContent}
      </aside>

      {/* ── Mobile Sidebar Drawer ────────────────────────────── */}
      {mobileMenuOpen && (
        <div className={cn('lg:hidden', 'fixed', 'inset-0', 'z-50', 'flex')}>
          {/* Overlay backdrop */}
          <div className={cn('fixed', 'inset-0', 'bg-slate-900/60', 'backdrop-blur-sm')} onClick={() => setMobileMenuOpen(false)} />
          
          <aside className={cn('relative', 'flex', 'h-full', 'w-64', 'flex-col', 'border-r', 'border-slate-200', 'dark:border-white/5', 'bg-white', 'dark:bg-slate-950', 'animate-slide-right', 'shadow-2xl')}>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* ── Main content pane ─────────────────────────────────── */}
      <main className={cn('flex-1', 'overflow-y-auto')}>
        
        {/* Header bar */}
        <div className={cn('sticky', 'top-0', 'z-10', 'border-b', 'border-slate-200', 'dark:border-white/5', 'bg-white/90', 'dark:bg-slate-950/80', 'backdrop-blur-md', 'px-6', 'py-4', 'transition-colors', 'duration-300')}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div className={cn('flex', 'items-center', 'gap-3')}>
              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={cn('lg:hidden', 'rounded-xl', 'p-2', 'border', 'border-slate-200', 'dark:border-white/5', 'hover:bg-slate-100', 'dark:hover:bg-white/5', 'text-slate-600', 'dark:text-slate-300')}
              >
                <Menu className={cn('h-5', 'w-5')} />
              </button>
              
              <div>
                <h1 className={cn('text-base', 'font-bold', 'text-slate-900', 'dark:text-white', 'flex', 'items-center', 'gap-2', 'uppercase', 'tracking-wide')}>
                  {navItems.find((n) => n.id === activeTab)?.icon}
                  {navItems.find((n) => n.id === activeTab)?.label}
                </h1>
                <p className={cn('text-[10px]', 'font-semibold', 'text-slate-400', 'dark:text-slate-500', 'uppercase', 'tracking-wide')}>
                  Modify portfolio details
                </p>
              </div>
            </div>
            {activeTab !== "security" && (
              <SaveButton onClick={save} loading={saving} />
            )}
          </div>
        </div>

        <div className={cn('px-6', 'py-8', 'space-y-6', 'max-w-4xl', 'animate-fade-in')}>

          {/* ══ PROFILE TAB ════════════════════════════════════ */}
          {activeTab === "profile" && (
            <>
              <SectionCard title="Personal Information" subtitle="Publicly visible information on your page">
                <div className={cn('grid', 'gap-5', 'sm:grid-cols-2')}>
                  <Field label="Full Name" required error={errors.name}>
                    <input
                      id="profile-name"
                      className={inputCls}
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="e.g. Mohamed bn Sultan"
                    />
                  </Field>
                  
                  <Field label="Professional Title" required error={errors.title}>
                    <input
                      id="profile-title"
                      className={inputCls}
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      placeholder="e.g. Petroleum Engineer"
                    />
                  </Field>
                  
                  <Field label="Location" error={errors.location}>
                    <input
                      id="profile-location"
                      className={inputCls}
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="e.g. Asyut, Egypt"
                    />
                  </Field>

                  <Field label="Phone Number" error={errors.phone}>
                    <input
                      id="profile-phone"
                      className={inputCls}
                      value={profile.phone || ""}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="e.g. +20 101 234 5678"
                    />
                  </Field>

                  <Field label="Email Address" error={errors.email}>
                    <input
                      id="profile-email"
                      className={inputCls}
                      type="email"
                      value={profile.email || ""}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="you@example.com"
                    />
                  </Field>

                  <Field label="LinkedIn URL" error={errors.linkedIn}>
                    <input
                      id="profile-linkedin"
                      className={inputCls}
                      value={profile.linkedIn || ""}
                      onChange={(e) => setProfile({ ...profile, linkedIn: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Profile Photo" subtitle="Browse local file or set image URL">
                <div className={cn('flex', 'flex-col', 'sm:flex-row', 'items-center', 'gap-6')}>
                  {/* Photo preview */}
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
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                    </div>
                    
                    <Field label="Or paste photo image URL" error={errors.photo}>
                      <input
                        id="profile-photo"
                        className={inputCls}
                        value={profile.photo || ""}
                        onChange={(e) => setProfile({ ...profile, photo: e.target.value })}
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
                    onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                    placeholder="Short description of your background and goals…"
                  />
                </Field>
              </SectionCard>
            </>
          )}

          {/* ══ EXPERIENCE TAB ════════════════════════════════════ */}
          {activeTab === "experience" && (
            <SectionCard title="Work Experience" subtitle="Add or adjust chronological positions">
              <div className="space-y-4">
                {(profile.experience || []).map((item, index) => (
                  <div
                    key={index}
                    className={cn('group', 'relative', 'rounded-2xl', 'border', 'border-slate-200', 'dark:border-slate-800', 'bg-white/50', 'dark:bg-slate-900/20', 'p-5', 'transition', 'hover:border-slate-350', 'dark:hover:border-slate-700')}
                  >
                    <div className={cn('mb-3', 'flex', 'items-center', 'justify-between')}>
                      <span className={cn('rounded-lg', 'bg-violet-500/10', 'px-2.5', 'py-1', 'text-xs', 'font-semibold', 'text-violet-600', 'dark:text-violet-400', 'border', 'border-violet-500/20')}>
                        Experience #{index + 1}
                      </span>
                      <button
                        onClick={() => {
                          const next = (profile.experience || []).filter((_, i) => i !== index);
                          setProfile({ ...profile, experience: next });
                        }}
                        className={cn('flex', 'items-center', 'gap-1.5', 'rounded-lg', 'px-2.5', 'py-1', 'text-xs', 'font-semibold', 'text-slate-500', 'hover:text-red-500', 'hover:bg-red-500/10', 'transition-colors')}
                      >
                        <Trash2 className={cn('h-3.5', 'w-3.5')} /> Remove
                      </button>
                    </div>
                    
                    <div className={cn('grid', 'gap-4', 'sm:grid-cols-2')}>
                      <Field label="Company" required>
                        <input
                          className={inputCls}
                          value={item.company}
                          onChange={(e) => {
                            const next = [...(profile.experience || [])];
                            next[index] = { ...item, company: e.target.value };
                            setProfile({ ...profile, experience: next });
                          }}
                          placeholder="Company name"
                        />
                      </Field>
                      <Field label="Role / Position" required>
                        <input
                          className={inputCls}
                          value={item.role}
                          onChange={(e) => {
                            const next = [...(profile.experience || [])];
                            next[index] = { ...item, role: e.target.value };
                            setProfile({ ...profile, experience: next });
                          }}
                          placeholder="Your role"
                        />
                      </Field>
                      <Field label="Period / Date Range">
                        <input
                          className={inputCls}
                          value={item.period}
                          onChange={(e) => {
                            const next = [...(profile.experience || [])];
                            next[index] = { ...item, period: e.target.value };
                            setProfile({ ...profile, experience: next });
                          }}
                          placeholder="e.g. 2024 — Present"
                        />
                      </Field>
                    </div>
                    
                    <div className="mt-4">
                      <Field label="Description">
                        <textarea
                          className={textareaCls}
                          value={item.description}
                          onChange={(e) => {
                            const next = [...(profile.experience || [])];
                            next[index] = { ...item, description: e.target.value };
                            setProfile({ ...profile, experience: next });
                          }}
                          placeholder="What did you work on?"
                        />
                      </Field>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() =>
                    setProfile({
                      ...profile,
                      experience: [...(profile.experience || []), emptyExperience()],
                    })
                  }
                  className={cn('flex', 'w-full', 'items-center', 'justify-center', 'gap-2', 'rounded-xl', 'border', 'border-dashed', 'border-slate-300', 'dark:border-slate-800', 'py-3.5', 'text-xs', 'font-bold', 'text-slate-500', 'hover:border-violet-500/50', 'hover:bg-violet-500/5', 'hover:text-violet-600', 'dark:hover:text-violet-400', 'transition-colors')}
                >
                  <Plus className={cn('h-4', 'w-4')} /> Add Experience Position
                </button>
              </div>
            </SectionCard>
          )}

          {/* ══ PROJECTS TAB ════════════════════════════════════ */}
          {activeTab === "projects" && (
            <SectionCard title="Projects" subtitle="Showcase your notable applications or research">
              <div className="space-y-4">
                {(profile.projects || []).map((item, index) => (
                  <div
                    key={index}
                    className={cn('group', 'relative', 'rounded-2xl', 'border', 'border-slate-200', 'dark:border-slate-800', 'bg-white/50', 'dark:bg-slate-900/20', 'p-5', 'transition', 'hover:border-slate-350', 'dark:hover:border-slate-700')}
                  >
                    <div className={cn('mb-3', 'flex', 'items-center', 'justify-between')}>
                      <span className={cn('rounded-lg', 'bg-emerald-500/10', 'px-2.5', 'py-1', 'text-xs', 'font-semibold', 'text-emerald-600', 'dark:text-emerald-400', 'border', 'border-emerald-500/20')}>
                        Project #{index + 1}
                      </span>
                      <button
                        onClick={() => {
                          const next = (profile.projects || []).filter((_, i) => i !== index);
                          setProfile({ ...profile, projects: next });
                        }}
                        className={cn('flex', 'items-center', 'gap-1.5', 'rounded-lg', 'px-2.5', 'py-1', 'text-xs', 'font-semibold', 'text-slate-500', 'hover:text-red-500', 'hover:bg-red-500/10', 'transition-colors')}
                      >
                        <Trash2 className={cn('h-3.5', 'w-3.5')} /> Remove
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <Field label="Project Title" required>
                        <input
                          className={inputCls}
                          value={item.name}
                          onChange={(e) => {
                            const next = [...(profile.projects || [])];
                            next[index] = { ...item, name: e.target.value };
                            setProfile({ ...profile, projects: next });
                          }}
                          placeholder="Project name"
                        />
                      </Field>
                      <Field label="Description" required>
                        <textarea
                          className={textareaCls}
                          value={item.description}
                          onChange={(e) => {
                            const next = [...(profile.projects || [])];
                            next[index] = { ...item, description: e.target.value };
                            setProfile({ ...profile, projects: next });
                          }}
                          placeholder="Explain what the project is..."
                        />
                      </Field>
                      <Field label="Link / URL">
                        <input
                          className={inputCls}
                          value={item.link || ""}
                          onChange={(e) => {
                            const next = [...(profile.projects || [])];
                            next[index] = { ...item, link: e.target.value };
                            setProfile({ ...profile, projects: next });
                          }}
                          placeholder="https://github.com/..."
                        />
                      </Field>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() =>
                    setProfile({
                      ...profile,
                      projects: [...(profile.projects || []), emptyProject()],
                    })
                  }
                  className={cn('flex', 'w-full', 'items-center', 'justify-center', 'gap-2', 'rounded-xl', 'border', 'border-dashed', 'border-slate-300', 'dark:border-slate-800', 'py-3.5', 'text-xs', 'font-bold', 'text-slate-500', 'hover:border-emerald-500/50', 'hover:bg-emerald-500/5', 'hover:text-emerald-600', 'dark:hover:text-emerald-400', 'transition-colors')}
                >
                  <Plus className={cn('h-4', 'w-4')} /> Add Project Showcase
                </button>
              </div>
            </SectionCard>
          )}

          {/* ══ SKILLS TAB ════════════════════════════════════ */}
          {activeTab === "skills" && (
            <SectionCard title="Skills" subtitle="Add tech stack tags which display on profile">
              <div className="space-y-5">
                {/* Tags display */}
                <div className={cn('min-h-16', 'flex', 'flex-wrap', 'gap-2.5', 'rounded-xl', 'border', 'border-slate-200', 'dark:border-slate-800', 'bg-white/50', 'dark:bg-slate-900/20', 'p-4')}>
                  {(profile.skills || []).length === 0 ? (
                    <p className={cn('text-xs', 'font-semibold', 'text-slate-400')}>No skills added yet. Use field below to insert tags.</p>
                  ) : (
                    (profile.skills || []).map((skill, index) => (
                      <span
                        key={index}
                        className={cn('flex', 'items-center', 'gap-1.5', 'rounded-lg', 'border', 'border-violet-500/20', 'bg-violet-500/10', 'px-3', 'py-1', 'text-xs', 'font-semibold', 'text-violet-600', 'dark:text-violet-300')}
                      >
                        {skill}
                        <button
                          onClick={() =>
                            setProfile({
                              ...profile,
                              skills: (profile.skills || []).filter((_, i) => i !== index),
                            })
                          }
                          className={cn('ml-1', 'rounded', 'hover:text-red-500', 'transition-colors', 'text-[10px]')}
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add skill input */}
                <div className={cn('flex', 'gap-3')}>
                  <Field label="Skills (separate with comma)">
                  <input
                      id="skills-input"
                      className={inputCls}
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onBlur={(e) => {
                        if (!profile) return;
                        const parsed = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setProfile({ ...profile, skills: parsed });
                        setSkillInput(parsed.join(", "));
                      }}
                      placeholder="e.g. Petroleum Engineering, Refinery Operations, HYSYS"
                    />
                  </Field>
                </div>
              </div>
            </SectionCard>
          )}

          {/* ══ SECURITY TAB ════════════════════════════════════ */}
          {activeTab === "security" && (
            <>
              <SectionCard title="Password Update" subtitle="Change credentials to log in">
                <form onSubmit={changePassword} className={cn('space-y-4', 'max-w-md')}>
                  <Field label="Current Password" required error={errors.currentPassword}>
                    <input
                      id="current-password"
                      className={inputCls}
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
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
                      onChange={(e) => setNewPassword(e.target.value)}
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
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
          )}
        </div>
      </main>

      {/* ── Toast notifications ─────────────────────────────── */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
