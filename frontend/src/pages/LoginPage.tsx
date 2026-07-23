import { useId, useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/getErrorMessage';
import { BrandPanel } from '../components/BrandPanel';
import { PasswordInput } from '../components/PasswordInput';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const emailId = useId();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password, remember);
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to log in. Please check your credentials.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <BrandPanel />

      <div className="flex min-h-screen items-start justify-center px-6 pt-16 pb-12 sm:px-10 lg:items-center lg:justify-start lg:px-16 lg:pt-12 xl:px-20">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8 text-brand-600" aria-hidden="true">
              <rect width="32" height="32" rx="9" fill="currentColor" />
              <path
                d="M10 16.5 14 20.5 22 11.5"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-lg font-semibold tracking-tight text-ink">Task Manager</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-ink">Welcome back</h1>
          <p className="mt-1.5 text-sm text-ink/60">Sign in to manage your tasks.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div>
              <label htmlFor={emailId} className="block text-sm font-medium text-ink">
                Email
              </label>
              <div className="relative mt-1.5">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35"
                >
                  <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m3 6 7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  id={emailId}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-ink/15 bg-surface py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25"
                />
              </div>
            </div>

            <PasswordInput
              label="Password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-ink/25 accent-brand-600 focus:ring-2 focus:ring-brand-500/30"
              />
              <label htmlFor="remember" className="text-sm text-ink/70">
                Remember me on this device
              </label>
            </div>

            {error && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink/40">
            Demo login: <span className="font-medium text-ink/60">admin@test.com</span> /{' '}
            <span className="font-medium text-ink/60">123456</span>
          </p>
        </div>
      </div>
    </div>
  );
}
