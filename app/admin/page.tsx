"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "../../types/profile";
import { api } from "../../lib/apiClient";
import { cn } from "../../lib/utils";
import {
  User,
  Briefcase,
  FolderGit2,
  Cpu,
  Shield,
  GraduationCap,
  FlaskConical,
  Trophy,
  Globe,
} from "lucide-react";

import { Toast } from "../../components/admin/Toast";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { ProfileTab } from "../../components/admin/ProfileTab";
import { ExperienceTab } from "../../components/admin/ExperienceTab";
import { ProjectsTab } from "../../components/admin/ProjectsTab";
import { SkillsTab } from "../../components/admin/SkillsTab";
import { SecurityTab } from "../../components/admin/SecurityTab";
import { EducationTab } from "../../components/admin/EducationTab";
import { TrainingsTab } from "../../components/admin/TrainingsTab";
import { AchievementsTab } from "../../components/admin/AchievementsTab";
import { LanguagesTab } from "../../components/admin/LanguagesTab";

type Tab = "profile" | "experience" | "projects" | "skills" | "security" | "education" | "trainings" | "achievements" | "languages";

export default function AdminPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") =>
    setToast({ message, type });

  useEffect(() => {
    const handleUnauthorized = () => {
      setAuthenticated(false);
      setProfile(null);
      showToast("Session expired. Please log in again.", "error");
    };

    window.addEventListener("admin-unauthorized", handleUnauthorized);
    return () => window.removeEventListener("admin-unauthorized", handleUnauthorized);
  }, []);

  useEffect(() => {
    api.get("/api/admin/me")
      .then((res) => {
        if (res.data.authenticated) {
          setAuthenticated(true);
          fetchProfile();
        } else {
          setLoading(false);
          router.push("/login");
        }
      })
      .catch(() => {
        setLoading(false);
        router.push("/login");
      });
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
        education: Array.isArray(data.education) ? data.education : [],
        trainings: Array.isArray(data.trainings) ? data.trainings : [],
        achievements: Array.isArray(data.achievements) ? data.achievements : [],
        languages: Array.isArray(data.languages) ? data.languages : [],
        maritalStatus: data.maritalStatus || "",
        dateOfBirth: data.dateOfBirth || "",
        nationality: data.nationality || "",
        militaryStatus: data.militaryStatus || "",
      });
    } finally {
      setLoading(false);
    }
  }

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

  async function save() {
    if (!profile) return;

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

  async function logout() {
    try {
      await api.post("/api/admin/logout");
    } finally {
      setAuthenticated(false);
      setProfile(null);
      router.push("/login");
    }
  }

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

  if (!authenticated) {
    return null;
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

  const navItems: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: "profile", icon: <User className={cn('h-4.5', 'w-4.5')} />, label: "Profile" },
    { id: "experience", icon: <Briefcase className={cn('h-4.5', 'w-4.5')} />, label: "Experience" },
    { id: "education", icon: <GraduationCap className={cn('h-4.5', 'w-4.5')} />, label: "Education" },
    { id: "trainings", icon: <FlaskConical className={cn('h-4.5', 'w-4.5')} />, label: "Training" },
    { id: "projects", icon: <FolderGit2 className={cn('h-4.5', 'w-4.5')} />, label: "Projects" },
    { id: "skills", icon: <Cpu className={cn('h-4.5', 'w-4.5')} />, label: "Skills" },
    { id: "achievements", icon: <Trophy className={cn('h-4.5', 'w-4.5')} />, label: "Achievements" },
    { id: "languages", icon: <Globe className={cn('h-4.5', 'w-4.5')} />, label: "Languages" },
    { id: "security", icon: <Shield className={cn('h-4.5', 'w-4.5')} />, label: "Security" },
  ];

  return (
    <div className={cn('flex', 'min-h-screen', 'bg-slate-50', 'dark:bg-slate-950', 'transition-colors', 'duration-300')}>

      <aside className={cn('hidden', 'lg:block', 'sticky', 'top-0', 'h-screen', 'w-64', 'border-r', 'border-slate-200', 'dark:border-white/5', 'bg-white/95', 'dark:bg-slate-950/90', 'backdrop-blur-xl')}>
        <AdminSidebar
          navItems={navItems}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
          }}
          onLogout={logout}
        />
      </aside>

      {mobileMenuOpen && (
        <div className={cn('lg:hidden', 'fixed', 'inset-0', 'z-50', 'flex')}>
          <div className={cn('fixed', 'inset-0', 'bg-slate-900/60', 'backdrop-blur-sm')} onClick={() => setMobileMenuOpen(false)} />
          <aside className={cn('relative', 'flex', 'h-full', 'w-64', 'flex-col', 'border-r', 'border-slate-200', 'dark:border-white/5', 'bg-white', 'dark:bg-slate-950', 'animate-slide-right', 'shadow-2xl')}>
            <AdminSidebar
              navItems={navItems}
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
              onLogout={logout}
            />
          </aside>
        </div>
      )}

      <main className={cn('flex-1', 'overflow-y-auto')}>
        <AdminHeader
          activeTab={activeTab}
          navItems={navItems}
          saving={saving}
          onSave={save}
          onMenuToggle={() => setMobileMenuOpen(true)}
        />

        <div className={cn('px-6', 'py-8', 'space-y-6', 'max-w-4xl', 'animate-fade-in')}>
          {activeTab === "profile" && (
            <ProfileTab
              profile={profile}
              errors={errors}
              onProfileChange={setProfile}
              onPhotoSelect={handlePhotoSelect}
            />
          )}

          {activeTab === "experience" && (
            <ExperienceTab
              profile={profile}
              onProfileChange={setProfile}
            />
          )}

          {activeTab === "education" && (
            <EducationTab
              profile={profile}
              onProfileChange={setProfile}
            />
          )}

          {activeTab === "trainings" && (
            <TrainingsTab
              profile={profile}
              onProfileChange={setProfile}
            />
          )}

          {activeTab === "projects" && (
            <ProjectsTab
              profile={profile}
              onProfileChange={setProfile}
            />
          )}

          {activeTab === "skills" && (
            <SkillsTab
              profile={profile}
              onProfileChange={setProfile}
            />
          )}

          {activeTab === "achievements" && (
            <AchievementsTab
              profile={profile}
              onProfileChange={setProfile}
            />
          )}

          {activeTab === "languages" && (
            <LanguagesTab
              profile={profile}
              onProfileChange={setProfile}
            />
          )}

          {activeTab === "security" && (
            <SecurityTab
              currentPassword={currentPassword}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              errors={errors}
              pwSaving={pwSaving}
              onCurrentPasswordChange={setCurrentPassword}
              onNewPasswordChange={setNewPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onChangePassword={changePassword}
            />
          )}
        </div>
      </main>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
