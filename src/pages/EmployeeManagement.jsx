import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  FileText, 
  Download, 
  Mail,
  Trash2,
  X,
  CheckCircle2
} from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

const initialEmployees = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@company.com', role: 'Software Engineer', status: 'Active', joined: '2025-01-15' },
  { id: 2, name: 'Priya Patel', email: 'priya@company.com', role: 'Product Designer', status: 'Active', joined: '2025-02-10' },
  { id: 3, name: 'Amit Singh', email: 'amit@company.com', role: 'Marketing Lead', status: 'Onboarding', joined: '2025-04-01' },
  { id: 4, name: 'Sonal Verma', email: 'sonal@company.com', role: 'HR Manager', status: 'Active', joined: '2024-11-20' },
];

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [newEmployee, setNewEmployee] = useState({ 
    name: '', 
    email: '', 
    role: '', 
    phone: '',
    department: 'Engineering',
    joined: new Date().toISOString().split('T')[0],
    type: 'Full-time',
    location: 'Remote'
  });
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendOnboardingEmail = async (employee) => {
    setIsEmailSending(true);
    
    try {
      // NOTE: To make this work, replace the placeholders with your actual EmailJS keys
      // Get them at: https://dashboard.emailjs.com/
      const SERVICE_ID = 'YOUR_SERVICE_ID'; // e.g. 'service_xxxx'
      const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // e.g. 'template_xxxx'
      const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // e.g. 'xxxx-xxxx-xxxx'

      const templateParams = {
        employee_name: employee.name,
        employee_role: employee.role,
        employee_email: employee.email,
        joined_date: employee.joined,
        to_email: employee.email,
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      
      console.log(`Onboarding email sent successfully to: ${employee.email}`);
      setToastMessage(`Onboarding email sent successfully to ${employee.email}`);
      setShowToast(true);
    } catch (error) {
      console.error('Failed to send email:', error);
      setToastMessage('Failed to send onboarding email. Please check your configuration.');
      setShowToast(true);
    } finally {
      setIsEmailSending(false);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const id = employees.length + 1;
    const addedEmployee = { ...newEmployee, id, status: 'Onboarding' };
    
    // Simulate sending email first or after adding? 
    // Usually immediate submission means we start the process.
    setEmployees([...employees, addedEmployee]);
    
    await sendOnboardingEmail(addedEmployee);

    setNewEmployee({ 
      name: '', 
      email: '', 
      role: '', 
      phone: '',
      department: 'Engineering',
      joined: new Date().toISOString().split('T')[0],
      type: 'Full-time',
      location: 'Remote'
    });
    setShowAddModal(false);
    setOnboardingStep(1);
  };

  const downloadTemplate = () => {
    const headers = ['Full Name', 'Email', 'Phone', 'Role', 'Department', 'Joined Date', 'Employment Type'];
    const csvContent = [
      headers.join(','),
      'John Doe,john@example.com,+91 9876543210,Software Engineer,Engineering,2025-05-01,Full-time',
      'Jane Smith,jane@example.com,+91 9876543211,Product Designer,Design,2025-05-15,Part-time'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'employee_onboarding_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCertificate = (employee) => {
    const doc = new jsPDF({
      orientation: 'landscape',
    });

    // Add border
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    
    doc.setFontSize(40);
    doc.setTextColor(14, 165, 233); // primary-600
    doc.text('CERTIFICATE OF ONBOARDING', 148, 60, { align: 'center' });
    
    doc.setFontSize(20);
    doc.setTextColor(100, 116, 139);
    doc.text('This is to certify that', 148, 90, { align: 'center' });
    
    doc.setFontSize(30);
    doc.setTextColor(15, 23, 42);
    doc.text(employee.name.toUpperCase(), 148, 110, { align: 'center' });
    
    doc.setFontSize(20);
    doc.setTextColor(100, 116, 139);
    doc.text(`has successfully joined as ${employee.role}`, 148, 130, { align: 'center' });
    doc.text(`on ${employee.joined}`, 148, 140, { align: 'center' });
    
    doc.setFontSize(15);
    doc.text('Authorized Signature', 220, 170, { align: 'center' });
    doc.line(190, 165, 250, 165);

    doc.save(`${employee.name}_Onboarding_Certificate.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <Users className="text-blue-500" size={32} />
            Employee Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your team and generate onboarding documents.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={downloadTemplate}>
            <Download size={20} /> Download Template
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <UserPlus size={20} /> Add Employee
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search employees or roles..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-white/5 border-none rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="bg-slate-100 dark:bg-white/5 border-none rounded-xl text-sm dark:text-white px-4 py-2 outline-none">
              <option>All Status</option>
              <option>Active</option>
              <option>Onboarding</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold dark:text-white">{emp.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 dark:text-slate-300">{emp.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      emp.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' 
                        : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 dark:text-slate-300">{emp.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => generateCertificate(emp)}
                        className="p-2 text-slate-400 hover:text-primary-600 transition-colors" 
                        title="Generate Certificate"
                      >
                        <FileText size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Send Email">
                        <Mail size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Employee Onboarding Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/5">
                <div>
                  <h3 className="text-xl font-bold dark:text-white">Employee Onboarding</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Step {onboardingStep} of 2</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="flex gap-2 mb-8">
                  <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${onboardingStep >= 1 ? 'bg-primary-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                  <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${onboardingStep >= 2 ? 'bg-primary-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                </div>

                <form onSubmit={onboardingStep === 2 ? handleAddEmployee : (e) => { e.preventDefault(); setOnboardingStep(2); }} className="space-y-6">
                  {isEmailSending && (
                    <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl">
                      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="font-bold dark:text-white">Sending onboarding email...</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Please wait while we set everything up.</p>
                    </div>
                  )}
                  {onboardingStep === 1 ? (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Personal Information</h4>
                      <Input 
                        label="Full Name" 
                        placeholder="e.g. Rahul Sharma" 
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                        required
                      />
                      <Input 
                        label="Email Address" 
                        type="email" 
                        placeholder="rahul@company.com" 
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                        required
                      />
                      <Input 
                        label="Phone Number" 
                        placeholder="+91 98765 43210" 
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Professional Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          label="Role" 
                          placeholder="e.g. Software Engineer" 
                          value={newEmployee.role}
                          onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                          required
                        />
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Department</label>
                          <select 
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all dark:text-white"
                            value={newEmployee.department}
                            onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                          >
                            <option value="Engineering">Engineering</option>
                            <option value="Design">Design</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="HR">HR</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          label="Joined Date" 
                          type="date" 
                          value={newEmployee.joined}
                          onChange={(e) => setNewEmployee({...newEmployee, joined: e.target.value})}
                          required
                        />
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Employment Type</label>
                          <select 
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all dark:text-white"
                            value={newEmployee.type}
                            onChange={(e) => setNewEmployee({...newEmployee, type: e.target.value})}
                          >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-6 flex gap-3 border-t border-slate-200 dark:border-white/5">
                    {onboardingStep === 2 && (
                      <Button variant="secondary" type="button" className="flex-1" onClick={() => setOnboardingStep(1)}>
                        Back
                      </Button>
                    )}
                    <Button variant="secondary" type="button" className={onboardingStep === 1 ? 'flex-1' : ''} onClick={() => setShowAddModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isEmailSending}>
                      {onboardingStep === 1 ? 'Continue' : isEmailSending ? 'Sending...' : 'Complete Onboarding'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[100] px-6 py-4 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 min-w-[320px]"
          >
            <CheckCircle2 size={24} />
            <div>
              <div className="font-bold">Success!</div>
              <div className="text-sm opacity-90">{toastMessage}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
