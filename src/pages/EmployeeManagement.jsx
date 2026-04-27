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
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', role: '', joined: new Date().toISOString().split('T')[0] });

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = (e) => {
    e.preventDefault();
    const id = employees.length + 1;
    setEmployees([...employees, { ...newEmployee, id, status: 'Onboarding' }]);
    setNewEmployee({ name: '', email: '', role: '', joined: new Date().toISOString().split('T')[0] });
    setShowAddModal(false);
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
        <Button onClick={() => setShowAddModal(true)}>
          <UserPlus size={20} /> Add Employee
        </Button>
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

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-bold dark:text-white">Add New Employee</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              <Input 
                label="Full Name" 
                placeholder="e.g. Rahul Sharma" 
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                required
              />
              <Input 
                label="Email" 
                type="email" 
                placeholder="rahul@company.com" 
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                required
              />
              <Input 
                label="Role" 
                placeholder="e.g. Software Engineer" 
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                required
              />
              <Input 
                label="Joined Date" 
                type="date" 
                value={newEmployee.joined}
                onChange={(e) => setNewEmployee({...newEmployee, joined: e.target.value})}
                required
              />
              <div className="pt-4 flex gap-3">
                <Button variant="secondary" type="button" className="flex-1" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Employee
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
