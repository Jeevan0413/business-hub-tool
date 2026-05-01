import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Command, 
  LayoutDashboard, 
  ReceiptText, 
  Users, 
  FileSearch, 
  Mail, 
  Sparkles,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/finance', label: 'Finance Hub', icon: ReceiptText, premium: true },
  { path: '/employees', label: 'People', icon: Users },
  { path: '/documents', label: 'Docs', icon: FileSearch },
  { path: '/communication', label: 'Comms', icon: Mail },
  { path: '/startup', label: 'Startup', icon: Sparkles },
];

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-4 sm:py-6">
      <div className="glass h-20 rounded-[2rem] px-4 sm:px-8 flex items-center justify-between shadow-2xl shadow-black/5 dark:shadow-black/20 border border-white/40 dark:border-white/5 relative">
        
        {/* Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 rotate-3">
            <ShieldCheck className="text-white" size={22} />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-lg font-black dark:text-white leading-none">BusinessHub</h1>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-primary-500 mt-1">v2.0 Pro</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-100/50 dark:bg-white/5 p-1.5 rounded-2xl mx-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 relative group ${
                  isActive 
                    ? 'bg-white dark:bg-primary-600 text-primary-600 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-primary-600 dark:text-white' : 'group-hover:scale-110 transition-transform'} />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                {item.premium && !isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-0">
          <div className="hidden md:flex items-center relative group max-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full h-10 bg-slate-100 dark:bg-white/5 rounded-xl pl-11 pr-4 text-xs font-bold dark:text-white border-2 border-transparent focus:border-primary-500/30 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <ThemeToggle />
          
          <button className="relative p-2.5 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all group">
            <Bell size={20} className="text-slate-500 dark:text-slate-400 group-hover:scale-110 transition-transform" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary-500 rounded-full border-2 border-white dark:border-onyx-950" />
          </button>

          <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block" />

          <button className="flex items-center gap-2 pl-1.5 pr-4 py-1.5 bg-slate-900 dark:bg-white rounded-xl group transition-all hover:scale-105 active:scale-95">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white shadow-md">
              <User size={16} />
            </div>
            <div className="hidden sm:block text-left leading-none">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Jeevan S.</p>
              <p className="text-[10px] font-bold text-white dark:text-slate-900">Admin Pro</p>
            </div>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2.5 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-24 left-0 right-0 glass p-6 rounded-[2rem] border border-white/20 shadow-2xl xl:hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all ${
                      isActive 
                        ? 'bg-primary-600 text-white shadow-xl' 
                        : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <item.icon size={24} />
                    <span className="text-xs font-bold">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
