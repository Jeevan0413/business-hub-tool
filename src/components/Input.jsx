import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
          {label}
        </label>
      )}
      <input
        className={twMerge(
          "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all dark:text-white",
          error && "border-red-500 focus:ring-red-500/50",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
    </div>
  );
}
