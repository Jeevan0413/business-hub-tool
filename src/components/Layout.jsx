import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { CURRENT_LAYOUT, LAYOUT_TYPES } from '../config/layoutConfig';

export default function Layout({ children }) {
  const isSidebar = CURRENT_LAYOUT === LAYOUT_TYPES.SIDEBAR;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {isSidebar ? <Sidebar /> : <Navbar />}
      
      <main className={`
        flex-1 p-4 lg:p-8 
        ${isSidebar ? 'lg:ml-72 pt-20 lg:pt-8' : 'pt-24 lg:pt-28'}
      `}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
