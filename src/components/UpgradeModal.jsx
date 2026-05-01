import React from 'react';
import { Check, X, Zap, Crown, Star, Shield } from 'lucide-react';
import Button from './Button';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function UpgradeModal({ isOpen, onClose }) {
  const { updatePlan, userPlan } = useData();

  if (!isOpen) return null;

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        'Default Invoice Template',
        'Basic PDF Generation',
        'Max 3 Invoices',
        'Standard Support'
      ],
      current: userPlan === 'Free',
      buttonText: 'Current Plan',
      locked: false
    },
    {
      name: 'Pro',
      price: '$19',
      popular: true,
      description: 'Best for growing businesses',
      features: [
        'Everything in Free',
        'Company Logo Upload',
        'Custom Theme Colors',
        '4 Professional Templates',
        'No Watermarks',
        'Unlimited Invoices'
      ],
      current: userPlan === 'Pro',
      buttonText: 'Upgrade to Pro',
      icon: Zap,
      color: 'primary'
    },
    {
      name: 'Premium',
      price: '$49',
      description: 'For agencies and large teams',
      features: [
        'Everything in Pro',
        'Full Layout Control',
        'Section Reordering',
        'Save Custom Templates',
        'Priority Support',
        'Team Collaboration'
      ],
      current: userPlan === 'Premium',
      buttonText: 'Go Premium',
      icon: Crown,
      color: 'accent'
    }
  ];

  const handleUpgrade = (planName) => {
    updatePlan(planName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 relative z-10"
      >
        <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
          <div>
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-black uppercase tracking-widest text-xs mb-3">
              <Shield size={16} />
              Secure Checkout & Plans
            </div>
            <h2 className="text-3xl md:text-4xl font-black dark:text-white leading-tight">
              Scale Your Business with <br />
              <span className="text-primary-600">Premium Features</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-slate-200 dark:hover:bg-white/10 rounded-2xl transition-all group"
          >
            <X size={28} className="text-slate-400 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative p-8 rounded-[32px] border-2 transition-all duration-500 group ${
                plan.popular 
                  ? 'border-primary-500 bg-primary-500/5 shadow-2xl shadow-primary-500/10' 
                  : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800/50'
              } hover:translate-y-[-8px]`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">
                  Most Popular Choice
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl ${plan.popular ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'}`}>
                  {plan.icon ? <plan.icon size={24} /> : <Star size={24} />}
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-black dark:text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{plan.description}</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black dark:text-white tracking-tighter">{plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-bold">/mo</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium dark:text-slate-300">
                    <div className="mt-0.5 p-0.5 bg-emerald-500/10 rounded-full shrink-0">
                      <Check size={14} className="text-emerald-500" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.current ? 'secondary' : (plan.popular ? 'primary' : 'outline')}
                className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest ${plan.current ? 'opacity-50 cursor-default' : ''}`}
                onClick={() => !plan.current && handleUpgrade(plan.name)}
                disabled={plan.current}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <div className="p-8 bg-slate-50 dark:bg-white/2 text-center border-t border-slate-100 dark:border-white/5">
          <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <span className="font-bold flex items-center gap-2"><Shield size={16}/> Trusted by 10k+ Founders</span>
             <span className="font-bold">✨ AI Powered Insights</span>
             <span className="font-bold">🔒 Secure Cloud Backup</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
