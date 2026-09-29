import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('vartika@buglens.dev');
  const [password, setPassword] = useState('password123');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // handled by store
    }
  };

  const quickLogins = [
    { role: 'Admin', name: 'Vartika Sharma', email: 'vartika@buglens.dev' },
    { role: 'Developer', name: 'Rahul Verma', email: 'rahul@buglens.dev' },
    { role: 'QA Tester', name: 'Ananya Iyer', email: 'ananya@buglens.dev' },
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <svg className="w-7 h-7 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="m8 2 1.88 1.88"/>
                <path d="M14.12 3.88 16 2"/>
                <path d="M9 7.13v-1a3.003 3.003 0 0 1 6 0v1"/>
                <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z"/>
              </svg>
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight">Welcome back to BugLens</h2>
          <p className="text-xs text-gray-400 mt-1">Sign in to your QA collaboration dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center justify-between">
              <span>{error}</span>
              <button onClick={clearError} className="underline text-[10px]">Dismiss</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              placeholder="name@company.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
              1-Click Demo Quick Logins
            </p>
            <div className="grid grid-cols-3 gap-2">
              {quickLogins.map((ql) => (
                <button
                  key={ql.role}
                  type="button"
                  onClick={async () => {
                    setEmail(ql.email);
                    setPassword('password123');
                    await login(ql.email, 'password123');
                    navigate('/dashboard');
                  }}
                  className="p-2 rounded-xl bg-gray-800/80 hover:bg-brand-600/30 border border-gray-700/60 hover:border-brand-500/50 text-left transition-colors"
                >
                  <span className="text-[10px] font-bold text-brand-400 block">{ql.role}</span>
                  <span className="text-[11px] font-semibold text-white truncate block">{ql.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:underline font-semibold">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};
