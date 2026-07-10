"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

export function Header() {
  const [name, setName] = useState("Portfolio");
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Get profile name
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.name) setName(data.name);
      })
      .catch(() => null);

    // Initialize theme state
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

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

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 dark:border-white/5 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-300 hover:opacity-80 transition-opacity">
          {name}
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-violet-600 dark:hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
          
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 transition-all duration-200"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 transition-all duration-200"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
          
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-xl p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all duration-200"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200/50 dark:border-white/5 bg-slate-50 dark:bg-slate-950 px-4 py-4 space-y-3 transition-all duration-300 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-violet-600 dark:hover:text-white transition-all"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
