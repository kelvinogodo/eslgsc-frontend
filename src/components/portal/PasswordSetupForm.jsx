import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationTriangleIcon, UserIcon, LinkSlashIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import AuthShell from './AuthShell';
import PasswordField from './PasswordField';
import { passwordChecks } from '../../lib/password';
import Spinner from '../ui/Spinner';

/**
 * One form for both "activate my account" (invite link — also asks for the
 * person's name) and "reset my password". Only the endpoint and wording differ.
 */
const PasswordSetupForm = ({ mode }) => {
  const isInvite = mode === 'invite';
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const token = sp.get('token') || '';

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState('');

  const rulesOk = passwordChecks(password).every((c) => c.ok);
  const errors = {
    name: isInvite && name.trim().length < 2 ? 'Please enter your full name' : '',
    password: !password ? 'Please choose a password' : !rulesOk ? 'Your password needs to meet all the rules below' : '',
    confirm: !confirm ? 'Please type your password again' : confirm !== password ? 'The two passwords don’t match yet' : ''
  };
  const invalid = Boolean(errors.name || errors.password || errors.confirm);
  const show = (f) => (touched[f] ? errors[f] : '');

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, password: true, confirm: true });
    if (invalid) return;
    setLoading(true);
    setServerError('');
    try {
      const body = { token, password };
      if (isInvite) body.name = name.trim();
      await api.post(isInvite ? '/auth/set-password' : '/auth/reset-password', body);
      setDone(true);
      toast.success(isInvite ? 'Your account is ready!' : 'Password changed!');
      setTimeout(() => navigate('/login'), 2200);
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(
        msg === 'Invalid or expired token'
          ? 'This link has expired or was already used. Please ask your administrator to send a new one.'
          : msg || 'We couldn’t save your password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const copy = isInvite
    ? { title: 'Welcome aboard', subtitle: 'Finish setting up your account by choosing a password.', button: 'Activate my account', pageTitle: 'Activate account', doneTitle: 'You’re all set' }
    : { title: 'Choose a new password', subtitle: 'Pick something you’ll remember but others can’t guess.', button: 'Save new password', pageTitle: 'Reset password', doneTitle: 'Password changed' };

  // No token in the link at all
  if (!token) {
    return (
      <AuthShell title="This link isn’t complete" pageTitle={copy.pageTitle} footer={<Link to="/login" className="font-bold text-brand-700">← Back to sign in</Link>}>
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-100 text-gold-600">
            <LinkSlashIcon className="h-8 w-8" aria-hidden="true" />
          </span>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-600">
            It looks like part of the link from your email is missing. Please open the email again and click the button
            or copy the whole link. If it still doesn’t work, ask your administrator to send you a new one.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={done ? copy.doneTitle : copy.title}
      subtitle={done ? undefined : copy.subtitle}
      pageTitle={copy.pageTitle}
      footer={<Link to="/login" className="font-bold text-brand-700 hover:text-brand-800">← Back to sign in</Link>}
    >
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="py-4 text-center">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-600"
            >
              <CheckCircleIcon className="h-11 w-11" aria-hidden="true" />
            </motion.span>
            <p className="mt-5 text-[0.95rem] text-ink-600">Taking you to the sign-in page…</p>
            <Link to="/login" className="btn btn-primary btn-md mt-5">Sign in now</Link>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate className="space-y-5" exit={{ opacity: 0 }}>
            {isInvite && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-bold text-ink-700">Your full name</label>
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-300" aria-hidden="true" />
                  <input
                    id="name"
                    autoComplete="name"
                    autoFocus
                    placeholder="e.g. Chinedu Okafor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    className={`input pl-11 ${show('name') ? 'border-red-400' : ''}`}
                  />
                </div>
                {show('name') && <p className="mt-1.5 text-sm font-semibold text-red-600" role="alert">{show('name')}</p>}
              </div>
            )}

            <PasswordField
              label={isInvite ? 'Choose a password' : 'New password'}
              name="password"
              autoComplete="new-password"
              autoFocus={!isInvite}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              error={show('password')}
              showStrength
            />

            <PasswordField
              label="Type it again"
              name="confirm"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
              error={show('confirm')}
            />

            <AnimatePresence>
              {serverError && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm ring-1 ring-red-100">
                  <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
                  <p className="font-semibold text-red-700">{serverError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
              {loading ? <span className="inline-flex items-center gap-3"><Spinner size="sm" className="[&_svg]:text-white" label="Saving" /> Saving…</span> : copy.button}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthShell>
  );
};

export default PasswordSetupForm;
