import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Users, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Search,
  Layout,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const initialTemplates = [
  { id: 1, name: 'Welcome Email', subject: 'Welcome to [Company Name]!', body: 'Hi [Name], we are excited to have you join our team as [Role]...' },
  { id: 2, name: 'Offer Letter', subject: 'Job Offer: [Role] at [Company Name]', body: 'Dear [Name], We are pleased to offer you...' },
  { id: 3, name: 'Meeting Invite', subject: 'Interview Invitation', body: 'Hi [Name], We would like to invite you for...' },
];

export default function Communication() {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplates[0]);
  const [recipient, setRecipient] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(128);

  const handleSend = (e) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentCount(prev => prev + 1);
      alert('Email sent successfully!');
    }, 1500);
  };

  const generateAIContent = () => {
    // Mock AI generation
    setSelectedTemplate({
      ...selectedTemplate,
      body: `Hi [Name],\n\nI hope this email finds you well. I'm reaching out from [Company Name] regarding our recent discussion about the [Role] position. We were very impressed with your background and would love to move forward...\n\nBest,\n[Your Name]`
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <Mail className="text-orange-500" size={32} />
            Communication Hub
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Manage email templates and reach out to your team or candidates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600">
            <Send size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Sent Today</p>
            <h3 className="text-2xl font-bold dark:text-white">{sentCount}</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Recipients</p>
            <h3 className="text-2xl font-bold dark:text-white">1,240</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Deliverability</p>
            <h3 className="text-2xl font-bold dark:text-white">99.2%</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Scheduled</p>
            <h3 className="text-2xl font-bold dark:text-white">12</h3>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold dark:text-white">Templates</h3>
              <button className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1">
                <Plus size={16} /> New
              </button>
            </div>
            <div className="space-y-2">
              {initialTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full text-left p-4 rounded-2xl transition-all ${
                    selectedTemplate.id === template.id 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                      : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold flex items-center gap-2">
                    <Layout size={16} /> {template.name}
                  </div>
                  <p className={`text-xs mt-1 truncate ${selectedTemplate.id === template.id ? 'text-primary-100' : 'text-slate-500'}`}>
                    {template.subject}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white border-none p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-purple-200" />
              <h3 className="text-lg font-bold">AI Assistant</h3>
            </div>
            <p className="text-purple-100 text-sm mb-6 leading-relaxed">
              Need help writing professional emails? Our AI can draft templates based on your business needs.
            </p>
            <Button onClick={generateAIContent} className="w-full bg-white/20 hover:bg-white/30 border-white/20 backdrop-blur-md">
              Draft with AI
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <h3 className="text-lg font-bold mb-6 dark:text-white flex items-center gap-2">
              <MessageSquare size={20} className="text-primary-600" />
              Compose Email
            </h3>
            <form onSubmit={handleSend} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Recipient Name" 
                  placeholder="e.g. John Doe" 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                />
                <Input 
                  label="Recipient Email" 
                  type="email" 
                  placeholder="john@example.com" 
                  required
                />
              </div>
              <Input 
                label="Subject" 
                value={selectedTemplate.subject}
                onChange={(e) => setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
                required
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                <textarea 
                  className="w-full h-64 bg-slate-100 dark:bg-white/5 border-none rounded-2xl dark:text-white p-4 outline-none focus:ring-2 focus:ring-primary-500/50 resize-none font-sans"
                  value={selectedTemplate.body}
                  onChange={(e) => setSelectedTemplate({...selectedTemplate, body: e.target.value})}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" type="button">
                  Save Draft
                </Button>
                <Button type="submit" disabled={isSending} className="px-10">
                  {isSending ? <RefreshCcw className="animate-spin" /> : <><Send size={18} /> Send Email</>}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
