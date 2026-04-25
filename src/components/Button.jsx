import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Button({ children, className, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-500/20',
    secondary: 'bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-white/20 border border-slate-200 dark:border-white/10',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
    ghost: 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
  };

  return (
    <button
      className={twMerge(
        'px-6 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
