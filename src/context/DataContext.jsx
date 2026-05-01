import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const INITIAL_EMPLOYEES = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@company.com', role: 'Software Engineer', status: 'Active', joined: '2025-01-15', department: 'Engineering' },
  { id: 2, name: 'Priya Patel', email: 'priya@company.com', role: 'Product Designer', status: 'Active', joined: '2025-02-10', department: 'Design' },
  { id: 3, name: 'Amit Singh', email: 'amit@company.com', role: 'Marketing Lead', status: 'Onboarding', joined: '2025-04-01', department: 'Marketing' },
];

export const DataProvider = ({ children }) => {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('employees');
    if (!saved) return INITIAL_EMPLOYEES;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : INITIAL_EMPLOYEES;
    } catch (e) { return INITIAL_EMPLOYEES; }
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('invoices');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    const defaults = [
      { id: 1, category: 'Software', amount: 450, date: '2025-04-10' },
      { id: 2, category: 'Marketing', amount: 1200, date: '2025-04-15' },
    ];
    if (!saved) return defaults;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : defaults;
    } catch (e) { return defaults; }
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('activities');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  });

  const [userPlan, setUserPlan] = useState(() => {
    const saved = localStorage.getItem('userPlan');
    return saved || 'Free';
  });

  const [invoiceSettings, setInvoiceSettings] = useState(() => {
    const saved = localStorage.getItem('invoiceSettings');
    const defaults = {
      templateId: 'default',
      themeColor: '#0ea5e9',
      logo: null,
      footerText: '',
      notes: '',
      terms: '',
      sectionsOrder: ['header', 'info', 'items', 'summary', 'footer'],
      visibleSections: { gst: true, notes: true, terms: true, footer: true },
      savedTemplates: []
    };
    if (!saved) return defaults;
    try {
      const parsed = JSON.parse(saved);
      return { 
        ...defaults, 
        ...parsed, 
        visibleSections: { ...defaults.visibleSections, ...(parsed.visibleSections || {}) },
        sectionsOrder: Array.isArray(parsed.sectionsOrder) ? parsed.sectionsOrder : defaults.sectionsOrder
      };
    } catch (e) {
      return defaults;
    }
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('userPlan', userPlan);
  }, [userPlan]);

  useEffect(() => {
    localStorage.setItem('invoiceSettings', JSON.stringify(invoiceSettings));
  }, [invoiceSettings]);

  const addActivity = (action, user = 'System') => {
    const newActivity = {
      id: Date.now(),
      user,
      action,
      time: 'Just now',
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 20));
  };

  const addEmployee = (employee) => {
    setEmployees(prev => [...prev, { ...employee, id: Date.now() }]);
    addActivity(`Added new employee: ${employee.name}`);
  };

  const deleteEmployee = (id) => {
    const emp = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    if (emp) addActivity(`Removed employee: ${emp.name}`);
  };

  const addInvoice = (invoice) => {
    setInvoices(prev => [...prev, { ...invoice, id: Date.now() }]);
    addActivity(`Generated invoice: ${invoice.invoiceNumber}`);
  };

  const addExpense = (expense) => {
    setExpenses(prev => [...prev, { ...expense, id: Date.now() }]);
    addActivity(`Recorded expense: ${expense.category} ($${expense.amount})`);
  };

  const updatePlan = (plan) => {
    setUserPlan(plan);
    addActivity(`Upgraded to ${plan} plan`);
  };

  const updateInvoiceSettings = (settings) => {
    setInvoiceSettings(prev => ({ ...prev, ...settings }));
  };

  const value = {
    employees,
    addEmployee,
    deleteEmployee,
    invoices,
    addInvoice,
    expenses,
    addExpense,
    activities,
    userPlan,
    updatePlan,
    invoiceSettings,
    updateInvoiceSettings,
    stats: {
      totalEmployees: employees.length,
      monthlyRevenue: invoices.reduce((sum, inv) => sum + (inv.total || 0), 0) + 15000, // Mock base revenue
      totalExpenses: expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0)
    }
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
