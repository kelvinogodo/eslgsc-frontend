import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { IdentificationIcon, InformationCircleIcon, CheckBadgeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../../components/portal/PageHeader';
import SearchBox from '../../../components/portal/SearchBox';
import Avatar from '../../../components/portal/Avatar';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import Pagination from '../../../components/ui/Pagination';
import useDebouncedValue from '../../../hooks/useDebouncedValue';
import { getEmployees, getEmployeeFilterOptions } from '../../../services/employeeService';

const PAGE_SIZE = 20;

const StaffPhoto = ({ emp }) => {
  const [broken, setBroken] = useState(false);
  if (!emp.photo_url || broken) return <Avatar name={emp.full_name?.trim()} />;
  return <img src={emp.photo_url} alt="" loading="lazy" onError={() => setBroken(true)} className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white" />;
};

const StatusBadges = ({ emp }) => (
  <div className="flex flex-wrap gap-1.5">
    {emp.is_verified ? <Badge variant="green">Verified</Badge> : <Badge variant="yellow">Not yet verified</Badge>}
    {emp.employment_status && emp.employment_status !== 'active' && <Badge variant="gray" className="capitalize">{emp.employment_status}</Badge>}
  </div>
);

const Employees = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [lga, setLga] = useState('');
  const [page, setPage] = useState(1);
  const q = useDebouncedValue(search);

  const { data: options = { departments: [], lgas: [] } } = useQuery({ queryKey: ['employees', 'options'], queryFn: getEmployeeFilterOptions, staleTime: 10 * 60 * 1000 });

  const params = { page, limit: PAGE_SIZE, ...(q.trim() && { search: q.trim() }), ...(department && { department }), ...(lga && { lga }) };
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['employees', 'list', params],
    queryFn: () => getEmployees(params),
    placeholderData: (prev) => prev
  });

  const employees = data?.data || [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const scope = data?.scope;
  const filtered = Boolean(q.trim() || department || lga);
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  const reset = () => { setSearch(''); setDepartment(''); setLga(''); setPage(1); };

  return (
    <div>
      <PageHeader
        icon={IdentificationIcon}
        title={scope?.lgaName ? `Staff in ${scope.lgaName}` : 'Staff Records'}
        description="Find anyone enrolled in the staff enrollment system. You can look at records here, but not change them."
      />

      {data?.warning && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl bg-gold-50 p-4 ring-1 ring-gold-200">
          <InformationCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
          <p className="text-sm font-semibold text-ink-700">{data.warning}</p>
        </div>
      )}

      <div className="card mb-5 p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto]">
          <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name or file number" label="Search staff" />
          <select aria-label="Filter by department" value={department} onChange={(e) => { setDepartment(e.target.value); setPage(1); }} className="select">
            <option value="">Every department</option>
            {options.departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select aria-label="Filter by local government of origin" value={lga} onChange={(e) => { setLga(e.target.value); setPage(1); }} className="select">
            <option value="">Every origin LGA</option>
            {options.lgas.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <button type="button" onClick={reset} disabled={!filtered} className="btn btn-ghost btn-md">Clear</button>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-ink-500" aria-live="polite">
        <span>{isLoading ? 'Loading…' : total === 0 ? 'No matches' : `Showing ${from}–${to} of ${total.toLocaleString()}`}</span>
        {isFetching && !isLoading && <ArrowPathIcon className="h-4 w-4 animate-spin text-ink-300" aria-label="Updating" />}
      </div>

      <div className="card">
        {isLoading ? (
          <div className="space-y-4 p-6">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
        ) : isError ? (
          <div className="p-6"><EmptyState title="We couldn’t load staff records" description="Please check your connection and try again." action={<button type="button" onClick={() => refetch()} className="btn btn-primary btn-md">Try again</button>} /></div>
        ) : employees.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={IdentificationIcon}
              title={filtered ? 'No staff match that' : 'No staff records to show'}
              description={filtered ? 'Check the spelling, or try fewer filters.' : 'Records appear here once staff have been enrolled.'}
              action={filtered && <button type="button" onClick={reset} className="btn btn-outline btn-md">Clear search and filters</button>}
            />
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="table-head">Staff member</th>
                    <th className="table-head">Department</th>
                    <th className="table-head">Rank</th>
                    <th className="table-head">Posted to</th>
                    <th className="table-head">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {employees.map((emp, i) => (
                    <motion.tr
                      key={emp.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
                      onClick={() => navigate(`/dashboard/employees/${encodeURIComponent(emp.employee_id)}`)}
                      className="cursor-pointer"
                    >
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <StaffPhoto emp={emp} />
                          <div className="min-w-0">
                            <Link to={`/dashboard/employees/${encodeURIComponent(emp.employee_id)}`} onClick={(e) => e.stopPropagation()} className="block truncate font-bold text-ink-900 hover:text-brand-700">
                              {emp.full_name?.trim()}
                            </Link>
                            <p className="truncate font-mono text-xs text-ink-400">{emp.employee_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell max-w-[14rem]"><span className="line-clamp-2">{emp.department || '—'}</span></td>
                      <td className="table-cell max-w-[12rem]"><span className="line-clamp-2">{emp.rank || '—'}</span>{emp.grade_level && <span className="block text-xs text-ink-400">{emp.grade_level}</span>}</td>
                      <td className="table-cell max-w-[13rem]"><span className="line-clamp-2">{emp.present_station || '—'}</span></td>
                      <td className="table-cell"><StatusBadges emp={emp} /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phone cards */}
            <ul className="divide-y divide-ink-100 md:hidden">
              {employees.map((emp) => (
                <li key={emp.id}>
                  <Link to={`/dashboard/employees/${encodeURIComponent(emp.employee_id)}`} className="flex gap-3 p-4 active:bg-brand-50">
                    <StaffPhoto emp={emp} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-ink-900">{emp.full_name?.trim()}</p>
                      <p className="truncate font-mono text-xs text-ink-400">{emp.employee_id}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-ink-600">{emp.rank} · {emp.present_station}</p>
                      <div className="mt-2"><StatusBadges emp={emp} /></div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {totalPages > 1 && <Pagination className="mt-6" currentPage={page} totalPages={totalPages} onPageChange={setPage} />}

      {scope?.note && (
        <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-ink-400">
          <CheckBadgeIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {scope.note}
        </p>
      )}
    </div>
  );
};

export default Employees;
