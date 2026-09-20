import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ChatBubbleLeftRightIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, LightBulbIcon, CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PageHeader from '../../../components/portal/PageHeader';
import SegmentedControl from '../../../components/portal/SegmentedControl';
import SearchBox from '../../../components/portal/SearchBox';
import Avatar from '../../../components/portal/Avatar';
import Modal from '../../../components/ui/Modal';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { getComplaints, updateComplaintStatus } from '../../../services/complaintService';
import { timeAgo, formatDateTime } from '../../../lib/utils';
import { EASE } from '../../../components/portal/motionVariants';

const STATUSES = {
  NEW: { label: 'New', badge: 'blue', help: 'Nobody has looked at this yet.' },
  IN_REVIEW: { label: 'Being looked at', badge: 'yellow', help: 'Someone is working on it.' },
  CLOSED: { label: 'Closed', badge: 'green', help: 'It has been dealt with.' }
};

const pretty = (s = '') => s.replace(/[-_]/g, ' ').replace(/^./, (c) => c.toUpperCase());

const Complaints = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('NEW');

  const { data, isLoading } = useQuery({ queryKey: ['complaints'], queryFn: () => getComplaints() });
  const complaints = useMemo(() => data?.data || [], [data]);

  const counts = useMemo(() => ({
    ALL: complaints.length,
    NEW: complaints.filter((c) => c.status === 'NEW').length,
    IN_REVIEW: complaints.filter((c) => c.status === 'IN_REVIEW').length,
    CLOSED: complaints.filter((c) => c.status === 'CLOSED').length
  }), [complaints]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return complaints.filter((c) => (tab === 'ALL' || c.status === tab) && (!q || `${c.fullName} ${c.subject} ${c.message} ${c.localGovernment}`.toLowerCase().includes(q)));
  }, [complaints, tab, search]);

  const save = useMutation({
    mutationFn: () => updateComplaintStatus(selected.id, { status, adminNote: note }),
    onSuccess: () => {
      toast.success('Saved');
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['activityLog'] });
      setSelected(null);
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'We couldn’t save that. Please try again.')
  });

  const open = (c) => { setSelected(c); setNote(c.adminNote || ''); setStatus(c.status); };

  return (
    <div>
      <PageHeader icon={ChatBubbleLeftRightIcon} title="Complaints" description="Messages and petitions from members of the public. Open one to read it, record what’s being done, and mark its progress." />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <SegmentedControl
          label="Complaint status"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'ALL', label: 'All', count: counts.ALL },
            { value: 'NEW', label: 'New', count: counts.NEW },
            { value: 'IN_REVIEW', label: 'In progress', count: counts.IN_REVIEW },
            { value: 'CLOSED', label: 'Closed', count: counts.CLOSED }
          ]}
        />
        <SearchBox value={search} onChange={setSearch} placeholder="Search complaints" className="w-full sm:w-72" />
      </div>

      <div className="card">
        {isLoading ? (
          <div className="space-y-3 p-5">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
        ) : visible.length === 0 ? (
          <div className="p-5"><EmptyState icon={ChatBubbleLeftRightIcon} title={complaints.length ? 'Nothing matches that' : 'No complaints yet'} description={complaints.length ? 'Try a different filter or search word.' : 'When someone submits a complaint on the website, it will appear here.'} /></div>
        ) : (
          <ul className="divide-y divide-ink-100">
            {visible.map((c, i) => (
              <motion.li key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3), ease: EASE }}>
                <button type="button" onClick={() => open(c)} className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-brand-50/50">
                  <Avatar name={c.fullName} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-extrabold text-ink-900">{c.subject || 'No subject'}</span>
                    <span className="mt-0.5 block truncate text-sm text-ink-500">{c.fullName} · {pretty(c.category)}{c.localGovernment ? ` · ${c.localGovernment}` : ''}</span>
                  </span>
                  <span className="hidden text-xs font-semibold text-ink-400 sm:block" title={formatDateTime(c.createdAt)}>{timeAgo(c.createdAt)}</span>
                  <Badge variant={STATUSES[c.status]?.badge || 'gray'}>{STATUSES[c.status]?.label || c.status}</Badge>
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Complaint" size="lg">
        {selected && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-ink-900">{selected.subject}</h2>
              <p className="mt-1 text-sm text-ink-400" title={formatDateTime(selected.createdAt)}>Received {timeAgo(selected.createdAt)} · {pretty(selected.category)}</p>
            </div>

            <div className="grid gap-3 rounded-2xl bg-ink-50/70 p-4 text-sm sm:grid-cols-2">
              <p className="flex items-center gap-2 font-bold text-ink-900"><Avatar name={selected.fullName} size="sm" /> {selected.fullName}</p>
              <p className="flex items-center gap-2 text-ink-600"><MapPinIcon className="h-4 w-4 text-ink-400" aria-hidden="true" /> {selected.localGovernment || 'Commission-wide'}</p>
              <p className="flex items-center gap-2 text-ink-600"><EnvelopeIcon className="h-4 w-4 text-ink-400" aria-hidden="true" /> {selected.email || 'No email given'}</p>
              <p className="flex items-center gap-2 text-ink-600"><PhoneIcon className="h-4 w-4 text-ink-400" aria-hidden="true" /> {selected.phone || 'No phone given'}</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">What they wrote</p>
              <p className="whitespace-pre-wrap rounded-2xl border border-ink-100 bg-white p-4 text-[0.95rem] leading-relaxed text-ink-700">{selected.message}</p>
            </div>

            {selected.suggestedAction && (
              <div className="rounded-2xl bg-gold-50 p-4 ring-1 ring-gold-200">
                <p className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gold-600"><LightBulbIcon className="h-4 w-4" aria-hidden="true" /> What they’d like done</p>
                <p className="whitespace-pre-wrap text-[0.95rem] text-ink-700">{selected.suggestedAction}</p>
              </div>
            )}

            <div>
              <p className="mb-2 text-sm font-bold text-ink-700">Where does this stand?</p>
              <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Complaint status">
                {Object.entries(STATUSES).map(([key, s]) => {
                  const active = status === key;
                  return (
                    <button key={key} type="button" role="radio" aria-checked={active} onClick={() => setStatus(key)} className={clsx('flex items-start gap-3 rounded-xl p-3 text-left ring-1 transition-all', active ? 'bg-brand-50 ring-2 ring-brand-500' : 'bg-white ring-ink-100 hover:bg-ink-50/60')}>
                      <span className={clsx('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2', active ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-200')}>{active && <CheckIcon className="h-3 w-3" strokeWidth={3} />}</span>
                      <span><span className="block text-sm font-bold text-ink-900">{s.label}</span><span className="block text-xs text-ink-400">{s.help}</span></span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="complaint-note" className="mb-1.5 block text-sm font-bold text-ink-700">Notes for the team <span className="font-medium text-ink-400">(only staff can see these)</span></label>
              <textarea id="complaint-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What has been done, or what needs to happen next?" className="textarea" />
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
              <Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save'}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Complaints;
