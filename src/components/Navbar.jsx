import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ReceiptText, 
  Rocket, 
  Target, 
  Presentation,
  Moon,
  Sun,
  Menu,
  X,
  Users,
  Files,
  Mail,
  LogOut
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/employees', name: 'Employees', icon: Users },
  { path: '/finance', name: 'Finance', icon: ReceiptText },
  { path: '/documents', name: 'Documents', icon: Files },
  { path: '/communication', name: 'Communication', icon: Mail },
  { path: '/startup', name: 'Startup', icon: Rocket },
  { path: '/planning', name: 'Planning', icon: Target },
  { path: '/pitch', name: 'Pitch Deck', icon: Presentation },
];

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 xl:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-2">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Rocket className="text-white" size={20} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight dark:text-white leading-tight hidden xl:block">
              Business Hub
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1 justify-center px-2">
            <div className="flex items-center gap-0.5 max-w-full">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-1.5 px-2 py-2 rounded-xl transition-all duration-200 font-medium whitespace-nowrap
                    ${isActive 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}
                  `}
                >
                  <item.icon size={17} className="shrink-0" />
                  <span className="text-[13px] xl:text-sm">{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-1 border-l border-white/10 pl-4 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button
              onClick={logout}
              className="p-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 glass rounded-xl text-slate-600 dark:text-slate-400"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-semibold
                    ${isActive 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}
                  `}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
              
              <div className="h-px bg-slate-200 dark:bg-white/10 my-3" />
              
              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-semibold"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
