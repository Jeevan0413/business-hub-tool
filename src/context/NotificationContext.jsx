import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
    warning: <AlertCircle className="text-amber-500" size={20} />
  };

  const bgColors = {
    success: 'border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-900/20',
    error: 'border-red-500/20 bg-red-50/90 dark:bg-red-900/20',
    info: 'border-blue-500/20 bg-blue-50/90 dark:bg-blue-900/20',
    warning: 'border-amber-500/20 bg-amber-50/90 dark:bg-amber-900/20'
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`
                pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[300px]
                ${bgColors[toast.type]}
              `}
            >
              {icons[toast.type]}
              <p className="flex-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                {toast.message}
              </p>
              <button 
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={16} className="text-slate-400" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
