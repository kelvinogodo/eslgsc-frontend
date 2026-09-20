import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AnimatePresence, motion } from 'framer-motion';
import { EnvelopeIcon, ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import useAuth from '../../context/useAuth';
import AuthShell from '../../components/portal/AuthShell';
import PasswordField from '../../components/portal/PasswordField';
import Spinner from '../../components/ui/Spinner';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const readSessionExpired = () => {
  try {
    const flag = sessionStorage.getItem('sessionExpired');
    if (flag) sessionStorage.removeItem('sessionExpired');
    return Boolean(flag);
  } catch {
    return false;
  }
};

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [sessionExpired] = useState(readSessionExpired);
  const [shakeKey, setShakeKey] = useState(0);
  const isDevOffline = import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL;

  const from = location.state?.from?.pathname;
  const destination = from && from.startsWith('/dashboard') ? from : '/dashboard';

  const errors = {
    email: !email.trim() ? 'Please enter your email address' : !EMAIL_RE.test(email.trim()) ? 'That doesn’t look like an email address' : '',
    password: !password ? 'Please enter your password' : ''
  };

  useEffect(() => { if (authError) setAuthError(null); }, [email, password]); // eslint-disable-line react-hooks/exhaustive-deps

  // Already signed in? Skip the form.
  if (user && !done) return <Navigate to={destination} replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (errors.email || errors.password) {
      setShakeKey((k) => k + 1);
      return;
    }
    setSubmitting(true);
    setAuthError(null);
    try {
      const response = await api.post('/auth/login', { email: email.trim().toLowerCase(), password });
      setDone(true);
      login(response.data.user, response.data.token);
      toast.success(`Welcome back, ${response.data.user.name?.split(' ')[0] || 'friend'}!`);
      setTimeout(() => navigate(destination, { replace: true }), 650);
    } catch (error) {
      let message = 'We couldn’t sign you in. Please check your details and try again.';
      const status = error.response?.status;
      if (status === 401) message = 'That email and password don’t match. Please check them and try again.';
      else if (status === 429) message = 'Too many attempts. Please wait a minute, then try again.';
      else if (!error.response) message = 'We can’t reach the server. Please check your internet connection and try again.';
      setAuthError(message);
      setShakeKey((k) => k + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const showErr = (field) => (touched[field] ? errors[field] : '');

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to the Commission’s staff portal."
      pageTitle="Sign in"
      footer={<>Don’t have an account? Ask your administrator to send you an invitation.</>}
    >
      <AnimatePresence initial={false}>
        {sessionExpired && !authError && (
          <motion.div
            key="expired"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="flex items-start gap-3 rounded-2xl bg-gold-50 p-4 text-sm text-gold-600 ring-1 ring-gold-200">
              <InformationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p className="font-semibold text-ink-700">Your session has ended, so we signed you out for safety. Please sign in again to carry on.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        key={shakeKey}
        onSubmit={onSubmit}
        noValidate
        className="space-y-5"
        animate={shakeKey ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
        transition={{ duration: 0.4 }}
      >
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-ink-700">Email address</label>
          <div className="relative">
            <EnvelopeIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-300" aria-hidden="true" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              aria-invalid={showErr('email') ? 'true' : undefined}
              className={`input pl-11 ${showErr('email') ? 'border-red-400' : ''}`}
            />
          </div>
          {showErr('email') && <p className="mt-1.5 text-sm font-semibold text-red-600" role="alert">{showErr('email')}</p>}
        </div>

        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={showErr('password')}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-bold text-brand-700 hover:text-brand-800">Forgot your password?</Link>
        </div>

        <AnimatePresence>
          {authError && (
            <motion.div
              key="err"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="alert"
              className="flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm ring-1 ring-red-100"
            >
              <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
              <p className="font-semibold text-red-700">{authError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" disabled={submitting || done} className="btn btn-primary btn-lg w-full">
          {done ? (
            <span className="inline-flex items-center gap-2"><CheckCircleIcon className="h-6 w-6" /> Signed in</span>
          ) : submitting ? (
            <span className="inline-flex items-center gap-3"><Spinner size="sm" className="[&_svg]:text-white" label="Signing in" /> Signing you in…</span>
          ) : (
            'Sign in'
          )}
        </button>
      </motion.form>

      {isDevOffline && (
        <p className="mt-6 rounded-xl bg-ink-50 p-3 text-xs text-ink-500">
          Developer note: no <code>VITE_API_BASE_URL</code> is set, so sign-in will call the default hosted API.
        </p>
      )}
    </AuthShell>
  );
};

export default Login;
