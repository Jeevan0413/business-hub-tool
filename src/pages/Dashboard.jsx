import React from 'react';
import { motion } from 'framer-motion';
import { 
  ReceiptText, 
  Rocket, 
  Target, 
  Presentation, 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign,
  TrendingDown,
  LayoutDashboard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import Card from '../components/Card';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

const tools = [
  { name: 'Finance Hub', description: 'Professional Invoice Generator & Expense tracker.', icon: ReceiptText, color: 'text-emerald-500', bg: 'bg-emerald-500/10', path: '/finance' },
  { name: 'Startup Engine', description: 'AI-based Name Generator and Domain checker.', icon: Rocket, color: 'text-blue-500', bg: 'bg-blue-500/10', path: '/startup' },
  { name: 'Strategy Lab', description: 'Strategic SWOT Analysis builder with visual grid.', icon: Target, color: 'text-purple-500', bg: 'bg-purple-500/10', path: '/planning' },
  { name: 'Pitch Builder', description: 'Pitch Deck structure tool for business ideas.', icon: Presentation, color: 'text-orange-500', bg: 'bg-orange-500/10', path: '/pitch' }
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const { isDarkMode } = useTheme();
  const { stats, activities, invoices } = useData();

  const chartColors = {
    grid: isDarkMode ? '#1e293b' : '#e2e8f0',
    text: isDarkMode ? '#94a3b8' : '#64748b'
  };

  // Prepare chart data from real invoices
  const chartData = [
    { name: 'Mon', revenue: 400 },
    { name: 'Tue', revenue: 300 },
    { name: 'Wed', revenue: 900 },
    { name: 'Thu', revenue: 500 },
    { name: 'Fri', revenue: 1200 },
    { name: 'Sat', revenue: 800 },
    { name: 'Sun', revenue: stats.monthlyRevenue / 10 },
  ];

  const getIcon = (action) => {
    if (action.includes('Invoice')) return ReceiptText;
    if (action.includes('employee')) return Users;
    if (action.includes('expense')) return DollarSign;
    return Activity;
  };

  const getColor = (action) => {
    if (action.includes('Invoice')) return 'text-emerald-500';
    if (action.includes('employee')) return 'text-blue-500';
    if (action.includes('expense')) return 'text-red-500';
    return 'text-slate-500';
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary-600 rounded-2xl shadow-xl shadow-primary-500/20">
          <LayoutDashboard className="text-white" size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Business Overview</h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Real-time performance of your workspace.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `$${stats.monthlyRevenue.toLocaleString()}`, change: '+12.5%', icon: DollarSign, color: 'text-emerald-500' },
          { label: 'Active Team', value: stats.totalEmployees, change: 'Across 4 depts', icon: Users, color: 'text-blue-500' },
          { label: 'Total Expenses', value: `$${stats.totalExpenses.toLocaleString()}`, change: 'Monthly burn', icon: TrendingDown, color: 'text-red-500' },
          { label: 'System Health', value: '99.9%', change: 'All systems go', icon: Activity, color: 'text-primary-500' },
        ].map((stat, i) => (
          <Card key={i} className="group hover:border-primary-500/50 transition-all cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={22} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.color} bg-slate-100 dark:bg-white/5`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-black dark:text-white mt-1">{stat.value}</h3>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold dark:text-white">Revenue Growth</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-lg text-emerald-600 text-xs font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Feed
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 12 }} />
                <Tooltip content={({ active, payload, label }) => (active && payload ? (
                  <div className="glass p-3 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">{label}</p>
                    <p className="text-lg font-black dark:text-white">${payload[0].value.toLocaleString()}</p>
                  </div>
                ) : null)} />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold dark:text-white mb-6">Real-time Activity</h3>
          <div className="space-y-6 max-h-[350px] overflow-y-auto no-scrollbar pr-2">
            {activities.length === 0 ? (
              <div className="text-center py-10 text-slate-500">No activity yet. Start using tools!</div>
            ) : (
              activities.map((activity) => {
                const Icon = getIcon(activity.action);
                return (
                  <div key={activity.id} className="flex items-start gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className={`p-2 rounded-lg bg-slate-100 dark:bg-white/5 ${getColor(activity.action)}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm dark:text-white font-medium">{activity.action}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-100 dark:bg-white/5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-primary-600 hover:text-white transition-all">
            View System Logs
          </button>
        </Card>
      </div>

      <h2 className="text-2xl font-black dark:text-white pt-4 tracking-tight">Business Productivity Suite</h2>
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <motion.div key={tool.name} variants={item}>
            <Link to={tool.path}>
              <Card className="h-full flex flex-col group relative overflow-hidden hover:border-primary-500/50 transition-all active:scale-[0.98]">
                <div className={`absolute -top-6 -right-6 w-24 h-24 ${tool.bg} rounded-full transition-transform duration-700 group-hover:scale-[3] opacity-50`} />
                <div className="flex flex-col gap-4 relative z-10 h-full">
                  <div className={`p-3 rounded-2xl w-fit ${tool.bg} ${tool.color} shadow-lg shadow-black/5`}>
                    <tool.icon size={26} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{tool.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{tool.description}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-primary-600 text-sm font-bold group-hover:translate-x-1 transition-all pt-4 uppercase tracking-widest">
                    Enter <ArrowRight size={16} />
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
