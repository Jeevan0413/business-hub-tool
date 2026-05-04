import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-onyx-950 flex flex-col">
      {/* Premium Background Elements */}
      <div className="mesh-bg">
        <div className="mesh-circle w-[600px] h-[600px] bg-primary-500/20 left-[10%] top-[10%] blur-[120px]" />
        <div className="mesh-circle w-[500px] h-[500px] bg-accent-500/20 right-[15%] bottom-[10%] blur-[100px] animation-delay-2000" />
        <div className="mesh-circle w-[400px] h-[400px] bg-indigo-500/10 left-[40%] top-[40%] blur-[150px] animation-delay-4000" />
      </div>
      <div className="noise" />

      <Navbar />
      
      <main className="flex-1 min-w-0 relative z-10">
        <div className="max-w-[1600px] mx-auto p-4 sm:p-8 lg:p-12 animate-in">
          {children}
        </div>
      </main>

      {/* Subtle Footer for Top-Nav Layout */}
      <footer className="relative z-10 py-8 px-8 border-t border-slate-200/50 dark:border-white/5">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
           <div className="flex items-center gap-4">
              <span>© 2026 BusinessHub Pro</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-500">System Online</span>
           </div>
           <div className="flex items-center gap-6">
              <a href="#" className="hover:text-primary-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary-500 transition-colors">Terms</a>
              <a href="#" className="hover:text-primary-500 transition-colors">Support</a>
           </div>
        </div>
      </footer>
    </div>
  );
}
