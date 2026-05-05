import React, { useState } from 'react';
import { 
  Rocket, 
  Search, 
  RefreshCcw, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  Palette, 
  Layout, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNotification } from '../context/NotificationContext';

const nameSuggestionsData = {
  tech: ['CodeNexus', 'ByteBound', 'DevFlow', 'SyncWave', 'DataPulse', 'CloudCraft', 'LogicLoom', 'BitBridge'],
  creative: ['VividMind', 'ArtisanHub', 'SparkStudio', 'DreamWeaver', 'CanvasCloud', 'InspireInk', 'MuseMatic', 'PixelPerfect'],
  business: ['EliteEdge', 'PrimePath', 'GlobalGrowth', 'MarketMaster', 'DirectDrive', 'StrategyStack', 'ProfitPulse', 'AscentApps'],
  modern: ['Koda', 'Zentry', 'Volo', 'Lumina', 'Nox', 'Arca', 'Solis', 'Mura']
};

export default function StartupTool() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('tech');
  const [suggestions, setSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const [domainStatus, setDomainStatus] = useState(null);
  const { showToast } = useNotification();

  const generateNames = () => {
    setIsGenerating(true);
    setSuggestions([]);
    setTimeout(() => {
      const baseNames = nameSuggestionsData[category] || nameSuggestionsData.tech;
      const filtered = baseNames.sort(() => 0.5 - Math.random()).slice(0, 8);
      setSuggestions(filtered.map(name => keyword ? `${keyword}${name}` : name));
      setIsGenerating(false);
      showToast('AI suggestions generated!', 'success');
    }, 1200);
  };

  const checkDomain = (name) => {
    setSelectedName(name);
    setDomainStatus({ loading: true });
    setTimeout(() => {
      const available = Math.random() > 0.3;
      setDomainStatus({ tld: '.com', available, loading: false });
      if (available) {
        showToast(`${name.toLowerCase()}.com is available!`, 'success');
      } else {
        showToast(`${name.toLowerCase()}.com is taken.`, 'warning');
      }
    }, 800);
  };

  const logoStyles = [
    { name: 'Minimal', font: 'font-sans', bg: 'bg-slate-900', text: 'text-white' },
    { name: 'Playful', font: 'font-serif', bg: 'bg-primary-600', text: 'text-white' },
    { name: 'Bold', font: 'font-black', bg: 'bg-yellow-400', text: 'text-black' },
    { name: 'Gradient', font: 'font-bold', bg: 'bg-gradient-to-br from-primary-600 to-purple-600', text: 'text-white' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
          <Rocket className="text-blue-500" size={32} />
          Startup Engine
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Find the perfect name and identity for your next venture.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8">
            <h3 className="text-xl font-bold mb-6 dark:text-white">AI Name Generator</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input 
                  label="Keyword (Optional)" 
                  placeholder="e.g. cloud, smart, fast" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Industry Category</label>
                <select 
                  className="w-full h-11 bg-slate-100 dark:bg-white/5 border-none rounded-xl dark:text-white px-4 outline-none focus:ring-2 focus:ring-primary-500/50"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="tech">Technology</option>
                  <option value="creative">Creative / Arts</option>
                  <option value="business">Business / Finance</option>
                  <option value="modern">Minimalist / Modern</option>
                </select>
              </div>
              <div className="md:pt-7">
                <Button onClick={generateNames} disabled={isGenerating} className="h-11 px-8">
                  {isGenerating ? <RefreshCcw className="animate-spin" /> : 'Generate'}
                </Button>
              </div>
            </div>

            {suggestions.length > 0 && (
              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 animate-in zoom-in duration-300">
                {suggestions.map((name, i) => (
                  <button
                    key={i}
                    onClick={() => checkDomain(name)}
                    className={`p-4 rounded-2xl border-2 transition-all text-center font-bold ${
                      selectedName === name 
                        ? 'border-primary-500 bg-primary-500/10 text-primary-600' 
                        : 'border-transparent bg-slate-100 dark:bg-white/5 dark:text-white hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </Card>

          {selectedName && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
                  <Globe size={20} className="text-blue-500" />
                  Domain Availability
                </h3>
                {domainStatus?.loading ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <RefreshCcw size={16} className="animate-spin" /> Checking availability...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { tld: '.com', available: domainStatus?.available },
                      { tld: '.io', available: Math.random() > 0.5 },
                      { tld: '.ai', available: Math.random() > 0.7 },
                    ].map((domain, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-white/5">
                        <span className="font-mono font-bold dark:text-white">{selectedName.toLowerCase()}{domain.tld}</span>
                        <div className="flex items-center gap-3">
                          {domain.available ? (
                            <span className="flex items-center gap-1 text-emerald-500 text-sm font-bold">
                              <CheckCircle2 size={16} /> Available
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-500 text-sm font-bold">
                              <XCircle size={16} /> Taken
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
                  <Palette size={20} className="text-purple-500" />
                  Identity Preview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {logoStyles.map((style, i) => (
                    <div key={i} className="space-y-2">
                      <div className={`${style.bg} ${style.text} aspect-video rounded-xl flex items-center justify-center p-4 text-center overflow-hidden shadow-lg`}>
                        <span className={`${style.font} text-xl truncate`}>{selectedName}</span>
                      </div>
                      <p className="text-xs text-center text-slate-500 font-medium">{style.name}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none shadow-xl shadow-blue-500/20">
            <h3 className="text-xl font-bold mb-4">Launch Strategy</h3>
            <p className="text-blue-100 mb-6 text-sm leading-relaxed">
              Naming is just the first step. Use our Strategy Lab and Pitch Builder to build a solid foundation.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm font-medium p-3 bg-white/10 rounded-xl">
                <CheckCircle2 size={18} className="text-blue-300" /> Domain Availability Check
              </div>
              <div className="flex items-center gap-3 text-sm font-medium p-3 bg-white/10 rounded-xl">
                <CheckCircle2 size={18} className="text-blue-300" /> Social Media Sync
              </div>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-bold mb-4 dark:text-white">Pro Tips</h3>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                Keep it short and memorable.
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                Avoid numbers and hyphens.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
