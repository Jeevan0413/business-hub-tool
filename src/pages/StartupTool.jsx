import React, { useState } from 'react';
import { Rocket, Sparkles, Copy, Check } from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const prefixes = ['Nex', 'Cloud', 'Hyper', 'Swift', 'Meta', 'Zen', 'Aero', 'Eco', 'Vibe', 'Lumina'];
const suffixes = ['ify', 'ly', 'io', 'flow', 'base', 'hub', 'gen', 'scale', 'sync', 'pulse'];

export default function StartupTool() {
  const [keyword, setKeyword] = useState('');
  const [names, setNames] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const generateNames = () => {
    if (!keyword) return;
    
    const newNames = [];
    const base = keyword.trim().charAt(0).toUpperCase() + keyword.trim().slice(1).toLowerCase();

    // Strategy 1: Prefix + Keyword
    for (let i = 0; i < 3; i++) {
      newNames.push(prefixes[Math.floor(Math.random() * prefixes.length)] + base);
    }

    // Strategy 2: Keyword + Suffix
    for (let i = 0; i < 3; i++) {
      newNames.push(base + suffixes[Math.floor(Math.random() * suffixes.length)]);
    }

    // Strategy 3: Just the keyword styled
    newNames.push(base + ' Labs');
    newNames.push(base + ' AI');
    newNames.push('The ' + base + ' Co');

    setNames([...new Set(newNames)].slice(0, 10));
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-3xl bg-blue-500/10 text-blue-500 mb-2">
          <Rocket size={48} />
        </div>
        <h1 className="text-4xl font-bold dark:text-white">Business Name Generator</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
          Enter a keyword and our tool will brainstorm 10 creative names for your next big idea.
        </p>
      </div>

      <Card className="p-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. AI, Green, Finance, Tech..."
              className="text-lg py-4 px-6 rounded-2xl"
              onKeyPress={(e) => e.key === 'Enter' && generateNames()}
            />
          </div>
          <Button 
            onClick={generateNames} 
            className="rounded-2xl px-10 py-4 text-lg"
            disabled={!keyword}
          >
            <Sparkles size={20} /> Generate
          </Button>
        </div>
      </Card>

      {names.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {names.map((name, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="flex items-center justify-between p-5 group">
                <span className="text-xl font-semibold dark:text-white">{name}</span>
                <button 
                  onClick={() => copyToClipboard(name, index)}
                  className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-primary-500 transition-all"
                >
                  {copiedIndex === index ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                </button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {names.length === 0 && keyword && (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
          <p className="text-slate-400">Click generate to see magic happen ✨</p>
        </div>
      )}
    </div>
  );
}
import { motion } from 'framer-motion';
