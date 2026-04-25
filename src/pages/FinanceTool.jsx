import React, { useState } from 'react';
import { Download, ReceiptText, Plus, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { jsPDF } from 'jspdf';

export default function FinanceTool() {
  const [formData, setFormData] = useState({
    businessName: '',
    clientName: '',
    invoiceNumber: 'INV-' + Math.floor(Math.random() * 10000),
    date: new Date().toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, price: 0 }],
    paymentMethod: 'Bank Transfer'
  });

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

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const total = calculateTotal();

    doc.setFontSize(22);
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`From: ${formData.businessName}`, 20, 40);
    doc.text(`To: ${formData.clientName}`, 20, 50);
    doc.text(`Invoice #: ${formData.invoiceNumber}`, 150, 40);
    doc.text(`Date: ${formData.date}`, 150, 50);

    doc.line(20, 60, 190, 60);
    
    doc.text('Description', 20, 70);
    doc.text('Qty', 120, 70);
    doc.text('Price', 150, 70);
    doc.text('Total', 180, 70);

    let y = 80;
    formData.items.forEach(item => {
      doc.text(item.description, 20, y);
      doc.text(item.quantity.toString(), 120, y);
      doc.text(`$${item.price}`, 150, y);
      doc.text(`$${item.quantity * item.price}`, 180, y);
      y += 10;
    });

    doc.line(20, y, 190, y);
    doc.setFontSize(14);
    doc.text(`Grand Total: $${total}`, 180, y + 10, { align: 'right' });
    
    doc.setFontSize(10);
    doc.text(`Payment Method: ${formData.paymentMethod}`, 20, y + 30);

    doc.save(`invoice_${formData.invoiceNumber}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <ReceiptText className="text-emerald-500" size={32} />
            Invoice Generator
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Create professional invoices in seconds.</p>
        </div>
        <Button onClick={downloadPDF} className="hidden md:flex">
          <Download size={20} /> Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold mb-6 dark:text-white">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Your Business Name" 
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="e.g. Acme Corp"
              />
              <Input 
                label="Client Name" 
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder="e.g. John Doe"
              />
              <Input 
                label="Invoice Number" 
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
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold dark:text-white">Items</h3>
              <Button variant="secondary" onClick={addItem} className="px-3 py-1.5 text-sm">
                <Plus size={16} /> Add Item
              </Button>
            </div>
            
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 dark:bg-white/5 p-4 rounded-xl relative group">
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
          <Card className="sticky top-8">
            <h3 className="text-lg font-semibold mb-6 dark:text-white">Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-between text-xl font-bold dark:text-white">
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

            <Button onClick={downloadPDF} className="w-full">
              <Download size={20} /> Generate & Download
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
