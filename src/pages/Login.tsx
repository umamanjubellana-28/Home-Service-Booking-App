import React, { useState, useEffect } from 'react';
import { Lock, Mail, User, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageView } from '../components/Navbar';

interface LoginProps {
  initialMode?: 'user' | 'admin';
  bannerMessage?: string;
  prefillEmail?: string;
  onSuccess: (role: 'user' | 'admin') => void;
  onNavigate: (page: PageView) => void;
}

export const Login: React.FC<LoginProps> = ({
  initialMode = 'user',
  bannerMessage = '',
  prefillEmail = '',
  onSuccess,
  onNavigate,
}) => {
  const { loginUser, loginAdmin } = useApp();
  const [mode, setMode] = useState<'user' | 'admin'>(initialMode);
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setError('');
  }, [initialMode]);

  useEffect(() => {
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
  }, [prefillEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    const result =
      mode === 'admin'
        ? loginAdmin(email, password)
        : loginUser(email, password);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    onSuccess(mode);
  };

  const fillDemoCredentials = () => {
    setError('');
    if (mode === 'admin') {
      setEmail('admin@homeservices.com');
      setPassword('Admin123');
    } else {
      setEmail('ananya@example.com');
      setPassword('User123');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        {/* Role Switch Tabs */}
        <div
          role="tablist"
          aria-label="Login account type"
          className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'user'}
            onClick={() => {
              setMode('user');
              setError('');
              setPassword('');
            }}
            className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-colors cursor-pointer ${
              mode === 'user'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="h-4 w-4" />
            <span>User Login</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === 'admin'}
            onClick={() => {
              setMode('admin');
              setError('');
              setPassword('');
            }}
            className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-colors cursor-pointer ${
              mode === 'admin'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Admin Login</span>
          </button>
        </div>

        <div className="mt-6">
          <h1 className="font-display text-2xl font-bold text-slate-900">
            {mode === 'admin' ? 'Administrator Sign In' : 'Welcome Back'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {mode === 'admin'
              ? 'Sign in with admin credentials to manage bookings, payments, and feedback.'
              : 'Sign in to book home services, track status, and submit reviews.'}
          </p>
        </div>

        {bannerMessage && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{bannerMessage}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  mode === 'admin' ? 'admin@homeservices.com' : 'you@example.com'
                }
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 cursor-pointer"
          >
            {mode === 'admin' ? 'Sign In to Admin Dashboard' : 'Sign In to User Account'}
          </button>
        </form>

        {/* Demo Account Helper */}
        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50/70 p-4 text-xs text-slate-700">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-blue-900">
              {mode === 'admin' ? 'Default Admin Credentials' : 'Demo Customer Account'}
            </span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="font-semibold text-blue-700 hover:underline cursor-pointer"
            >
              Auto-fill
            </button>
          </div>
          {mode === 'admin' ? (
            <p className="mt-1.5 font-mono text-slate-600">
              Email: admin@homeservices.com | Password: Admin123
            </p>
          ) : (
            <p className="mt-1.5 font-mono text-slate-600">
              Email: ananya@example.com | Password: User123
            </p>
          )}
        </div>

        {mode === 'user' && (
          <p className="mt-5 text-center text-sm text-slate-600">
            New to HomeCare Services?{' '}
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="font-semibold text-blue-700 hover:underline cursor-pointer"
            >
              Create an account
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
