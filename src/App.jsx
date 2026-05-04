import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  const location = useLocation();

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
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Routes location={location}>
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
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
