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
  DollarSign 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import Card from '../components/Card';
import { useTheme } from '../context/ThemeContext';


const data = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
];

const tools = [
  {
    name: 'Finance Tool',
    description: 'Professional Invoice Generator with GST and PDF export.',
    icon: ReceiptText,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    path: '/finance'
  },
  {
    name: 'Startup Tool',
    description: 'AI-based Name Generator and Domain checker.',
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
  const { isDarkMode } = useTheme();

  const chartColors = {
    grid: isDarkMode ? '#1e293b' : '#e2e8f0',
    text: isDarkMode ? '#94a3b8' : '#64748b',
    tooltipBg: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.8)',
    tooltipBorder: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
  };

  return (

    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          Overview
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Welcome to your Business OS. Here's how your company is performing today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$45,231', change: '+20.1%', icon: DollarSign, color: 'text-emerald-500' },
          { label: 'Active Employees', value: '12', change: '+2 this month', icon: Users, color: 'text-blue-500' },
          { label: 'Recent Actions', value: '148', change: 'Last 24h', icon: Activity, color: 'text-purple-500' },
          { label: 'Success Rate', value: '98%', change: '+2.4%', icon: TrendingUp, color: 'text-orange-500' },
        ].map((stat, i) => (
          <Card key={i} className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-slate-100 dark:bg-white/5 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold dark:text-white">{stat.value}</h3>
              <p className="text-xs text-emerald-500 font-medium">{stat.change}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold dark:text-white">Revenue Growth</h3>
            <select className="bg-slate-100 dark:bg-white/5 border-none rounded-lg text-sm dark:text-white px-3 py-1.5 outline-none">
              <option>Last 7 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: chartColors.text, fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: chartColors.text, fontSize: 12 }}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass p-3 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl">
                          <p className="text-xs font-bold text-slate-500 uppercase mb-1">{label}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary-500" />
                            <p className="text-lg font-black dark:text-white">${payload[0].value.toLocaleString()}</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-xl font-bold dark:text-white mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { user: 'Rahul Sharma', action: 'Created Invoice', time: '2h ago', icon: ReceiptText, color: 'text-emerald-500' },
              { user: 'System', action: 'New Employee Added', time: '4h ago', icon: Users, color: 'text-blue-500' },
              { user: 'Priya Patel', action: 'Generated Pitch Deck', time: '5h ago', icon: Presentation, color: 'text-orange-500' },
              { user: 'Admin', action: 'Updated SWOT', time: '1d ago', icon: Target, color: 'text-purple-500' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`p-2 rounded-lg bg-slate-100 dark:bg-white/5 ${activity.color}`}>
                  <activity.icon size={18} />
                </div>
                <div>
                  <p className="text-sm dark:text-white">
                    <span className="font-bold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            View All Activity
          </button>
        </Card>
      </div>

      <h2 className="text-2xl font-bold dark:text-white pt-4">Quick Access Tools</h2>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {tools.map((tool) => (
          <motion.div key={tool.name} variants={item}>
            <Link to={tool.path}>
              <Card className="h-full flex flex-col group relative overflow-hidden border border-slate-200 dark:border-white/5 hover:border-primary-500/50 transition-colors">
                <div className={`absolute top-0 right-0 w-24 h-24 ${tool.bg} rounded-bl-full transition-transform duration-500 group-hover:scale-110 -mr-6 -mt-6`} />
                
                <div className="flex flex-col gap-4 relative z-10 h-full">
                  <div className={`p-3 rounded-xl w-fit ${tool.bg} ${tool.color}`}>
                    <tool.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-primary-600 text-sm font-semibold group-hover:gap-3 transition-all pt-4">
                    Open Tool <ArrowRight size={16} />
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
