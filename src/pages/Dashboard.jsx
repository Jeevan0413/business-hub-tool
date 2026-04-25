import React from 'react';
import { motion } from 'framer-motion';
import { ReceiptText, Rocket, Target, Presentation, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

const tools = [
  {
    name: 'Finance Tool',
    description: 'Professional Invoice Generator with PDF export capabilities.',
    icon: ReceiptText,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    path: '/finance'
  },
  {
    name: 'Startup Tool',
    description: 'AI-powered Business Name Generator for your next venture.',
    icon: Rocket,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    path: '/startup'
  },
  {
    name: 'Planning Tool',
    description: 'Strategic SWOT Analysis builder with visual grid layout.',
    icon: Target,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    path: '/planning'
  },
  {
    name: 'Pitch Tool',
    description: 'Pitch Deck Generator to structure your business ideas.',
    icon: Presentation,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    path: '/pitch'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          Welcome to Business Hub
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Your centralized platform for essential business tools. Generate invoices, brainstorm names, and plan your strategy all in one place.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {tools.map((tool) => (
          <motion.div key={tool.name} variants={item}>
            <Link to={tool.path}>
              <Card className="h-full flex flex-col group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 ${tool.bg} rounded-bl-full transition-transform duration-500 group-hover:scale-110 -mr-8 -mt-8`} />
                
                <div className="flex items-start gap-4 relative z-10">
                  <div className={`p-3 rounded-xl ${tool.bg} ${tool.color}`}>
                    <tool.icon size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-4 transition-all">
                      Open Tool <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <Card className="bg-primary-600 dark:bg-primary-700 text-white border-none p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <div className="relative z-10 max-w-xl">
          <h2 className="text-3xl font-bold mb-4">Scale Your Business Faster</h2>
          <p className="text-primary-50 mb-8 leading-relaxed">
            Everything you need to launch and manage your startup. From financial planning to pitching investors, we've got you covered.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/20 text-sm font-medium">
              ✨ Modern Design
            </div>
            <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/20 text-sm font-medium">
              🚀 Rapid Tools
            </div>
            <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/20 text-sm font-medium">
              🔒 100% Client-side
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
