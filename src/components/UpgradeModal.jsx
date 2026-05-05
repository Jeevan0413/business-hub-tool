import React, { useEffect } from 'react';
import { Check, X, Zap, Crown, Star, Shield } from 'lucide-react';
import Button from './Button';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function UpgradeModal({ isOpen, onClose }) {
  const { updatePlan, userPlan } = useData();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0 }}
        className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl relative z-10 flex flex-col overflow-hidden"
        style={{ maxHeight: 'calc(100vh - 3rem)' }}
      >
        {/* Header - Fixed */}
        <div className="shrink-0 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 relative">
          <div>
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-black uppercase tracking-widest text-xs mb-2">
              <Shield size={16} />
              Secure Checkout & Plans
            </div>
            <h2 className="text-2xl md:text-3xl font-black dark:text-white leading-tight">
              Scale Your Business with <span className="text-primary-600">Premium Features</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all group z-20"
          >
            <X size={20} className="text-slate-400 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative p-6 md:p-8 rounded-[24px] border-2 transition-all duration-500 group flex flex-col ${
                plan.popular 
                  ? 'border-primary-500 bg-primary-500/5 shadow-xl shadow-primary-500/10' 
                  : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800/50'
              } hover:-translate-y-1`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg whitespace-nowrap">
                  Most Popular Choice
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${plan.popular ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'}`}>
                  {plan.icon ? <plan.icon size={20} /> : <Star size={20} />}
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-black dark:text-white">{plan.name}</h3>
                </div>
              </div>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 h-8">{plan.description}</p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black dark:text-white tracking-tighter">{plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">/mo</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs font-medium dark:text-slate-300">
                    <div className="mt-0.5 p-0.5 bg-emerald-500/10 rounded-full shrink-0">
                      <Check size={12} className="text-emerald-500" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.current ? 'secondary' : (plan.popular ? 'primary' : 'outline')}
                className={`w-full h-12 rounded-xl font-black text-xs uppercase tracking-widest mt-auto ${plan.current ? 'opacity-50 cursor-default' : ''}`}
                onClick={() => !plan.current && handleUpgrade(plan.name)}
                disabled={plan.current}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="shrink-0 p-4 md:p-6 bg-slate-50 dark:bg-white/2 text-center border-t border-slate-100 dark:border-white/5">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 text-xs">
             <span className="font-bold flex items-center gap-1.5"><Shield size={14}/> Trusted by 10k+ Founders</span>
             <span className="font-bold flex items-center gap-1.5">✨ AI Powered Insights</span>
             <span className="font-bold flex items-center gap-1.5">🔒 Secure Cloud Backup</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
