import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../../../components/portal/PageHeader';
import SearchBox from '../../../components/portal/SearchBox';
import ActivityLogTable from '../../../components/dashboard/activity/ActivityLogTable';
import ActivityDetailModal from '../../../components/dashboard/activity/ActivityDetailModal';
import Pagination from '../../../components/ui/Pagination';
import { getActivityLog } from '../../../services/activityService';
import { describeActivity } from '../../../lib/activity';

const PAGE_SIZE = 25;
const ENTITIES = [
  { label: 'Everything', value: '' },
  { label: 'Articles', value: 'news' },
  { label: 'Announcements', value: 'announcement' },
  { label: 'Complaints', value: 'complaint' },
  { label: 'Documents', value: 'upload' },
  { label: 'People', value: 'User' }
];

const ActivityLog = () => {
  const [search, setSearch] = useState('');
  const [entityType, setEntityType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const { data: entries = [], isLoading } = useQuery({ queryKey: ['activityLog'], queryFn: () => getActivityLog() });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const from = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const to = endDate ? new Date(`${endDate}T23:59:59`) : null;
    return entries.filter((e) => {
      if (entityType && e.entityType?.toLowerCase() !== entityType.toLowerCase()) return false;
      const when = new Date(e.timestamp);
      if (from && when < from) return false;
      if (to && when > to) return false;
      if (q) {
        const d = describeActivity(e);
        if (!`${d.actor} ${d.text} ${e.action} ${e.entityName}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [entries, search, entityType, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = Boolean(search || entityType || startDate || endDate);
  const reset = () => { setSearch(''); setEntityType(''); setStartDate(''); setEndDate(''); setPage(1); };
  const on = (setter) => (v) => { setter(v); setPage(1); };

  return (
    <div>
      <PageHeader title="Activity History" description="Who did what in the portal, and when. Entries can’t be edited or deleted." />

      <div className="card mb-5 p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_repeat(2,minmax(0,0.7fr))_auto]">
          <SearchBox value={search} onChange={on(setSearch)} placeholder="Search by person or action" />
          <select aria-label="Filter by type" value={entityType} onChange={(e) => on(setEntityType)(e.target.value)} className="select">
            {ENTITIES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <label className="block"><span className="sr-only">From date</span><input type="date" value={startDate} onChange={(e) => on(setStartDate)(e.target.value)} className="input" aria-label="From date" /></label>
          <label className="block"><span className="sr-only">To date</span><input type="date" value={endDate} onChange={(e) => on(setEndDate)(e.target.value)} className="input" aria-label="To date" /></label>
          <button type="button" onClick={reset} disabled={!hasFilters} className="btn btn-ghost btn-md">Clear</button>
        </div>
      </div>

      <p className="mb-3 text-sm font-semibold text-ink-500" aria-live="polite">{isLoading ? 'Loading…' : `${filtered.length.toLocaleString()} ${filtered.length === 1 ? 'entry' : 'entries'}`}</p>

      <div className="card"><ActivityLogTable entries={pageItems} isLoading={isLoading} onSelect={setSelected} /></div>
      {totalPages > 1 && <Pagination className="mt-6" currentPage={page} totalPages={totalPages} onPageChange={setPage} />}

      <ActivityDetailModal entry={selected} isOpen={Boolean(selected)} onClose={() => setSelected(null)} />
    </div>
  );
};

export default ActivityLog;
