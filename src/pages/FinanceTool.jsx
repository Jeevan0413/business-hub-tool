import React, { useState, useEffect } from 'react';
import { 
  Download, 
  ReceiptText, 
  Plus, 
  Trash2, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText,
  CreditCard,
  PieChart as PieChartIcon,
  CheckCircle2,
  Clock,
  Send,
  History,
  Settings,
  Lock,
  Sparkles
} from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import InvoiceCustomization from '../components/InvoiceCustomization';
import UpgradeModal from '../components/UpgradeModal';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { useNotification } from '../context/NotificationContext';
import { jsPDF } from 'jspdf';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';

const COLORS = ['#0ea5e9', '#f43f5e', '#10b981', '#f59e0b'];

export default function FinanceTool() {
  const { isDarkMode } = useTheme();
  const { invoices, addInvoice, expenses, addExpense, stats, userPlan, invoiceSettings } = useData();
  const { showToast } = useNotification();
  
  const [activeTab, setActiveTab] = useState('invoice');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    clientName: '',
    gstNumber: '',
    invoiceNumber: `INV-${1000 + invoices.length + 1}`,
    date: new Date().toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, price: 0 }],
    paymentMethod: 'Bank Transfer'
  });

  const [newExpense, setNewExpense] = useState({ category: 'Software', amount: 0, date: new Date().toISOString().split('T')[0] });

  // Update invoice number when list changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      invoiceNumber: `INV-${1000 + invoices.length + 1}`
    }));
  }, [invoices]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) return;
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateSubtotal = () => formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const calculateGST = () => calculateSubtotal() * 0.18;
  const calculateTotal = () => calculateSubtotal() + calculateGST();

  const handleSaveAndDownload = () => {
    // Usage restriction for Free users
    if (userPlan === 'Free' && invoices.length >= 3) {
      setIsUpgradeModalOpen(true);
      showToast('Free plan limit reached (3 invoices). Upgrade to continue!', 'warning');
      return;
    }

    const subtotal = calculateSubtotal();
    if (subtotal <= 0) {
      showToast('Please add items to your invoice', 'warning');
      return;
    }

    const total = calculateTotal();
    const invoiceRecord = {
      ...formData,
      subtotal,
      gst: calculateGST(),
      total,
      status: 'Pending'
    };

    addInvoice(invoiceRecord);
    
    // Generate PDF
    const doc = new jsPDF();
    const themeColor = invoiceSettings.themeColor || '#0ea5e9';
    const isPro = userPlan === 'Pro' || userPlan === 'Premium';
    const template = invoiceSettings.templateId || 'default';
    const visible = invoiceSettings.visibleSections || { gst: true, notes: true, terms: true, footer: true };

    // Helper to set color from hex
    const setColor = (hex, type = 'fill') => {
      if (!hex) return;
      try {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        if (type === 'fill') doc.setFillColor(r, g, b);
        else if (type === 'text') doc.setTextColor(r, g, b);
        else if (type === 'draw') doc.setDrawColor(r, g, b);
      } catch (e) {
        if (type === 'fill') doc.setFillColor(14, 165, 233);
        else if (type === 'text') doc.setTextColor(0, 0, 0);
      }
    };

    const renderHeader = (y) => {
      if (template === 'modern') {
        setColor(themeColor, 'fill');
        doc.rect(0, 0, 80, 297, 'F');
        doc.setTextColor(255, 255, 255);
        if (isPro && invoiceSettings.logo) {
          try { doc.addImage(invoiceSettings.logo, 'JPEG', 15, 20, 50, 50); } catch (e) {}
        }
        doc.setFontSize(24);
        doc.text('INVOICE', 40, 90, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`#${formData.invoiceNumber}`, 40, 100, { align: 'center' });
        doc.text(formData.date, 40, 105, { align: 'center' });
        return { startX: 90, nextY: 20 };
      }

      if (template === 'minimal') {
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text('TAX INVOICE', 190, 20, { align: 'right' });
        if (isPro && invoiceSettings.logo) {
          try { doc.addImage(invoiceSettings.logo, 'JPEG', 20, 15, 20, 20); } catch (e) {}
        }
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(formData.businessName || 'Business Name', 20, 45);
        return { startX: 20, nextY: 60 };
      }

      if (template === 'classic') {
        setColor(themeColor, 'draw');
        doc.setLineWidth(2);
        doc.line(20, 15, 190, 15);
        doc.setFontSize(30);
        setColor(themeColor, 'text');
        doc.text('INVOICE', 105, 35, { align: 'center' });
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(formData.invoiceNumber, 105, 45, { align: 'center' });
        return { startX: 20, nextY: 65 };
      }

      // Default
      setColor(themeColor, 'fill');
      doc.rect(0, 0, 210, 40, 'F');
      if (isPro && invoiceSettings.logo) {
        try { doc.addImage(invoiceSettings.logo, 'JPEG', 20, 10, 25, 25); } catch (e) {}
      }
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text('TAX INVOICE', 190, 25, { align: 'right' });
      return { startX: 20, nextY: 55 };
    };

    const renderInfo = (x, y) => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('FROM:', x, y);
      doc.setFont('helvetica', 'normal');
      doc.text(formData.businessName || 'Your Business', x, y + 7);
      if (formData.gstNumber) doc.text(`GST: ${formData.gstNumber}`, x, y + 14);

      doc.setFont('helvetica', 'bold');
      doc.text('BILL TO:', x, y + 30);
      doc.setFont('helvetica', 'normal');
      doc.text(formData.clientName || 'Valued Client', x, y + 37);
      
      if (template !== 'modern') {
        doc.text(`Invoice #: ${formData.invoiceNumber}`, 150, y + 7);
        doc.text(`Date: ${formData.date}`, 150, y + 14);
      }
      return y + 60;
    };

    const renderItems = (x, y) => {
      doc.setFillColor(template === 'minimal' ? 250 : 240, template === 'minimal' ? 250 : 240, template === 'minimal' ? 250 : 240);
      doc.rect(x, y, 190 - x + 20, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(template === 'minimal' ? 100 : 0, template === 'minimal' ? 100 : 0, template === 'minimal' ? 100 : 0);
      doc.text('Description', x + 5, y + 7);
      doc.text('Qty', 140, y + 7);
      doc.text('Total', 180, y + 7, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      let itemY = y + 20;
      formData.items.forEach(item => {
        doc.text(item.description, x + 5, itemY);
        doc.text(item.quantity.toString(), 140, itemY);
        doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 180, itemY, { align: 'right' });
        doc.setDrawColor(240, 240, 240);
        doc.line(x, itemY + 3, 190, itemY + 3);
        itemY += 12;
      });
      return itemY + 10;
    };

    const renderSummary = (x, y) => {
      const rightX = 180;
      doc.setFont('helvetica', 'bold');
      doc.text('Subtotal:', 140, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`$${subtotal.toFixed(2)}`, rightX, y, { align: 'right' });

      if (visible.gst) {
        doc.text('GST (18%):', 140, y + 8);
        doc.text(`$${calculateGST().toFixed(2)}`, rightX, y + 8, { align: 'right' });
        y += 8;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      setColor(themeColor, 'text');
      doc.text('Total:', 140, y + 15);
      doc.text(`$${total.toFixed(2)}`, rightX, y + 15, { align: 'right' });
      return y + 30;
    };

    const renderFooter = (x, y) => {
      if (!isPro) {
        doc.setFontSize(40);
        doc.setTextColor(240, 240, 240);
        doc.text('BUSINESS HUB FREE', 105, 150, { align: 'center', angle: 45 });
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text('Generated by Business Hub (Free Plan)', 105, 285, { align: 'center' });
      }

      if (userPlan === 'Premium') {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        if (invoiceSettings.notes && visible.notes) {
          doc.setFont('helvetica', 'bold');
          doc.text('Notes:', x, y);
          doc.setFont('helvetica', 'normal');
          doc.text(invoiceSettings.notes, x, y + 5);
          y += 15;
        }
        if (invoiceSettings.terms && visible.terms) {
          doc.setFont('helvetica', 'bold');
          doc.text('Terms:', x, y);
          doc.setFont('helvetica', 'normal');
          doc.text(invoiceSettings.terms, x, y + 5);
          y += 15;
        }
        if (invoiceSettings.footerText && visible.footer) {
          doc.setFont('helvetica', 'italic');
          doc.text(invoiceSettings.footerText, 105, 285, { align: 'center' });
        }
      }
      return y;
    };

    // Calculate layout dynamically based on sections order
    const sections = userPlan === 'Premium' ? (invoiceSettings.sectionsOrder || []) : ['header', 'info', 'items', 'summary', 'footer'];
    
    let startX = 20;
    let currentY = 20;
    
    try {
      sections.forEach(section => {
        if (section === 'header') {
          const headerResult = renderHeader(currentY);
          startX = headerResult.startX;
          currentY = headerResult.nextY;
        }
        if (section === 'info') currentY = renderInfo(startX, currentY);
        if (section === 'items') currentY = renderItems(startX, currentY);
        if (section === 'summary') currentY = renderSummary(startX, currentY);
        if (section === 'footer') currentY = renderFooter(startX, currentY);
      });

      doc.save(`invoice_${formData.invoiceNumber}.pdf`);
      showToast('Invoice generated perfectly!', 'success');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      showToast('Error generating PDF. Please check your settings.', 'error');
    }
    
    setFormData({ ...formData, clientName: '', items: [{ description: '', quantity: 1, price: 0 }] });
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (newExpense.amount <= 0) return;
    addExpense(newExpense);
    setNewExpense({ category: 'Software', amount: 0, date: new Date().toISOString().split('T')[0] });
    showToast('Expense recorded', 'success');
  };

  const expenseData = [
    { name: 'Software', value: expenses.filter(e => e.category === 'Software').reduce((s, e) => s + parseFloat(e.amount), 0) },
    { name: 'Marketing', value: expenses.filter(e => e.category === 'Marketing').reduce((s, e) => s + parseFloat(e.amount), 0) },
    { name: 'Office', value: expenses.filter(e => e.category === 'Office').reduce((s, e) => s + parseFloat(e.amount), 0) },
    { name: 'Other', value: expenses.filter(e => !['Software', 'Marketing', 'Office'].includes(e.category)).reduce((s, e) => s + parseFloat(e.amount), 0) },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <DollarSign className="text-emerald-500" size={32} />
            Finance Hub
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Manage invoices, expenses, and track your business health.</p>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl w-full overflow-x-auto hide-scrollbar md:w-fit">
        {[
          { id: 'invoice', label: 'Create Invoice', icon: FileText },
          { id: 'customize', label: 'Customize', icon: Sparkles },
          { id: 'history', label: 'History', icon: History },
          { id: 'expenses', label: 'Expenses', icon: CreditCard },
          { id: 'summary', label: 'Analytics', icon: PieChartIcon },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-primary-600 text-primary-600 dark:text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'invoice' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 space-y-6">
            {userPlan === 'Free' && invoices.length >= 3 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500 rounded-xl text-white"><Lock size={20} /></div>
                  <div>
                    <h4 className="font-bold dark:text-white">Free Plan Limit Reached</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">You've generated 3/3 invoices. Upgrade to Pro for unlimited invoices.</p>
                  </div>
                </div>
                <Button onClick={() => setIsUpgradeModalOpen(true)} size="sm">Upgrade Now</Button>
              </div>
            )}
            <Card>
              <h3 className="text-lg font-bold mb-6 dark:text-white">Business Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Your Business Name" name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="e.g. Acme Solutions" />
                <Input label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder="22AAAAA0000A1Z5" />
                <Input label="Client Name" name="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="e.g. John Doe" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Invoice #" value={formData.invoiceNumber} readOnly className="bg-slate-50 dark:bg-white/5" />
                  <Input label="Date" type="date" name="date" value={formData.date} onChange={handleInputChange} />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold dark:text-white">Line Items</h3>
                <Button variant="secondary" onClick={addItem} className="px-3 py-1.5 text-sm"><Plus size={16} /> Add Item</Button>
              </div>
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 group">
                    <div className="flex-1 w-full"><Input label="Description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} placeholder="Service or Product" /></div>
                    <div className="w-full md:w-24"><Input label="Qty" type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)} /></div>
                    <div className="w-full md:w-32"><Input label="Price ($)" type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)} /></div>
                    <button onClick={() => removeItem(index)} className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={20} /></button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-28 border-2 border-primary-500/20">
              <h3 className="text-lg font-bold mb-6 dark:text-white">Total Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Subtotal</span><span className="font-medium">${calculateSubtotal().toFixed(2)}</span></div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>GST (18%)</span><span className="font-medium">${calculateGST().toFixed(2)}</span></div>
                <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-between text-2xl font-bold dark:text-white">
                  <span>Total</span><span className="text-emerald-500">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <Button onClick={handleSaveAndDownload} className="w-full h-12 shadow-lg shadow-primary-500/20"><Download size={20} /> Generate & Save</Button>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'customize' && (
        <InvoiceCustomization onUpgradeClick={() => setIsUpgradeModalOpen(true)} />
      )}

      {activeTab === 'history' && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-bold mb-6 dark:text-white">Invoice History</h3>
          <div className="table-container">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {invoices.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No invoices generated yet.</td></tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="px-6 py-4 font-mono font-bold dark:text-white">{inv.invoiceNumber}</td>
                      <td className="px-6 py-4 dark:text-slate-300">{inv.clientName}</td>
                      <td className="px-6 py-4 font-bold text-emerald-500">${inv.total?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-600 dark:bg-amber-900/30 flex items-center gap-1 w-fit">
                          <Clock size={12} /> {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right"><button className="p-2 text-slate-400 hover:text-primary-600"><Download size={18} /></button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-6 dark:text-white">Recent Expenses</h3>
            <div className="table-container">
              <table className="w-full text-left">
                <thead><tr className="text-slate-500 text-sm border-b border-slate-200 dark:border-white/5"><th className="pb-4">Category</th><th className="pb-4">Amount</th><th className="pb-4">Date</th></tr></thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {expenses.map(exp => (
                    <tr key={exp.id}><td className="py-4 dark:text-white font-medium">{exp.category}</td><td className="py-4 text-red-500 font-bold">-${exp.amount}</td><td className="py-4 text-slate-500">{exp.date}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-bold mb-6 dark:text-white">Add Expense</h3>
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div className="space-y-1.5"><label className="text-sm font-medium dark:text-slate-400">Category</label>
                <select className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl dark:text-white px-4 py-2 outline-none" value={newExpense.category} onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}><option>Software</option><option>Marketing</option><option>Office</option><option>Other</option></select>
              </div>
              <Input label="Amount ($)" type="number" value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})} />
              <Button type="submit" className="w-full">Record Expense</Button>
            </form>
          </Card>
        </div>
      )}

          {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="md:col-span-1">
            <h3 className="text-lg font-bold mb-8 dark:text-white">Financial Summary</h3>
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20"><div className="flex items-center gap-2 text-emerald-600 mb-1"><TrendingUp size={18} /><span className="text-sm font-bold tracking-wider">REVENUE</span></div><div className="text-3xl font-black text-emerald-600">${stats.monthlyRevenue.toLocaleString()}</div></div>
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20"><div className="flex items-center gap-2 text-red-500 mb-1"><TrendingDown size={18} /><span className="text-sm font-bold tracking-wider">EXPENSES</span></div><div className="text-3xl font-black text-red-500">${stats.totalExpenses.toLocaleString()}</div></div>
              <div className="p-6 rounded-2xl bg-primary-600 text-white shadow-xl shadow-primary-500/20"><div className="text-sm font-bold tracking-wider opacity-80 mb-1">NET PROFIT</div><div className="text-4xl font-black">${(stats.monthlyRevenue - stats.totalExpenses).toLocaleString()}</div></div>
            </div>
          </Card>
          <Card className="md:col-span-2">
            <h3 className="text-lg font-bold mb-8 dark:text-white">Spending Analytics</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{expenseData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">{expenseData.map((data, i) => <div key={i} className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} /><span className="text-sm dark:text-slate-400">{data.name}</span></div>)}</div>
          </Card>
        </div>
      )}

      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
    </div>
  );
}
