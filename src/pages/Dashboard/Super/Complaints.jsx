import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PageHeader from '../../../components/portal/PageHeader';
import SegmentedControl from '../../../components/portal/SegmentedControl';
import SearchBox from '../../../components/portal/SearchBox';
import Modal from '../../../components/ui/Modal';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { getComplaints, updateComplaintStatus } from '../../../services/complaintService';
import { timeAgo, formatDateTime } from '../../../lib/utils';

const STATUSES = {
  NEW: { label: 'New', badge: 'blue', help: 'Not yet looked at' },
  IN_REVIEW: { label: 'In progress', badge: 'yellow', help: 'Being dealt with' },
  CLOSED: { label: 'Closed', badge: 'green', help: 'Resolved' }
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
      <PageHeader title="Complaints" description="Complaints and petitions sent in through the public website. Open one to read it, add notes and update its status." />

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
          <div className="p-5"><EmptyState title={complaints.length ? 'No complaints match' : 'No complaints yet'} description={complaints.length ? 'Try a different filter or search word.' : 'Complaints submitted on the website will appear here.'} /></div>
        ) : (
          <ul className="divide-y divide-ink-100">
            {visible.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => open(c)} className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-ink-50">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-ink-900">{c.subject || 'No subject'}</span>
                    <span className="mt-0.5 block truncate text-sm text-ink-500">{c.fullName} · {pretty(c.category)}{c.localGovernment ? ` · ${c.localGovernment}` : ''}</span>
                  </span>
                  <span className="hidden text-xs font-semibold text-ink-400 sm:block" title={formatDateTime(c.createdAt)}>{timeAgo(c.createdAt)}</span>
                  <Badge variant={STATUSES[c.status]?.badge || 'gray'}>{STATUSES[c.status]?.label || c.status}</Badge>
                </button>
              </li>
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

            <dl className="grid gap-x-6 gap-y-3 rounded-2xl bg-ink-50/70 p-4 text-sm sm:grid-cols-2">
              <div><dt className="text-xs text-ink-400">From</dt><dd className="font-bold text-ink-900">{selected.fullName}</dd></div>
              <div><dt className="text-xs text-ink-400">Local government</dt><dd className="text-ink-700">{selected.localGovernment || 'Not given'}</dd></div>
              <div><dt className="text-xs text-ink-400">Email</dt><dd className="break-all text-ink-700">{selected.email || 'Not given'}</dd></div>
              <div><dt className="text-xs text-ink-400">Phone</dt><dd className="text-ink-700">{selected.phone || 'Not given'}</dd></div>
            </dl>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">Message</p>
              <p className="whitespace-pre-wrap rounded-2xl border border-ink-100 bg-white p-4 text-[0.95rem] leading-relaxed text-ink-700">{selected.message}</p>
            </div>

            {selected.suggestedAction && (
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">What they’d like done</p>
                <p className="whitespace-pre-wrap rounded-2xl border border-ink-100 bg-white p-4 text-[0.95rem] leading-relaxed text-ink-700">{selected.suggestedAction}</p>
              </div>
            )}

            <div>
              <p className="mb-2 text-sm font-bold text-ink-700">Status</p>
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
