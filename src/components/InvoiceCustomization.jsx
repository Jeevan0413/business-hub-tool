import React, { useRef, useState } from 'react';
import { 
  Upload, Palette, Lock, Trash2, Layout as LayoutIcon, 
  Zap, Eye, GripVertical, Save, Check, ChevronUp, ChevronDown, 
  Shield, Type, Grid, CircleDashed, List, Receipt, Building, Briefcase
} from 'lucide-react';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import TemplateSelector from './TemplateSelector';
import { useData } from '../context/DataContext';

export default function InvoiceCustomization({ onUpgradeClick }) {
  const { userPlan, invoiceSettings, updateInvoiceSettings } = useData();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('branding');

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

  const mockInvoiceData = {
    number: 'INV-2026-001',
    date: 'May 04, 2026',
    dueDate: 'May 18, 2026',
    company: 'Acme Corporation Inc.',
    companyAddress: '123 Innovation Drive\nTech City, TC 90210',
    client: 'Stark Industries',
    clientAddress: '10880 Malibu Point\nMalibu, CA 90265',
    items: [
      { id: 1, desc: 'Enterprise SaaS License (Annual)', qty: 1, rate: 12000, amount: 12000 },
      { id: 2, desc: 'Custom Implementation Setup', qty: 1, rate: 3500, amount: 3500 },
      { id: 3, desc: 'Premium Support SLA', qty: 12, rate: 500, amount: 6000 },
    ],
    subtotal: 21500,
    taxRate: 10,
    taxAmount: 2150,
    total: 23650
  };

  const tabs = [
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'layout', label: 'Layout', icon: LayoutIcon },
    { id: 'sections', label: 'Sections', icon: List },
    { id: 'styling', label: 'Styling', icon: Zap },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* LEFT PANE: Customization Controls */}
      <div className="w-full lg:w-[400px] xl:w-[480px] shrink-0 flex flex-col gap-6">
        
        {/* Tab Navigation */}
        <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl overflow-x-auto hide-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-white/10 shadow-xl overflow-y-auto max-h-[calc(100vh-12rem)]">
          <div className="p-6 md:p-8 space-y-8">

            {/* BRANDING TAB */}
            {activeTab === 'branding' && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black dark:text-white flex items-center gap-3">
                    <Palette className="text-primary-500" size={24} /> Branding
                  </h3>
                  {!isPro && (
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-amber-500/20">
                      <Lock size={10} /> Pro
                    </span>
                  )}
                </div>

                {/* Logo Upload */}
                <div className={`space-y-4 ${!isPro ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                  <label className="text-xs font-black dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Building size={14} /> Company Logo
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
                      <span className="text-sm font-bold uppercase tracking-wider">Upload Logo</span>
                    </button>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                </div>

                {/* Theme Colors */}
                <div className={`space-y-4 ${!isPro ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                  <label className="text-xs font-black dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Palette size={14} /> Brand Color
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateInvoiceSettings({ themeColor: color })}
                        className={`aspect-square rounded-xl border-2 transition-all relative ${
                          invoiceSettings?.themeColor === color 
                            ? 'border-white dark:border-slate-700 ring-4 ring-primary-500/30 scale-110 z-10' 
                            : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {invoiceSettings?.themeColor === color && <div className="absolute inset-0 flex items-center justify-center"><Check size={16} className="text-white" strokeWidth={4} /></div>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LAYOUT TAB */}
            {activeTab === 'layout' && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black dark:text-white flex items-center gap-3">
                    <LayoutIcon className="text-primary-500" size={24} /> Visual Layout
                  </h3>
                </div>
                <TemplateSelector 
                  selectedId={invoiceSettings?.templateId || 'default'} 
                  onSelect={(id) => updateInvoiceSettings({ templateId: id })}
                  onUpgradeClick={onUpgradeClick}
                />
              </div>
            )}

            {/* SECTIONS TAB */}
            {activeTab === 'sections' && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black dark:text-white flex items-center gap-3">
                    <List className="text-primary-500" size={24} /> Sections
                  </h3>
                  {!isPremium && (
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-amber-500/20">
                      <Lock size={10} /> Premium
                    </span>
                  )}
                </div>

                <div className={`space-y-6 ${!isPremium ? 'opacity-60 grayscale' : ''}`}>
                  {/* Visibility Toggles */}
                  <div className="space-y-3">
                    <label className="text-xs font-black dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Eye size={14} /> Visibility Toggles
                    </label>
                    <div className="space-y-2">
                      {Object.keys(invoiceSettings?.visibleSections || {}).map(section => (
                        <button
                          key={section}
                          onClick={() => toggleSection(section)}
                          className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                            invoiceSettings?.visibleSections?.[section] 
                              ? 'border-primary-500/50 bg-primary-500/5 text-primary-600 dark:text-primary-400' 
                              : `border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500`
                          }`}
                        >
                          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                            {section} Section
                          </span>
                          <div className={`w-10 h-5 rounded-full p-1 transition-colors ${invoiceSettings?.visibleSections?.[section] ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                            <div className={`w-3 h-3 bg-white rounded-full transition-transform ${invoiceSettings?.visibleSections?.[section] ? 'translate-x-5' : 'translate-x-0'}`} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reorder Structure */}
                  <div className="space-y-3">
                    <label className="text-xs font-black dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <GripVertical size={14} /> Reorder Layout
                    </label>
                    <div className="space-y-2">
                      {(invoiceSettings?.sectionsOrder || []).map((section, idx) => (
                        <div key={section} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2 transition-all group/item hover:border-primary-500/30">
                          <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black bg-white dark:bg-white/10 text-slate-500 dark:text-slate-400 shadow-sm">
                            {idx + 1}
                          </div>
                          <span className="text-xs font-bold flex-1 uppercase tracking-wider dark:text-slate-300">
                            {sectionLabels[section]}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <button 
                              onClick={() => moveSection(idx, -1)} 
                              disabled={idx === 0}
                              className="p-1 hover:bg-primary-500/10 rounded text-primary-500 disabled:opacity-20"
                            >
                              <ChevronUp size={14} />
                            </button>
                            <button 
                              onClick={() => moveSection(idx, 1)} 
                              disabled={idx === (invoiceSettings?.sectionsOrder?.length || 0) - 1}
                              className="p-1 hover:bg-primary-500/10 rounded text-primary-500 disabled:opacity-20"
                            >
                              <ChevronDown size={14} />
                            </button>
                          </div>
                          <GripVertical size={16} className="text-slate-400 cursor-grab active:cursor-grabbing" onClick={() => !isPremium && onUpgradeClick()} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STYLING TAB */}
            {activeTab === 'styling' && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black dark:text-white flex items-center gap-3">
                    <Zap className="text-primary-500" size={24} /> Advanced Styling
                  </h3>
                  {!isPremium && (
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-amber-500/20">
                      <Lock size={10} /> Premium
                    </span>
                  )}
                </div>

                <div className={`space-y-8 ${!isPremium ? 'opacity-60 grayscale' : ''}`}>
                  {/* Typography */}
                  <div className="space-y-4">
                    <label className="text-xs font-black dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Type size={14} /> Typography
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'font-sans', name: 'Modern', class: 'font-sans' },
                        { id: 'font-serif', name: 'Classic', class: 'font-serif' },
                        { id: 'font-mono', name: 'Code', class: 'font-mono' }
                      ].map(font => (
                        <button
                          key={font.id}
                          onClick={() => isPremium ? updateInvoiceSettings({ fontFamily: font.id }) : onUpgradeClick()}
                          className={`py-4 px-2 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                            invoiceSettings?.fontFamily === font.id
                              ? 'border-primary-500 bg-primary-500/5 text-primary-600 dark:text-primary-400 shadow-md scale-105'
                              : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <span className={`text-3xl ${font.class}`}>Aa</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider">{font.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Patterns */}
                  <div className="space-y-4">
                    <label className="text-xs font-black dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Grid size={14} /> Background Pattern
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'none', name: 'Clean', icon: CircleDashed },
                        { id: 'dots', name: 'Dots', icon: Grid },
                        { id: 'grid', name: 'Grid', icon: LayoutIcon }
                      ].map(pattern => {
                        const Icon = pattern.icon;
                        return (
                          <button
                            key={pattern.id}
                            onClick={() => isPremium ? updateInvoiceSettings({ backgroundPattern: pattern.id }) : onUpgradeClick()}
                            className={`py-3 px-2 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                              invoiceSettings?.backgroundPattern === pattern.id
                                ? 'border-primary-500 bg-primary-500/5 text-primary-600 dark:text-primary-400 shadow-md scale-105'
                                : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            <Icon size={20} className="mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{pattern.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Custom Text */}
                  <div className="space-y-4">
                    <label className="text-xs font-black dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Receipt size={14} /> Custom Text
                    </label>
                    <Input 
                      label="Custom Footer" 
                      placeholder="e.g. Terms & Conditions..." 
                      value={invoiceSettings?.footerText || ''}
                      onChange={(e) => updateInvoiceSettings({ footerText: e.target.value })}
                      disabled={!isPremium}
                      onClick={() => !isPremium && onUpgradeClick()}
                    />
                    <Input 
                      label="Terms" 
                      placeholder="Payment due in 30 days..." 
                      value={invoiceSettings?.terms || ''}
                      onChange={(e) => updateInvoiceSettings({ terms: e.target.value })}
                      disabled={!isPremium}
                      onClick={() => !isPremium && onUpgradeClick()}
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Fixed Save Button */}
          <div className="sticky bottom-0 p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-100 dark:border-white/10">
            <Button 
              variant={isPremium ? 'primary' : 'outline'} 
              className="w-full h-14 rounded-2xl group-hover:scale-[1.02] transition-transform"
              onClick={handleSaveTemplate}
            >
              <Save size={20} />
              {isPremium ? 'Save Configuration' : 'Upgrade to Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Realistic Live Preview */}
      <div className="flex-1 rounded-[40px] border-8 border-slate-100 dark:border-white/5 bg-slate-100 dark:bg-slate-950 overflow-hidden relative shadow-2xl h-[calc(100vh-12rem)] min-h-[600px] flex flex-col">
        {/* Preview Toolbar */}
        <div className="shrink-0 h-14 bg-slate-200/50 dark:bg-white/5 flex items-center justify-center gap-4 border-b border-slate-200 dark:border-white/5 relative z-20">
          <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <Eye size={16} className="text-primary-500" /> Live Preview
          </span>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 relative">
          
          {/* Background Patterns */}
          {invoiceSettings?.backgroundPattern === 'dots' && (
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          )}
          {invoiceSettings?.backgroundPattern === 'grid' && (
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-5 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          )}

          {/* Actual Invoice Document */}
          <div className={`relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 w-full max-w-3xl mx-auto overflow-hidden transition-all duration-500 ${invoiceSettings?.fontFamily || 'font-sans'}`}>
            
            {/* Dynamic Rendering based on sectionsOrder */}
            {(invoiceSettings?.sectionsOrder || []).map((section) => {
              
              if (section === 'header') {
                return (
                  <div key={section} className="p-8 md:p-12 border-b border-slate-100 dark:border-white/5" style={{ backgroundColor: invoiceSettings?.themeColor + '08' }}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-4 max-w-[200px]">
                        {invoiceSettings?.logo ? (
                          <img src={invoiceSettings.logo} alt="Company Logo" className="max-h-16 w-auto object-contain" />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                            <Building size={24} className="text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <h1 className="text-4xl font-black mb-2" style={{ color: invoiceSettings?.themeColor }}>INVOICE</h1>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{mockInvoiceData.number}</p>
                      </div>
                    </div>
                  </div>
                );
              }

              if (section === 'info') {
                return (
                  <div key={section} className="p-8 md:p-12 grid grid-cols-2 gap-8 border-b border-slate-100 dark:border-white/5">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">From</h4>
                      <p className="font-bold dark:text-white mb-1">{mockInvoiceData.company}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-line">{mockInvoiceData.companyAddress}</p>
                    </div>
                    <div className="text-right">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Billed To</h4>
                      <p className="font-bold dark:text-white mb-1">{mockInvoiceData.client}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-line">{mockInvoiceData.clientAddress}</p>
                    </div>
                    <div className="col-span-2 flex gap-12 mt-4 pt-8 border-t border-slate-100 dark:border-white/5">
                      <div>
                        <span className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Issue Date</span>
                        <span className="font-bold dark:text-white">{mockInvoiceData.date}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Due Date</span>
                        <span className="font-bold dark:text-white">{mockInvoiceData.dueDate}</span>
                      </div>
                    </div>
                  </div>
                );
              }

              if (section === 'items') {
                return (
                  <div key={section} className="p-8 md:p-12">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b-2 border-slate-200 dark:border-white/10">
                          <th className="py-4 text-xs font-black uppercase tracking-widest text-slate-400">Description</th>
                          <th className="py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Qty</th>
                          <th className="py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Rate</th>
                          <th className="py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {mockInvoiceData.items.map(item => (
                          <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                            <td className="py-4 font-medium dark:text-white">{item.desc}</td>
                            <td className="py-4 text-center text-slate-500">{item.qty}</td>
                            <td className="py-4 text-right text-slate-500">${item.rate.toLocaleString()}</td>
                            <td className="py-4 text-right font-bold dark:text-white">${item.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              if (section === 'summary') {
                return (
                  <div key={section} className="p-8 md:p-12 bg-slate-50 dark:bg-white/2 border-y border-slate-200 dark:border-white/5 flex justify-end">
                    <div className="w-full max-w-sm space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-500">Subtotal</span>
                        <span className="font-bold dark:text-white">${mockInvoiceData.subtotal.toLocaleString()}</span>
                      </div>
                      {invoiceSettings?.visibleSections?.gst && (
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-slate-500">Tax ({mockInvoiceData.taxRate}%)</span>
                          <span className="font-bold dark:text-white">${mockInvoiceData.taxAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="pt-4 border-t-2 border-slate-200 dark:border-white/10 flex justify-between items-end">
                        <span className="font-black uppercase tracking-widest dark:text-white">Total Due</span>
                        <span className="text-3xl font-black" style={{ color: invoiceSettings?.themeColor }}>
                          ${invoiceSettings?.visibleSections?.gst ? mockInvoiceData.total.toLocaleString() : mockInvoiceData.subtotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              if (section === 'footer') {
                return (
                  <div key={section} className="p-8 md:p-12 space-y-6">
                    {invoiceSettings?.visibleSections?.notes && invoiceSettings?.notes && (
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Notes</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{invoiceSettings.notes}</p>
                      </div>
                    )}
                    {invoiceSettings?.visibleSections?.terms && invoiceSettings?.terms && (
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Terms & Conditions</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{invoiceSettings.terms}</p>
                      </div>
                    )}
                    {invoiceSettings?.visibleSections?.footer && invoiceSettings?.footerText && (
                      <div className="pt-8 text-center border-t border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{invoiceSettings.footerText}</p>
                      </div>
                    )}
                  </div>
                );
              }
              
              return null;
            })}
          </div>

        </div>

        {/* Lock Overlay for non-premium */}
        {!isPremium && activeTab !== 'layout' && activeTab !== 'branding' && (
          <div className="absolute inset-0 z-50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] shadow-2xl border border-slate-100 dark:border-white/5 text-center max-w-sm animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="text-amber-500" size={32} />
              </div>
              <h4 className="text-xl font-black dark:text-white mb-3">Premium Preview Locked</h4>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Upgrade to Premium to visualize advanced section reordering, custom typography, background patterns, and live text changes.
              </p>
              <Button size="lg" className="w-full" onClick={onUpgradeClick}>Unlock Full Experience</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
