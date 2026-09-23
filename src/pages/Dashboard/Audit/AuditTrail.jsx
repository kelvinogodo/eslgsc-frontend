import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../../components/portal/PageHeader';
import AuditTrailTable from '../../../components/dashboard/auditTrail/AuditTrailTable';
import AuditTrailDetailModal from '../../../components/dashboard/auditTrail/AuditTrailDetailModal';
import Pagination from '../../../components/ui/Pagination';
import { getAuditTrail, getAuditTrailFilterOptions } from '../../../services/auditTrailService';
import { describeTrailAction } from '../../../lib/activity';

const PAGE_SIZE = 25;
const ENTITY_LABEL = { employees: 'Staff records', users: 'Enrollment accounts' };

const AuditTrail = () => {
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const { data: options = { actions: [], entityTypes: [] } } = useQuery({ queryKey: ['auditTrail', 'options'], queryFn: getAuditTrailFilterOptions, staleTime: 10 * 60 * 1000 });

  const params = { page, limit: PAGE_SIZE, ...(action && { action }), ...(entityType && { entity_type: entityType }), ...(startDate && { startDate }), ...(endDate && { endDate: `${endDate}T23:59:59` }) };
  const { data, isLoading, isFetching } = useQuery({ queryKey: ['auditTrail', params], queryFn: () => getAuditTrail(params), placeholderData: (prev) => prev });

  const entries = data?.data || [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = Boolean(action || entityType || startDate || endDate);
  const on = (setter) => (v) => { setter(v); setPage(1); };
  const reset = () => { setAction(''); setEntityType(''); setStartDate(''); setEndDate(''); setPage(1); };

  return (
    <div>
      <PageHeader title="Enrollment Records Log" description="Sign-ins, enrolments, verifications and changes recorded by the staff enrollment system. Read-only." />

      <div className="card mb-5 p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[repeat(2,minmax(0,1fr))_repeat(2,minmax(0,0.7fr))_auto]">
          <select aria-label="Filter by what happened" value={action} onChange={(e) => on(setAction)(e.target.value)} className="select">
            <option value="">Everything that happened</option>
            {options.actions.map((a) => <option key={a} value={a}>{describeTrailAction(a)}</option>)}
          </select>
          <select aria-label="Filter by what it was about" value={entityType} onChange={(e) => on(setEntityType)(e.target.value)} className="select">
            <option value="">Anything</option>
            {options.entityTypes.map((t) => <option key={t} value={t}>{ENTITY_LABEL[t] || t}</option>)}
          </select>
          <input type="date" value={startDate} onChange={(e) => on(setStartDate)(e.target.value)} className="input" aria-label="From date" />
          <input type="date" value={endDate} onChange={(e) => on(setEndDate)(e.target.value)} className="input" aria-label="To date" />
          <button type="button" onClick={reset} disabled={!hasFilters} className="btn btn-ghost btn-md">Clear</button>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-ink-500" aria-live="polite">
        <span>{isLoading ? 'Loading…' : `${total.toLocaleString()} ${total === 1 ? 'record' : 'records'}`}</span>
        {isFetching && !isLoading && <ArrowPathIcon className="h-4 w-4 animate-spin text-ink-300" aria-label="Updating" />}
      </div>

      <div className="card"><AuditTrailTable entries={entries} isLoading={isLoading} onSelect={setSelected} /></div>
      {totalPages > 1 && <Pagination className="mt-6" currentPage={page} totalPages={totalPages} onPageChange={setPage} />}

      <AuditTrailDetailModal entry={selected} isOpen={Boolean(selected)} onClose={() => setSelected(null)} />
    </div>
  );
};

export default AuditTrail;
