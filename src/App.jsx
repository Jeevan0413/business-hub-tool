import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FinanceTool from './pages/FinanceTool';
import StartupTool from './pages/StartupTool';
import PlanningTool from './pages/PlanningTool';
import PitchTool from './pages/PitchTool';
import Login from './pages/Login';
import EmployeeManagement from './pages/EmployeeManagement';
import DocumentAutomation from './pages/DocumentAutomation';
import Communication from './pages/Communication';

function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/finance" element={<FinanceTool />} />
        <Route path="/documents" element={<DocumentAutomation />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/startup" element={<StartupTool />} />
        <Route path="/planning" element={<PlanningTool />} />
        <Route path="/pitch" element={<PitchTool />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
