import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Rocket, Mail, Lock, ArrowRight } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl shadow-xl shadow-primary-500/30 mb-6">
            <Rocket className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Login to your Business Hub account
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@company.com"
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
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Sign In'}
              {!isSubmitting && <ArrowRight size={20} />}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Need help?</span>
              <a href="#" className="text-primary-600 font-semibold hover:underline">Contact Support</a>
            </div>
          </div>
        </Card>

        <p className="text-center text-sm text-slate-500">
          Try <span className="font-mono text-primary-600">admin@company.com</span> for admin access
        </p>
      </div>
    </div>
  );
}
