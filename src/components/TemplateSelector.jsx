import React from 'react';
import { Layout, Check, Lock, Sparkles, Award, FileText, Shield } from 'lucide-react';
import { useData } from '../context/DataContext';

const templates = [
  { id: 'default', name: 'Standard', description: 'Clean & Business First', plan: 'Free', icon: FileText },
  { id: 'classic', name: 'Classic', description: 'Formal & Traditional', plan: 'Pro', icon: Layout },
  { id: 'modern', name: 'Modern', description: 'Bold & Creative', plan: 'Pro', icon: Sparkles },
  { id: 'minimal', name: 'Minimal', description: 'Light & Elegant', plan: 'Pro', icon: Award },
];

export default function TemplateSelector({ selectedId, onSelect, onUpgradeClick }) {
  const { userPlan } = useData();

  const isLocked = (plan) => {
    if (plan === 'Free') return false;
    if (plan === 'Pro' && (userPlan === 'Pro' || userPlan === 'Premium')) return false;
    if (plan === 'Premium' && userPlan === 'Premium') return false;
    return true;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {templates.map((template) => {
        const locked = isLocked(template.plan);
        const selected = selectedId === template.id;
        const Icon = template.icon;

        return (
          <button
            key={template.id}
            onClick={() => locked ? onUpgradeClick() : onSelect(template.id)}
            className={`relative group flex flex-col p-4 sm:p-5 rounded-[24px] border-2 transition-all duration-500 text-left overflow-hidden ${
              selected 
                ? 'border-primary-500 bg-primary-500/5 shadow-xl shadow-primary-500/10 scale-[1.02]' 
                : 'border-slate-100 dark:border-white/5 bg-white dark:bg-white/2 hover:border-slate-300 dark:hover:border-white/10'
            } ${locked ? 'hover:scale-[1.02]' : 'active:scale-95'}`}
          >
            {selected && (
              <div className="absolute top-0 right-0 p-3 bg-primary-500 text-white rounded-bl-2xl animate-in slide-in-from-top-4 slide-in-from-right-4 duration-300">
                <Check size={14} strokeWidth={3} />
              </div>
            )}
            
            {locked && (
              <div className="absolute top-4 right-4 p-2 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-xl">
                <Lock size={14} />
              </div>
            )}

            <div className={`mb-6 p-4 rounded-2xl w-fit transition-all duration-500 group-hover:scale-110 ${
              selected ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/30' : 'bg-slate-100 dark:bg-white/5 text-slate-500'
            }`}>
              <Icon size={28} />
            </div>

            <div className="space-y-1">
              <h4 className="font-black text-xs dark:text-white uppercase tracking-wider flex items-center gap-2">
                {template.name}
              </h4>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                {template.description}
              </p>
            </div>
            
            {locked ? (
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500 py-1 px-2 bg-amber-500/5 rounded-lg border border-amber-500/10">
                  {template.plan}+
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-amber-500 transition-colors">Unlock Now</span>
              </div>
            ) : (
              <div className="mt-6 pt-4 border-t border-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">Select Style</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
