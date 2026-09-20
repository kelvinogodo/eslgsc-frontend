import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { EnvelopeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import AuthShell from '../../components/portal/AuthShell';
import Spinner from '../../components/ui/Spinner';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter the email address you sign in with');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
      setSent(true);
    } catch (err) {
      if (err.response?.status === 429) setError('Too many requests. Please wait a minute and try again.');
      else if (!err.response) setError('We can’t reach the server. Please check your internet connection.');
      else setSent(true); // never reveal whether an email exists
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={sent ? 'Check your email' : 'Forgot your password?'}
      subtitle={sent ? undefined : 'No problem. Enter your email and we’ll send you a link to choose a new one.'}
      pageTitle="Reset password"
      footer={<Link to="/login" className="font-bold text-brand-700 hover:text-brand-800">← Back to sign in</Link>}
    >
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div key="sent" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <PaperAirplaneIcon className="h-8 w-8" aria-hidden="true" />
            </span>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-600">
              If <strong className="text-ink-900">{email.trim()}</strong> belongs to a portal account, a reset link is on its way.
              It stays valid for one hour.
            </p>
            <p className="mt-3 text-sm text-ink-400">Can’t see it? Check your spam folder, or ask your administrator to send a new link.</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate className="space-y-5" exit={{ opacity: 0 }}>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-ink-700">Email address</label>
              <div className="relative">
                <EnvelopeIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-300" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className={`input pl-11 ${error ? 'border-red-400' : ''}`}
                />
              </div>
              {error && <p className="mt-1.5 text-sm font-semibold text-red-600" role="alert">{error}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
              {loading ? <span className="inline-flex items-center gap-3"><Spinner size="sm" className="[&_svg]:text-white" label="Sending" /> Sending…</span> : 'Email me a reset link'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthShell>
  );
};

export default ForgotPassword;
