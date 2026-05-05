import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const variants = {
    primary: 'btn-onyx',
    secondary: 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 px-8 py-4 rounded-2xl font-black transition-all active:scale-95',
    outline: 'border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-primary-500 dark:hover:border-primary-500 px-8 py-4 rounded-2xl font-black transition-all active:scale-95',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-8 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-red-500/10'
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-8 py-4 text-sm',
    lg: 'px-10 py-5 text-base'
  };

  return (
    <button 
      className={`inline-flex items-center justify-center gap-2 font-display ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
