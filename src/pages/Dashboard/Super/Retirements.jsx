import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ClockIcon, ChevronRightIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../../components/portal/PageHeader';
import SegmentedControl from '../../../components/portal/SegmentedControl';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { Stagger, Item } from '../../../components/portal/motion';
import { getUpcomingRetirements } from '../../../services/employeeService';
import { fmtDate, daysUntil, humanSpan, span, todayDate } from '../../../lib/retirement';

const titleCase = (s) => (s || '').trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const PAGE = 20;

const Retirements = () => {
  const [months, setMonths] = useState(4);
  // Show the first page of people (and so of photos); load more only on request.
  const [shown, setShown] = useState(PAGE);
  const changeMonths = (m) => { setMonths(m); setShown(PAGE); };
  const { data, isLoading, isError } = useQuery({
    queryKey: ['employees', 'retirements', months],
    queryFn: () => getUpcomingRetirements(months)
  });
  const allRows = data?.data ?? [];
  const rows = allRows.slice(0, shown);
  const overdue = data?.meta?.overdue ?? 0;

  return (
    <div>
      <PageHeader
        icon={ClockIcon}
        title="Upcoming Retirements"
        description="Staff who will reach 60 years of age or 35 years of service within the next few months. Their retirement leave starts 3 months before their retirement date."
        actions={
          <SegmentedControl
            label="Look ahead"
            value={months}
            onChange={changeMonths}
            options={[{ value: 4, label: '4 months' }, { value: 6, label: '6 months' }, { value: 12, label: '12 months' }]}
          />
        }
      />

      {overdue > 0 && (
        <div className="mb-5 rounded-2xl border border-gold-200 bg-gold-50 px-5 py-3 text-sm font-semibold text-ink-800">
          {overdue} active staff {overdue === 1 ? 'is' : 'are'} already past their calculated retirement date. <Link to="/dashboard/retired" className="font-extrabold text-brand-700 underline underline-offset-2">See who has already retired</Link>.
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
      ) : isError ? (
        <div className="card p-6"><EmptyState title="We couldn’t load this list" description="Please check your connection and try again." /></div>
      ) : allRows.length === 0 ? (
        <div className="card p-6"><EmptyState title="No one is retiring in this period" description={`Nobody reaches 60 years of age or 35 years of service in the next ${months} months.`} /></div>
      ) : (
        <>
          <p className="mb-3 text-sm font-semibold text-ink-500">{allRows.length} {allRows.length === 1 ? 'person' : 'people'} retiring in the next {months} months</p>
          <Stagger className="space-y-3" stagger={0.03}>
            {rows.map((r) => {
              const left = daysUntil(r.retirement_leave_date);
              const onLeave = left <= 0;
              return (
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
                      <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Retires</p>
                      <p className="font-bold text-ink-900">{fmtDate(r.retirement_date_calc)}</p>
                      <p className="text-xs text-ink-500">{daysUntil(r.retirement_date_calc) <= 0 ? 'today' : `in ${humanSpan(span(todayDate(), r.retirement_date_calc))}`}</p>
                    </div>
                    <div className="hidden text-right md:block">
                      <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Leave</p>
                      <Badge variant={onLeave ? 'yellow' : 'gray'}>{onLeave ? 'On leave' : fmtDate(r.retirement_leave_date)}</Badge>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </Item>
              );
            })}
          </Stagger>
          {allRows.length > shown && (
            <div className="mt-5 text-center">
              <button type="button" onClick={() => setShown((n) => n + PAGE)} className="btn btn-outline btn-md">
                Show {Math.min(PAGE, allRows.length - shown)} more ({allRows.length - shown} left)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Retirements;
