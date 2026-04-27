import React, { useState } from 'react';
import { 
  Presentation, 
  Plus, 
  Trash2, 
  Download, 
  Sparkles, 
  Layout, 
  ChevronRight, 
  ChevronLeft, 
  Eye 
} from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { jsPDF } from 'jspdf';

const initialSlidesData = [
  { title: 'The Problem', content: 'What is the pain point you are solving?' },
  { title: 'Our Solution', content: 'How does your product solve this problem?' },
  { title: 'Market Size', content: 'How big is the opportunity?' },
  { title: 'Business Model', content: 'How will you make money?' },
];

export default function PitchTool() {
  const [slides, setSlides] = useState(initialSlidesData);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const updateSlide = (field, value) => {
    const newSlides = [...slides];
    newSlides[currentSlideIndex][field] = value;
    setSlides(newSlides);
  };

  const addSlide = () => {
    setSlides([...slides, { title: 'New Slide', content: '' }]);
    setCurrentSlideIndex(slides.length);
  };

  const removeSlide = (index) => {
    if (slides.length === 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    setCurrentSlideIndex(Math.max(0, index - 1));
  };

  const generateAI = () => {
    const aiSlides = [
      { title: 'Vision', content: 'To revolutionize how small businesses manage their daily operations through an integrated AI-powered OS.' },
      { title: 'The Problem', content: 'Small businesses waste 40% of their time switching between disconnected tools for HR, Finance, and Marketing.' },
      { title: 'The Solution', content: 'A centralized Business Tool Hub that automates workflows and provides 10+ essential tools in one dashboard.' },
      { title: 'Market Opportunity', content: 'The global SMB software market is projected to reach $150B by 2028.' },
    ];
    setSlides(aiSlides);
    setCurrentSlideIndex(0);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    slides.forEach((slide, index) => {
      if (index > 0) doc.addPage();
      
      // Slide background
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 297, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(32);
      doc.setFont('helvetica', 'bold');
      doc.text(slide.title, 105, 100, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 200, 200);
      const lines = doc.splitTextToSize(slide.content, 160);
      doc.text(lines, 105, 130, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`Slide ${index + 1} of ${slides.length}`, 105, 280, { align: 'center' });
    });
    doc.save('Pitch_Deck.pdf');
  };

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <Presentation className="text-orange-500" size={32} />
            Pitch Deck Generator
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Structure your business story and export as a professional PDF.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={generateAI}>
            <Sparkles size={18} /> Generate AI Content
          </Button>
          <Button onClick={downloadPDF}>
            <Download size={18} /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-1 p-4 h-[600px] flex flex-col">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="font-bold dark:text-white">Slides</h3>
            <button onClick={addSlide} className="p-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {slides.map((slide, i) => (
              <div 
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={`group p-4 rounded-xl cursor-pointer border-2 transition-all ${
                  currentSlideIndex === i 
                    ? 'border-primary-500 bg-primary-500/5' 
                    : 'border-transparent bg-slate-100 dark:bg-white/5 dark:text-white hover:border-slate-300 dark:hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-400">0{i + 1}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeSlide(i); }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="font-bold dark:text-white text-sm mt-1 truncate">{slide.title}</div>
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Card className="p-8 md:p-12 min-h-[500px] bg-slate-900 border-none shadow-2xl relative overflow-hidden flex flex-col justify-center items-center text-center">
            <div className="absolute top-0 right-0 p-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            </div>
            
            <input 
              className="w-full bg-transparent text-4xl md:text-5xl font-black text-white text-center border-none outline-none placeholder:text-white/20 mb-8"
              value={currentSlide.title}
              onChange={(e) => updateSlide('title', e.target.value)}
              placeholder="Slide Title"
            />
            
            <textarea 
              className="w-full bg-transparent text-xl md:text-2xl text-slate-400 text-center border-none outline-none placeholder:text-white/10 resize-none h-48 leading-relaxed"
              value={currentSlide.content}
              onChange={(e) => updateSlide('content', e.target.value)}
              placeholder="Add your slide content here..."
            />

            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
              <button 
                disabled={currentSlideIndex === 0}
                onClick={() => setCurrentSlideIndex(prev => prev - 1)}
                className="p-2 text-white/50 hover:text-white disabled:opacity-20 transition-colors"
              >
                <ChevronLeft size={32} />
              </button>
              <span className="text-white/20 font-mono">
                {currentSlideIndex + 1} / {slides.length}
              </span>
              <button 
                disabled={currentSlideIndex === slides.length - 1}
                onClick={() => setCurrentSlideIndex(prev => prev + 1)}
                className="p-2 text-white/50 hover:text-white disabled:opacity-20 transition-colors"
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </Card>

          <div className="flex gap-4">
            <Card className="flex-1 flex items-center gap-4 py-4">
              <Eye className="text-primary-600" />
              <span className="text-sm font-bold dark:text-white">Slide Preview Mode</span>
            </Card>
            <Card className="flex-1 flex items-center gap-4 py-4">
              <Layout className="text-purple-500" />
              <span className="text-sm font-bold dark:text-white">Theme: Dark Modern</span>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
