import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FinanceTool from './pages/FinanceTool';
import StartupTool from './pages/StartupTool';
import PlanningTool from './pages/PlanningTool';
import PitchTool from './pages/PitchTool';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/finance" element={<FinanceTool />} />
        <Route path="/startup" element={<StartupTool />} />
        <Route path="/planning" element={<PlanningTool />} />
        <Route path="/pitch" element={<PitchTool />} />
      </Routes>
    </Layout>
  );
}

export default App;
