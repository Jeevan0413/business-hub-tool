import React, { useState } from 'react';
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
  PieChart as PieChartIcon
} from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';

import { jsPDF } from 'jspdf';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const COLORS = ['#0ea5e9', '#f43f5e', '#10b981', '#f59e0b'];

export default function FinanceTool() {
  const { isDarkMode } = useTheme();
  
  const chartColors = {
    grid: isDarkMode ? '#1e293b' : '#e2e8f0',
    text: isDarkMode ? '#94a3b8' : '#64748b',
    tooltipBg: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.8)',
    tooltipBorder: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
  };

  const [activeTab, setActiveTab] = useState('invoice');

  const [formData, setFormData] = useState({
    businessName: '',
    clientName: '',
    gstNumber: '',
    invoiceNumber: 'INV-' + Math.floor(Math.random() * 10000),
    date: new Date().toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, price: 0 }],
    paymentMethod: 'Bank Transfer'
  });

  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Software', amount: 450, date: '2025-04-10' },
    { id: 2, category: 'Marketing', amount: 1200, date: '2025-04-15' },
    { id: 3, category: 'Office', amount: 300, date: '2025-04-20' },
  ]);

  const [newExpense, setNewExpense] = useState({ category: 'Software', amount: 0, date: new Date().toISOString().split('T')[0] });

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

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateGST = () => {
    return calculateSubtotal() * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const subtotal = calculateSubtotal();
    const gst = calculateGST();
    const total = calculateTotal();

    doc.setFontSize(22);
    doc.setTextColor(14, 165, 233);
    doc.text('TAX INVOICE', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`From: ${formData.businessName}`, 20, 40);
    doc.text(`GSTIN: ${formData.gstNumber || 'N/A'}`, 20, 47);
    doc.text(`To: ${formData.clientName}`, 20, 57);
    doc.text(`Invoice #: ${formData.invoiceNumber}`, 150, 40);
    doc.text(`Date: ${formData.date}`, 150, 47);

    doc.line(20, 65, 190, 65);
    
    doc.setFont(undefined, 'bold');
    doc.text('Description', 20, 75);
    doc.text('Qty', 120, 75);
    doc.text('Price', 150, 75);
    doc.text('Total', 180, 75);

    doc.setFont(undefined, 'normal');
    let y = 85;
    formData.items.forEach(item => {
      doc.text(item.description, 20, y);
      doc.text(item.quantity.toString(), 120, y);
      doc.text(`$${item.price}`, 150, y);
      doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 180, y);
      y += 10;
    });

    doc.line(20, y, 190, y);
    y += 10;
    doc.text(`Subtotal:`, 150, y);
    doc.text(`$${subtotal.toFixed(2)}`, 180, y);
    y += 7;
    doc.text(`GST (18%):`, 150, y);
    doc.text(`$${gst.toFixed(2)}`, 180, y);
    y += 10;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`Grand Total:`, 150, y);
    doc.text(`$${total.toFixed(2)}`, 180, y);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Payment Method: ${formData.paymentMethod}`, 20, y + 20);
    doc.text(`This is a computer generated invoice.`, 105, y + 40, { align: 'center' });

    doc.save(`invoice_${formData.invoiceNumber}.pdf`);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
    setNewExpense({ category: 'Software', amount: 0, date: new Date().toISOString().split('T')[0] });
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const totalRevenue = 15000; // Mock revenue for P&L

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
            Finance & Invoicing
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Manage invoices, expenses, and track your business health.</p>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit">
        {[
          { id: 'invoice', label: 'Invoicing', icon: FileText },
          { id: 'expenses', label: 'Expenses', icon: CreditCard },
          { id: 'summary', label: 'P&L Summary', icon: PieChartIcon },
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-lg font-bold mb-6 dark:text-white">Business Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Your Business Name" 
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="e.g. Acme Solutions"
                />
                <Input 
                  label="GST Number (India)" 
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  placeholder="22AAAAA0000A1Z5"
                />
                <Input 
                  label="Client Name" 
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Invoice #" 
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleInputChange}
                  />
                  <Input 
                    label="Date" 
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold dark:text-white">Line Items</h3>
                <Button variant="secondary" onClick={addItem} className="px-3 py-1.5 text-sm">
                  <Plus size={16} /> Add Item
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 dark:bg-white/5 p-4 rounded-2xl group border border-slate-200 dark:border-white/10">
                    <div className="flex-1 w-full">
                      <Input 
                        label="Description"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Service or Product"
                      />
                    </div>
                    <div className="w-full md:w-24">
                      <Input 
                        label="Qty"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="w-full md:w-32">
                      <Input 
                        label="Price ($)"
                        type="number"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <button 
                      onClick={() => removeItem(index)}
                      className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-8 border-2 border-primary-500/20">
              <h3 className="text-lg font-bold mb-6 dark:text-white">Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>GST (18%)</span>
                  <span className="font-medium">${calculateGST().toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-between text-2xl font-bold dark:text-white">
                  <span>Total</span>
                  <span className="text-emerald-500">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <Input 
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="mb-6"
              />

              <Button onClick={downloadPDF} className="w-full h-12 shadow-lg shadow-primary-500/20">
                <Download size={20} /> Generate PDF
              </Button>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-6 dark:text-white">Recent Expenses</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-white/5">
                    <th className="pb-4 px-2">Category</th>
                    <th className="pb-4 px-2">Amount</th>
                    <th className="pb-4 px-2">Date</th>
                    <th className="pb-4 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {expenses.map(exp => (
                    <tr key={exp.id}>
                      <td className="py-4 px-2 dark:text-white font-medium">{exp.category}</td>
                      <td className="py-4 px-2 text-red-500 font-bold">-${exp.amount}</td>
                      <td className="py-4 px-2 text-slate-500">{exp.date}</td>
                      <td className="py-4 px-2 text-right">
                        <button className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold mb-6 dark:text-white">Add Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium dark:text-slate-400">Category</label>
                <select 
                  className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl dark:text-white px-4 py-2 outline-none"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                >
                  <option>Software</option>
                  <option>Marketing</option>
                  <option>Office</option>
                  <option>Travel</option>
                  <option>Other</option>
                </select>
              </div>
              <Input 
                label="Amount ($)" 
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              />
              <Input 
                label="Date" 
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
              />
              <Button type="submit" className="w-full">
                Add Expense
              </Button>
            </form>
          </Card>
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1">
            <h3 className="text-lg font-bold mb-8 dark:text-white">Profit & Loss</h3>
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <TrendingUp size={18} />
                  <span className="text-sm font-bold uppercase tracking-wider">Revenue</span>
                </div>
                <div className="text-3xl font-black text-emerald-600">${totalRevenue.toLocaleString()}</div>
              </div>
              
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 text-red-500 mb-1">
                  <TrendingDown size={18} />
                  <span className="text-sm font-bold uppercase tracking-wider">Expenses</span>
                </div>
                <div className="text-3xl font-black text-red-500">${totalExpenses.toLocaleString()}</div>
              </div>

              <div className="p-6 rounded-2xl bg-primary-600 text-white shadow-xl shadow-primary-500/20">
                <div className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">Net Profit</div>
                <div className="text-4xl font-black">${(totalRevenue - totalExpenses).toLocaleString()}</div>
              </div>
            </div>
          </Card>

          <Card className="md:col-span-2">
            <h3 className="text-lg font-bold mb-8 dark:text-white">Expense Breakdown</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: chartColors.tooltipBg, 
                      borderRadius: '12px', 
                      border: `1px solid ${chartColors.tooltipBorder}`, 
                      backdropFilter: 'blur(8px)',
                      color: isDarkMode ? '#f1f5f9' : '#1e293b'
                    }}
                    itemStyle={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}
                  />
                </PieChart>

              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {expenseData.map((data, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm dark:text-slate-400">{data.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
