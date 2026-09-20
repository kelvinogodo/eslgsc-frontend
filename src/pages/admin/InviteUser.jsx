import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlusIcon, EnvelopeIcon, CheckIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PageHeader from '../../components/portal/PageHeader';
import InviteList from './InviteList';
import Spinner from '../../components/ui/Spinner';
import { ROLE_OPTIONS } from '../../lib/roles';
import { inviteUser } from '../../services/userService';
import { getLGAs } from '../../services/lgaService';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const InviteUser = () => {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEDIA_ADMIN');
  const [lgaId, setLgaId] = useState('');
  const [tried, setTried] = useState(false);

  const { data: lgas = [] } = useQuery({ queryKey: ['lgas'], queryFn: () => getLGAs(), staleTime: 10 * 60 * 1000 });

  const errors = {
    email: !email.trim() ? 'Please enter their email address' : !EMAIL_RE.test(email.trim()) ? 'That doesn’t look like an email address' : '',
    lga: role === 'LGA' && !lgaId ? 'Please choose their local government' : ''
  };

  const invite = useMutation({
    mutationFn: () => inviteUser({ email: email.trim().toLowerCase(), role, lgaId: role === 'LGA' ? lgaId : undefined }),
    onSuccess: () => {
      toast.success(`Invitation sent to ${email.trim()}`);
      setEmail(''); setLgaId(''); setTried(false);
      queryClient.invalidateQueries({ queryKey: ['invites'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'We couldn’t send that invitation. Please try again.')
  });

  const submit = (e) => {
    e.preventDefault();
    setTried(true);
    if (errors.email || errors.lga) return;
    invite.mutate();
  };

  return (
    <div>
      <PageHeader icon={UserPlusIcon} title="Invite Someone" description="Give a colleague access. They’ll get an email with a link to choose their own password — you never see or set it." />

      <div className="grid items-start gap-6 xl:grid-cols-5">
        <form onSubmit={submit} noValidate className="card p-6 sm:p-8 xl:col-span-3" aria-label="Invite someone">
          <div>
            <label htmlFor="invite-email" className="mb-1.5 block text-sm font-bold text-ink-700">Their email address</label>
            <div className="relative">
              <EnvelopeIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-300" aria-hidden="true" />
              <input id="invite-email" type="email" inputMode="email" autoComplete="off" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={clsx('input pl-11', tried && errors.email && 'border-red-400')} />
            </div>
            {tried && errors.email && <p className="mt-1.5 text-sm font-semibold text-red-600" role="alert">{errors.email}</p>}
          </div>

          <fieldset className="mt-7">
            <legend className="mb-2 text-sm font-bold text-ink-700">What will they do?</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {ROLE_OPTIONS.map((r) => {
                const active = role === r.value;
                return (
                  <label key={r.value} className={clsx('relative flex cursor-pointer gap-3 rounded-2xl p-4 ring-1 transition-all', active ? 'bg-brand-50 ring-2 ring-brand-500' : 'bg-white ring-ink-100 hover:bg-ink-50/60 hover:ring-ink-200')}>
                    <input type="radio" name="role" value={r.value} checked={active} onChange={() => setRole(r.value)} className="sr-only" />
                    <span className={clsx('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors', active ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-200')}>
                      {active && <CheckIcon className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    <span>
                      <span className="block text-sm font-extrabold text-ink-900">{r.label}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-ink-500">{r.description}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <AnimatePresence initial={false}>
            {role === 'LGA' && (
              <motion.div key="lga" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pt-6">
                  <label htmlFor="invite-lga" className="mb-1.5 block text-sm font-bold text-ink-700">Which local government?</label>
                  <select id="invite-lga" value={lgaId} onChange={(e) => setLgaId(e.target.value)} className={clsx('select', tried && errors.lga && 'border-red-400')}>
                    <option value="">Choose…</option>
                    {lgas.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                  {tried && errors.lga ? <p className="mt-1.5 text-sm font-semibold text-red-600" role="alert">{errors.lga}</p> : <p className="mt-1.5 text-xs text-ink-400">They’ll only see staff posted to this local government.</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" disabled={invite.isPending} className="btn btn-primary btn-lg mt-8 w-full sm:w-auto">
            {invite.isPending ? <span className="inline-flex items-center gap-3"><Spinner size="sm" className="[&_svg]:text-white" /> Sending…</span> : <><PaperAirplaneIcon className="mr-2 h-5 w-5" aria-hidden="true" /> Send invitation</>}
          </button>
        </form>

        <InviteList className="xl:col-span-2" />
      </div>
    </div>
  );
};

export default InviteUser;
