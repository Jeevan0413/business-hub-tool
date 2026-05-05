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
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { useData } from '../context/DataContext';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export default function EmployeeManagement() {
  const { employees, addEmployee, deleteEmployee } = useData();
  const { showToast } = useNotification();
  const { isAdmin, user } = useAuth();
  
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

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendOnboardingEmail = async (employee) => {
    setIsEmailSending(true);
    try {
      const SERVICE_ID = 'YOUR_SERVICE_ID';
      const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
      const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

      const templateParams = {
        employee_name: employee.name,
        employee_role: employee.role,
        employee_email: employee.email,
        joined_date: employee.joined,
        to_email: employee.email,
      };

      // Mocking EmailJS for demo purposes unless keys are provided
      if (SERVICE_ID !== 'YOUR_SERVICE_ID') {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      showToast(`Onboarding email sent to ${employee.email}`, 'success');
    } catch (error) {
      showToast('Email sending failed. Please check config.', 'error');
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Only admins can add employees', 'error');
      return;
    }
    
    const employeeData = { ...newEmployee, status: 'Onboarding' };
    addEmployee(employeeData);
    await sendOnboardingEmail(employeeData);

    setNewEmployee({ 
      name: '', email: '', role: '', phone: '',
      department: 'Engineering',
      joined: new Date().toISOString().split('T')[0],
      type: 'Full-time', location: 'Remote'
    });
    setShowAddModal(false);
    setOnboardingStep(1);
    showToast('Employee added to system', 'success');
  };

  const handleDelete = (id) => {
    if (!isAdmin) {
      showToast('Permission denied: Admin only', 'error');
      return;
    }
    if (window.confirm('Are you sure you want to remove this employee?')) {
      deleteEmployee(id);
      showToast('Employee removed successfully', 'info');
    }
  };

  const downloadTemplate = () => {
    const headers = ['Full Name', 'Email', 'Phone', 'Role', 'Department', 'Joined Date', 'Employment Type'];
    const csvContent = [
      headers.join(','),
      'John Doe,john@example.com,+91 9876543210,Software Engineer,Engineering,2025-05-01,Full-time',
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'employee_template.csv');
    link.click();
    showToast('Template downloaded', 'info');
  };

  const generateCertificate = (employee) => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    doc.setFontSize(40);
    doc.setTextColor(14, 165, 233);
    doc.text('CERTIFICATE OF ONBOARDING', 148, 60, { align: 'center' });
    doc.setFontSize(20);
    doc.setTextColor(100, 116, 139);
    doc.text('This is to certify that', 148, 90, { align: 'center' });
    doc.setFontSize(30);
    doc.setTextColor(15, 23, 42);
    doc.text(employee.name.toUpperCase(), 148, 110, { align: 'center' });
    doc.setFontSize(20);
    doc.text(`has successfully joined as ${employee.role}`, 148, 130, { align: 'center' });
    doc.save(`${employee.name}_Certificate.pdf`);
    showToast('Certificate generated', 'success');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <Users className="text-blue-500" size={32} />
            Employee Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Welcome, <span className="font-bold text-primary-600">{user?.name}</span>. Manage your team here.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={downloadTemplate}>
            <Download size={20} /> Template
          </Button>
          {isAdmin ? (
            <Button onClick={() => setShowAddModal(true)}>
              <UserPlus size={20} /> Add Employee
            </Button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-600 rounded-xl text-sm font-bold border border-amber-500/20">
              <ShieldAlert size={18} /> View Only
            </div>
          )}
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

        <div className="table-container">
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
                      {isAdmin && (
                        <button 
                          onClick={() => handleDelete(emp.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors" 
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
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
    </div>
  );
}
