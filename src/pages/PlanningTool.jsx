import React, { useState } from 'react';
import { Target, Shield, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

const sections = [
  { 
    id: 'strengths', 
    title: 'Strengths', 
    icon: Shield, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-500/10',
    placeholder: 'e.g. Unique technology, Experienced team...'
  },
  { 
    id: 'weaknesses', 
    title: 'Weaknesses', 
    icon: AlertTriangle, 
    color: 'text-orange-500', 
    bg: 'bg-orange-500/10',
    placeholder: 'e.g. Low budget, Limited market presence...'
  },
  { 
    id: 'opportunities', 
    title: 'Opportunities', 
    icon: TrendingUp, 
    color: 'text-blue-500', 
    bg: 'bg-blue-500/10',
    placeholder: 'e.g. Growing market, New regulations...'
  },
  { 
    id: 'threats', 
    title: 'Threats', 
    icon: Lightbulb, 
    color: 'text-red-500', 
    bg: 'bg-red-500/10',
    placeholder: 'e.g. Competitors, Economic downturn...'
  }
];

export default function PlanningTool() {
  const [swotData, setSwotData] = useState({
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: ''
  });

  const handleTextChange = (id, value) => {
    setSwotData(prev => ({ ...prev, [id]: value }));
  };

  const clearSwot = () => {
    if (window.confirm('Clear all SWOT data?')) {
      setSwotData({ strengths: '', weaknesses: '', opportunities: '', threats: '' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <Target className="text-purple-500" size={32} />
            SWOT Analysis
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Evaluate your business strategy with this visual framework.</p>
        </div>
        <Button variant="secondary" onClick={clearSwot}>Clear All</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card key={section.id} className="p-0 overflow-hidden flex flex-col h-[400px]">
            <div className={`flex items-center gap-3 p-4 ${section.bg}`}>
              <section.icon className={section.color} size={24} />
              <h3 className={`text-lg font-bold ${section.color}`}>{section.title}</h3>
            </div>
            <textarea
              className="flex-1 w-full p-6 bg-transparent resize-none focus:outline-none dark:text-white text-lg leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600"
              placeholder={section.placeholder}
              value={swotData[section.id]}
              onChange={(e) => handleTextChange(section.id, e.target.value)}
            />
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900 text-white p-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Shield size={24} className="text-emerald-500" /> Pro Tip: Strategic Mapping
        </h3>
        <p className="text-slate-400 leading-relaxed">
          Use your **Strengths** to take advantage of **Opportunities**. Address your **Weaknesses** to avoid potential **Threats**. A good SWOT analysis is just the first step in creating a viable roadmap.
        </p>
      </Card>
    </div>
  );
}
