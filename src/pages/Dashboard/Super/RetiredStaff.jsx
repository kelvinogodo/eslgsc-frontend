import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArchiveBoxIcon, ChevronRightIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../../components/portal/PageHeader';
import SearchBox from '../../../components/portal/SearchBox';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import Pagination from '../../../components/ui/Pagination';
import { Stagger, Item } from '../../../components/portal/motion';
import { getRetiredStaff } from '../../../services/employeeService';
import useDebouncedValue from '../../../hooks/useDebouncedValue';
import { fmtDate, humanSpan, span, todayDate } from '../../../lib/retirement';

const LIMIT = 20;
const titleCase = (s) => (s || '').trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const RetiredStaff = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const q = useDebouncedValue(search);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['employees', 'retired', q, page],
    queryFn: () => getRetiredStaff({ search: q || undefined, page, limit: LIMIT }),
    placeholderData: (prev) => prev
  });
  const rows = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div>
      <PageHeader
        icon={ArchiveBoxIcon}
        title="Retired Staff"
        description="Staff whose retirement date has passed — the earlier of 60 years of age or 35 years of service — most recent first."
      />

      <div className="mb-5">
        <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name or file number" label="Search retired staff" className="max-w-xl" />
      </div>

      {isLoading ? (
        <div className="space-y-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
      ) : isError ? (
        <div className="card p-6"><EmptyState title="We couldn’t load this list" description="Please check your connection and try again." /></div>
      ) : rows.length === 0 ? (
        <div className="card p-6">
          <EmptyState
            title={q ? 'No retired staff match your search' : 'No one has retired yet'}
            description={q ? 'Try a different name or file number.' : 'Staff will appear here once their retirement date has passed.'}
          />
        </div>
      ) : (
        <>
          <p className="mb-3 text-sm font-semibold text-ink-500">{total} retired {total === 1 ? 'person' : 'people'}{q ? ' match your search' : ''}</p>
          <Stagger key={`${q}-${page}`} className="space-y-3" stagger={0.03}>
            {rows.map((r) => (
              <Item key={r.employee_id}>
                <Link to={`/dashboard/employees/${encodeURIComponent(r.employee_id)}`} className="card group flex items-center gap-4 p-4 transition-shadow hover:shadow-lg sm:p-5">
                  {r.photo_url ? (
                    <img src={r.photo_url} alt="" className="h-14 w-14 shrink-0 rounded-2xl object-cover" loading="lazy" decoding="async" />
                  ) : (
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink-50 text-ink-300"><UserCircleIcon className="h-9 w-9" aria-hidden="true" /></span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-extrabold text-ink-900">{r.full_name?.trim()}</p>
                    <p className="truncate text-sm text-ink-500">{[titleCase(r.rank), r.present_station].filter(Boolean).join(' · ')}</p>
                    <p className="font-mono text-xs text-ink-400">{r.employee_id}</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Retired on</p>
                    <p className="font-bold text-ink-900">{fmtDate(r.retirement_date_calc) || 'Date unknown'}</p>
                    {r.retirement_date_calc && <p className="text-xs text-ink-500">{humanSpan(span(r.retirement_date_calc, todayDate()))} ago</p>}
                  </div>
                  <div className="hidden text-right md:block">
                    <Badge variant="gray">{r.retirement_basis === 'service' ? '35 years’ service' : 'Age 60'}</Badge>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </Item>
            ))}
          </Stagger>
          {totalPages > 1 && <Pagination className="mt-6" currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
          <p className="mt-6 text-xs text-ink-400">
            The staff enrollment system may still list these people as active; that record can’t be changed from this portal.
          </p>
        </>
      )}
    </div>
  );
};

export default RetiredStaff;
