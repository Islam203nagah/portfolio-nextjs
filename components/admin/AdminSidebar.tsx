"use client";

import { cn } from "../../lib/utils";
import { NavItem } from "./NavItem";
import { LogOut, Activity } from "lucide-react";

type Tab = "profile" | "experience" | "projects" | "skills" | "security" | "education" | "trainings" | "achievements" | "languages";

interface NavConfigItem {
  id: Tab;
  icon: React.ReactNode;
  label: string;
}

interface AdminSidebarProps {
  navItems: NavConfigItem[];
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

export function AdminSidebar({ navItems, activeTab, onTabChange, onLogout }: AdminSidebarProps) {
  const sidebarContent = (
    <div className={cn('flex', 'h-full', 'flex-col')}>
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
            onClick={() => onTabChange(item.id)}
          />
        ))}
      </nav>

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
          onClick={onLogout}
          className={cn('flex', 'w-full', 'items-center', 'justify-center', 'gap-2', 'rounded-xl', 'border', 'border-red-500/20', 'bg-red-500/5', 'py-2.5', 'text-xs', 'font-bold', 'text-red-500', 'hover:bg-red-500/10', 'transition-colors')}
        >
          <LogOut className={cn('h-4', 'w-4')} /> Sign out
        </button>
      </div>
    </div>
  );

  return sidebarContent;
}
