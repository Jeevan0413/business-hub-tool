import React, { useState } from 'react';
import { Target, Shield, AlertTriangle, Lightbulb, TrendingUp, Download, Sparkles } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { jsPDF } from 'jspdf';

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

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.text('SWOT ANALYSIS', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });

    let y = 50;
    sections.forEach(section => {
      doc.setFont(undefined, 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text(section.title.toUpperCase(), 20, y);
      
      doc.setFont(undefined, 'normal');
      doc.setTextColor(100, 100, 100);
      const lines = doc.splitTextToSize(swotData[section.id] || 'No content added.', 170);
      doc.text(lines, 20, y + 10);
      
      y += 20 + (lines.length * 7);
    });

    doc.save('SWOT_Analysis.pdf');
  };

  const generateAI = () => {
    setSwotData({
      strengths: '• Strong brand presence\n• Patented technology\n• High customer loyalty',
      weaknesses: '• High operational costs\n• Limited international reach\n• Dependency on single supplier',
      opportunities: '• Emerging market trends\n• Strategic partnerships\n• Digital transformation',
      threats: '• New market entrants\n• Changing regulations\n• Economic fluctuations'
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <Target className="text-purple-500" size={32} />
            Strategic SWOT Analysis
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Evaluate your business strategy with this visual framework.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={generateAI}>
            <Sparkles size={18} /> Suggest with AI
          </Button>
          <Button onClick={downloadPDF}>
            <Download size={18} /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card key={section.id} className="p-0 overflow-hidden flex flex-col h-[400px] border-none shadow-xl">
            <div className={`flex items-center gap-3 p-5 ${section.bg}`}>
              <div className={`p-2 rounded-lg bg-white/50 dark:bg-black/20 ${section.color}`}>
                <section.icon size={20} />
              </div>
              <h3 className={`text-lg font-bold ${section.color}`}>{section.title}</h3>
            </div>
            <textarea
              className="flex-1 w-full p-8 bg-transparent resize-none focus:outline-none dark:text-white text-lg leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 custom-scrollbar"
              placeholder={section.placeholder}
              value={swotData[section.id]}
              onChange={(e) => handleTextChange(section.id, e.target.value)}
            />
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900 text-white p-8 relative overflow-hidden border-none shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="p-4 bg-white/10 rounded-2xl">
            <Shield size={48} className="text-emerald-500" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Pro Tip: Strategic Mapping</h3>
            <p className="text-slate-400 leading-relaxed max-w-2xl">
              A good SWOT analysis is just the first step. Use your **Strengths** to take advantage of **Opportunities**, and address your **Weaknesses** before they become **Threats**.
            </p>
          </div>
          <Button variant="secondary" className="border-white/20 hover:bg-white/10 text-white">
            View Roadmap Guide
          </Button>
        </div>
      </Card>
    </div>
  );
}
