import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-all hover:scale-110 active:scale-95 group relative overflow-hidden"
      aria-label="Toggle dark mode"
    >
      <div className="relative z-10 transition-transform duration-500 group-hover:rotate-[30deg]">
        {isDarkMode ? (
          <Sun size={20} className="text-amber-400 animate-in zoom-in spin-in-90 duration-500" />
        ) : (
          <Moon size={20} className="text-primary-500 animate-in zoom-in -spin-in-90 duration-500" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
