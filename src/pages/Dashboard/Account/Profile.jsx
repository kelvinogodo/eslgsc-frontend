import { useState } from 'react';
import { toast } from 'react-toastify';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import useAuth from '../../../context/useAuth';
import PageHeader from '../../../components/portal/PageHeader';
import Avatar from '../../../components/portal/Avatar';
import PasswordField from '../../../components/portal/PasswordField';
import { passwordChecks } from '../../../lib/password';
import Spinner from '../../../components/ui/Spinner';
import { ROLE_LABELS } from '../../../lib/navigation';
import { changePassword, updateProfile } from '../../../services/authService';

const IdentityCard = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) { toast.error('Please enter your full name.'); return; }
    if (trimmed === user?.name) { setEditing(false); return; }
    setSaving(true);
    try {
      const res = await updateProfile({ name: trimmed });
      updateUser?.(res.user || { name: trimmed });
      toast.success('Your name has been updated');
      setEditing(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'We couldn’t update your name. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card p-6 sm:p-8">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">
        <Avatar name={user?.name} size="xl" className="sm:mr-6" />
        <div className="mt-4 min-w-0 flex-1 sm:mt-0">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                aria-label="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { setEditing(false); setName(user?.name || ''); } }}
                className="input max-w-xs"
              />
              <button type="button" onClick={save} disabled={saving} className="btn btn-primary btn-md" aria-label="Save name">
                {saving ? <Spinner size="xs" className="[&_svg]:text-white" /> : <CheckIcon className="h-5 w-5" />}
              </button>
              <button type="button" onClick={() => { setEditing(false); setName(user?.name || ''); }} className="btn btn-ghost btn-md" aria-label="Cancel"><XMarkIcon className="h-5 w-5" /></button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h2 className="truncate text-2xl font-extrabold text-ink-900">{user?.name}</h2>
              <button type="button" onClick={() => setEditing(true)} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-50 hover:text-brand-700" aria-label="Edit your name">
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>
          )}
          <p className="mt-1 text-sm text-ink-500">{user?.email}</p>
          <p className="mt-2 text-sm font-semibold text-brand-800">{ROLE_LABELS[user?.role]}</p>
        </div>
      </div>
    </div>
  );
};

const PasswordCard = () => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const errors = {
    current: !current ? 'Please enter your current password' : '',
    next: !next ? 'Please choose a new password' : !passwordChecks(next).every((c) => c.ok) ? 'Your new password needs to meet all the rules' : next === current ? 'Your new password should be different from the old one' : '',
    confirm: !confirm ? 'Please type the new password again' : confirm !== next ? 'The two passwords don’t match yet' : ''
  };
  const show = (f) => (touched[f] ? errors[f] : '');

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ current: true, next: true, confirm: true });
    if (errors.current || errors.next || errors.confirm) return;
    setSaving(true);
    setError('');
    try {
      await changePassword({ currentPassword: current, newPassword: next });
      toast.success('Your password has been changed');
      setCurrent(''); setNext(''); setConfirm(''); setTouched({});
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg === 'Current password is incorrect' ? 'Your current password isn’t right. Please try again.' : msg || 'We couldn’t change your password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="card p-6 sm:p-8" aria-labelledby="pw-heading">
      <h2 id="pw-heading" className="text-lg font-extrabold text-ink-900">Change password</h2>

      <div className="mt-6 space-y-5">
        <PasswordField label="Current password" name="current" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, current: true }))} error={show('current')} />
        <PasswordField label="New password" name="new" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, next: true }))} error={show('next')} showStrength />
        <PasswordField label="Type the new password again" name="confirm" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, confirm: true }))} error={show('confirm')} />
      </div>

      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">{error}</p>}

      <button type="submit" disabled={saving} className="btn btn-primary btn-lg mt-6">
        {saving ? <span className="inline-flex items-center gap-3"><Spinner size="sm" className="[&_svg]:text-white" /> Saving…</span> : 'Change password'}
      </button>
    </form>
  );
};

const Profile = () => (
  <div className="max-w-3xl">
    <PageHeader title="My Profile" description="Your name, email and password." />
    <div className="space-y-6">
      <IdentityCard />
      <PasswordCard />
    </div>
  </div>
);

export default Profile;
