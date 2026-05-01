import React, { useRef } from 'react';
import { 
  Upload, 
  Palette, 
  FileText, 
  Lock, 
  Trash2, 
  Layout as LayoutIcon, 
  Zap, 
  Eye, 
  EyeOff, 
  GripVertical,
  Save,
  Check,
  ChevronUp,
  ChevronDown,
  Plus,
  Shield
} from 'lucide-react';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import TemplateSelector from './TemplateSelector';
import { useData } from '../context/DataContext';

export default function InvoiceCustomization({ onUpgradeClick }) {
  const { userPlan, invoiceSettings, updateInvoiceSettings } = useData();
  const fileInputRef = useRef(null);

  const isPro = userPlan === 'Pro' || userPlan === 'Premium';
  const isPremium = userPlan === 'Premium';

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateInvoiceSettings({ logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSection = (section) => {
    if (!isPremium) {
      onUpgradeClick();
      return;
    }
    const newVisible = { ...invoiceSettings.visibleSections };
    newVisible[section] = !newVisible[section];
    updateInvoiceSettings({ visibleSections: newVisible });
  };

  const moveSection = (index, direction) => {
    if (!isPremium) {
      onUpgradeClick();
      return;
    }
    const newOrder = [...(invoiceSettings.sectionsOrder || [])];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newOrder.length) return;
    
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
    updateInvoiceSettings({ sectionsOrder: newOrder });
  };

  const handleSaveTemplate = () => {
    if (!isPremium) {
      onUpgradeClick();
      return;
    }
    const templateName = prompt('Enter template name:', `Custom ${invoiceSettings.templateId} ${new Date().toLocaleDateString()}`);
    if (templateName) {
      const newTemplate = {
        id: `custom_${Date.now()}`,
        name: templateName,
        settings: { ...invoiceSettings }
      };
      updateInvoiceSettings({ 
        savedTemplates: [...(invoiceSettings.savedTemplates || []), newTemplate] 
      });
      alert('Template saved successfully!');
    }
  };

  const colors = ['#0ea5e9', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b', '#000000'];

  const sectionLabels = {
    header: 'Company Header',
    info: 'Client Details',
    items: 'Line Items Table',
    summary: 'Totals & Tax',
    footer: 'Notes & Footer'
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="xl:col-span-2 space-y-8">
        {/* Branding & Style Card */}
        <Card>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black dark:text-white flex items-center gap-3">
              <Palette className="text-primary-500" size={24} />
              Branding & Style
            </h3>
            {!isPro && (
              <span className="px-4 py-1.5 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-amber-500/20">
                <Shield size={12} /> Unlock Pro Features
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Logo Upload */}
            <div className={`space-y-4 ${!isPro ? 'opacity-50 pointer-events-none' : ''}`}>
              <label className="text-xs font-black dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Company Branding
              </label>
              
              {invoiceSettings?.logo ? (
                <div className="relative w-full aspect-video rounded-3xl border-2 border-slate-100 dark:border-white/5 overflow-hidden group bg-slate-50 dark:bg-white/2">
                  <img src={invoiceSettings.logo} alt="Logo" className="w-full h-full object-contain p-6" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                    <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}><Upload size={16} /></Button>
                    <Button variant="danger" size="sm" onClick={() => updateInvoiceSettings({ logo: null })}><Trash2 size={16} /></Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-primary-500 dark:hover:border-primary-500 transition-all flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-primary-500 group bg-slate-50 dark:bg-white/2"
                >
                  <div className="p-4 bg-white dark:bg-white/5 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider">Drop Logo Here</span>
                </button>
              )}
              <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
            </div>

            {/* Theme Colors */}
            <div className={`space-y-4 ${!isPro ? 'opacity-50 pointer-events-none' : ''}`}>
              <label className="text-xs font-black dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Brand Accent Color
              </label>
              <div className="grid grid-cols-3 gap-4">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateInvoiceSettings({ themeColor: color })}
                    className={`h-14 rounded-2xl border-4 transition-all relative ${
                      invoiceSettings?.themeColor === color 
                        ? 'border-white dark:border-slate-700 ring-4 ring-primary-500/30' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {invoiceSettings?.themeColor === color && <div className="absolute inset-0 flex items-center justify-center"><Check size={20} className="text-white" strokeWidth={4} /></div>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Template Selector Card */}
        <Card>
           <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black dark:text-white flex items-center gap-3">
              <LayoutIcon className="text-primary-500" size={24} />
              Visual Layouts
            </h3>
          </div>
          <TemplateSelector 
            selectedId={invoiceSettings?.templateId || 'default'} 
            onSelect={(id) => updateInvoiceSettings({ templateId: id })}
            onUpgradeClick={onUpgradeClick}
          />
        </Card>

        {/* Live Preview Section */}
        <div className="space-y-4">
          <label className="text-xs font-black dark:text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
            <Eye size={16} className="text-primary-500" />
            Real-time Output Preview
          </label>
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border-8 border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden min-h-[500px] relative">
             {/* Mock Invoice UI */}
             <div className="p-8 space-y-6">
                {/* Header Mock */}
                <div 
                  className="h-24 rounded-2xl flex items-center px-8 transition-colors duration-500"
                  style={{ backgroundColor: invoiceSettings?.themeColor + '20' }}
                >
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-white/10 rounded-full mb-2" />
                    <div className="h-3 w-48 bg-slate-100 dark:bg-white/5 rounded-full" />
                  </div>
                  {invoiceSettings?.logo && <img src={invoiceSettings.logo} className="h-12 w-auto grayscale opacity-50" />}
                </div>

                {/* Body Mock */}
                <div className="space-y-4 px-4">
                   <div className="h-8 w-1/4 bg-slate-200 dark:bg-white/10 rounded-lg mb-8" />
                   <div className="space-y-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex gap-4 border-b border-slate-100 dark:border-white/5 pb-3">
                          <div className="flex-1 h-4 bg-slate-50 dark:bg-white/2 rounded" />
                          <div className="w-12 h-4 bg-slate-50 dark:bg-white/2 rounded" />
                          <div className="w-20 h-4 bg-slate-50 dark:bg-white/2 rounded" />
                        </div>
                      ))}
                   </div>
                </div>

                {/* Footer Mock */}
                <div className="mt-12 pt-8 border-t-2 border-dashed border-slate-100 dark:border-white/5 px-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2 flex-1">
                      {invoiceSettings?.notes && invoiceSettings?.visibleSections?.notes && (
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter italic">Notes: {invoiceSettings.notes}</p>
                      )}
                      {invoiceSettings?.footerText && invoiceSettings?.visibleSections?.footer && (
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter text-center w-full mt-4">{invoiceSettings.footerText}</p>
                      )}
                    </div>
                    <div className="w-32 h-12 rounded-xl bg-slate-900 dark:bg-primary-600 flex items-center justify-center text-white font-black text-lg">
                      $4,200
                    </div>
                  </div>
                </div>
             </div>

             {!isPremium && (
               <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-white/5 text-center max-w-xs">
                   <Lock className="mx-auto mb-4 text-amber-500" size={32} />
                   <h4 className="font-bold dark:text-white mb-2">Premium Layout Preview</h4>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Upgrade to Premium to see advanced section reordering and visibility in real-time.</p>
                   <Button size="sm" onClick={onUpgradeClick}>Unlock Preview</Button>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Premium Advanced Card */}
        <Card className={`${!isPremium ? 'border-amber-500/20' : ''}`}>
           <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black dark:text-white flex items-center gap-3">
              <Zap className="text-amber-500" size={24} />
              Premium Controls
            </h3>
          </div>

          <div className="space-y-10">
            {/* Section Toggles */}
            <div className={`space-y-4 ${!isPremium ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
              <label className="text-xs font-black dark:text-slate-400 uppercase tracking-widest">Toggle Sections</label>
              <div className="space-y-2">
                {Object.keys(invoiceSettings?.visibleSections || {}).map(section => (
                  <button
                    key={section}
                    onClick={() => toggleSection(section)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      invoiceSettings?.visibleSections?.[section] 
                        ? 'border-primary-500 bg-primary-500/5 text-primary-700 dark:text-primary-400' 
                        : 'border-slate-100 dark:border-white/5 text-slate-400'
                    }`}
                  >
                    <span className="text-sm font-bold uppercase tracking-wider">{section} Section</span>
                    {invoiceSettings?.visibleSections?.[section] ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                ))}
              </div>
            </div>

            <div className={`space-y-4 ${!isPremium ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
              <label className="text-xs font-black dark:text-slate-400 uppercase tracking-widest">Reorder Structure</label>
              <div className="space-y-2">
                {(invoiceSettings?.sectionsOrder || []).map((section, idx) => (
                  <div key={section} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/2 border border-slate-200 dark:border-white/5 group/item">
                    <span className="text-xs font-black text-slate-400">0{idx + 1}</span>
                    <span className="text-sm font-bold flex-1 dark:text-white uppercase tracking-wider">{sectionLabels[section]}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <button 
                        onClick={() => moveSection(idx, -1)} 
                        disabled={idx === 0}
                        className="p-1 hover:bg-primary-500/10 rounded text-primary-500 disabled:opacity-30"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button 
                        onClick={() => moveSection(idx, 1)} 
                        disabled={idx === (invoiceSettings?.sectionsOrder?.length || 0) - 1}
                        className="p-1 hover:bg-primary-500/10 rounded text-primary-500 disabled:opacity-30"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                    <GripVertical size={18} className="text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900 text-white border-none shadow-2xl shadow-primary-500/20 overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 blur-3xl rounded-full" />
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-black leading-tight">Live <br />Configuration</h3>
            <div className="space-y-4">
               <Input 
                label="Custom Footer" 
                placeholder="e.g. Terms & Conditions..." 
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                value={invoiceSettings?.footerText || ''}
                onChange={(e) => updateInvoiceSettings({ footerText: e.target.value })}
                disabled={!isPremium}
                onClick={() => !isPremium && onUpgradeClick()}
              />
              <Input 
                label="Terms" 
                placeholder="Payment due in 30 days..." 
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                value={invoiceSettings?.terms || ''}
                onChange={(e) => updateInvoiceSettings({ terms: e.target.value })}
                disabled={!isPremium}
                onClick={() => !isPremium && onUpgradeClick()}
              />
            </div>
            
            <div className="pt-4 space-y-3">
              <Button 
                variant="primary" 
                className="w-full h-14 rounded-2xl group-hover:scale-[1.02] transition-transform"
                onClick={handleSaveTemplate}
              >
                <Save size={20} />
                {isPremium ? 'Save Configuration' : 'Upgrade to Save'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
