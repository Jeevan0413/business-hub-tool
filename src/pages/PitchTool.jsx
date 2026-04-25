import React, { useState } from 'react';
import { Presentation, Save, Share2, Eye, Layout } from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  { id: 'problem', title: 'The Problem', description: 'What pain point are you solving?' },
  { id: 'solution', title: 'The Solution', description: 'How does your product fix it?' },
  { id: 'market', title: 'Market Opportunity', description: 'Who is your target audience?' },
  { id: 'revenue', title: 'Revenue Model', description: 'How will you make money?' },
];

export default function PitchTool() {
  const [pitchData, setPitchData] = useState({
    problem: '',
    solution: '',
    market: '',
    revenue: '',
    companyName: ''
  });
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPreview, setIsPreview] = useState(false);

  const handleInputChange = (field, value) => {
    setPitchData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <Presentation className="text-orange-500" size={32} />
            Pitch Deck Generator
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Structure your vision and impress investors.</p>
        </div>
        <Button onClick={() => setIsPreview(!isPreview)} variant={isPreview ? 'secondary' : 'primary'}>
          {isPreview ? <Layout size={20} /> : <Eye size={20} />}
          {isPreview ? 'Back to Editor' : 'Live Preview'}
        </Button>
      </div>

      {!isPreview ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Slides</h3>
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(index)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                  activeSlide === index 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                    : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-xs font-bold opacity-60 mr-2">0{index + 1}</span>
                {slide.title}
              </button>
            ))}
          </div>

          <div className="lg:col-span-3">
            <Card className="p-8 space-y-8 min-h-[500px] flex flex-col">
              <div>
                <h2 className="text-2xl font-bold dark:text-white mb-2">{slides[activeSlide].title}</h2>
                <p className="text-slate-500">{slides[activeSlide].description}</p>
              </div>

              <textarea
                className="flex-1 w-full p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-white text-xl leading-relaxed resize-none"
                placeholder={`Describe the ${slides[activeSlide].title.toLowerCase()}...`}
                value={pitchData[slides[activeSlide].id]}
                onChange={(e) => handleInputChange(slides[activeSlide].id, e.target.value)}
              />

              <div className="flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  disabled={activeSlide === 0}
                  onClick={() => setActiveSlide(s => s - 1)}
                >
                  Previous
                </Button>
                <Button 
                  disabled={activeSlide === slides.length - 1}
                  onClick={() => setActiveSlide(s => s + 1)}
                >
                  Next Slide
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-12 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {slides.map((slide, index) => (
              <Card key={slide.id} className="p-10 flex flex-col justify-center bg-white dark:bg-dark-900 border-none shadow-2xl min-h-[400px] group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 text-8xl font-black text-slate-100 dark:text-white/5 select-none transition-transform group-hover:scale-110">
                  0{index + 1}
                </div>
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold uppercase tracking-widest mb-4">
                    {slide.title}
                  </span>
                  <h3 className="text-3xl font-bold dark:text-white mb-6 leading-tight">
                    {pitchData[slide.id] || 'Content not added yet...'}
                  </h3>
                </div>
              </Card>
            ))}
          </motion.div>
          
          <div className="flex justify-center gap-4">
            <Button className="rounded-full px-8 py-3 bg-slate-900 hover:bg-slate-800">
              <Save size={20} /> Save Progress
            </Button>
            <Button className="rounded-full px-8 py-3 bg-orange-600 hover:bg-orange-500">
              <Share2 size={20} /> Export Presentation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
