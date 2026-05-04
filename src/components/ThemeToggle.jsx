import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
