import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Rocket, Mail, Lock, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Employee');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, signup } = useAuth();
  const { showToast } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
        showToast('Successfully logged in!', 'success');
      } else {
        await signup({ email, password, name, role });
        showToast('Account created successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-3xl shadow-2xl shadow-primary-500/30 mb-6 rotate-3">
            <Rocket className="text-white" size={40} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 font-medium">
            {isLogin ? 'Manage your business hub with ease' : 'Join the next generation of business management'}
          </p>
        </div>

        <Card className="p-8 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-white/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Assign Role</label>
                  <select 
                    className="w-full h-11 bg-slate-100 dark:bg-white/5 border-none rounded-xl dark:text-white px-4 outline-none focus:ring-2 focus:ring-primary-500/50"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </>
            )}
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full h-12 text-lg mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!isSubmitting && (isLogin ? <LogIn size={20} /> : <UserPlus size={20} />)}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 font-bold hover:text-primary-700 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">
            Demo Credentials
          </p>
          <div className="inline-flex gap-4 p-2 px-4 bg-white/50 dark:bg-white/5 rounded-full backdrop-blur-sm border border-white/10 text-xs">
            <span className="text-slate-500">Email: <span className="text-primary-600 font-mono">admin@hub.com</span></span>
            <span className="text-slate-500">Pass: <span className="text-primary-600 font-mono">admin</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
