import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { getEmployees, getEmployeeFilterOptions } from '../../../services/employeeService';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [warning, setWarning] = useState(null);
  const [scope, setScope] = useState(null);
  const [filterOptions, setFilterOptions] = useState({ departments: [], lgas: [] });
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [lga, setLga] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    getEmployeeFilterOptions()
      .then(setFilterOptions)
      .catch((err) => console.error('Failed to load employee filter options', err));
  }, []);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: pageSize };
      if (search.trim()) params.search = search.trim();
      if (department) params.department = department;
      if (lga) params.lga = lga;

      const res = await getEmployees(params);
      setEmployees(res.data || []);
      setMeta(res.meta || { total: 0, page, limit: pageSize });
      setWarning(res.warning || null);
      setScope(res.scope || null);
    } catch (err) {
      console.error('Failed to load employees', err);
      toast.error('Failed to load employees');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [search, department, lga, page]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const totalPages = Math.max(1, Math.ceil((meta.total || 0) / pageSize));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="heading-md">Employees{scope?.lgaName ? ` — ${scope.lgaName}` : ''}</h1>
        <p className="text-gov-gray-600 mt-1">
          Read-only view of staff records maintained by the Smart Onboarding system.
        </p>
      </header>

      {warning && (
        <Card className="p-4 bg-amber-50 border border-amber-200">
          <p className="text-sm text-amber-800">{warning}</p>
        </Card>
      )}
      {scope?.note && (
        <p className="text-xs text-gov-gray-500">{scope.note}</p>
      )}

      <Card className="p-6">
        <div className="flex flex-wrap items-end gap-3 mb-4">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              className="input w-full"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              placeholder="name or file number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select className="input" value={department} onChange={(e) => { setPage(1); setDepartment(e.target.value); }}>
              <option value="">All</option>
              {filterOptions.departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">LGA of Origin</label>
            <select className="input" value={lga} onChange={(e) => { setPage(1); setLga(e.target.value); }}>
              <option value="">All</option>
              {filterOptions.lgas.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <Button variant="secondary" onClick={fetchEmployees} disabled={loading}>Refresh</Button>
          </div>
        </div>

        {loading ? (
          <div className="py-6">
            <Skeleton rows={8} />
          </div>
        ) : employees.length === 0 ? (
          <div className="py-6">
            <EmptyState
              title="No employees found"
              description="No staff records match these filters, or none have been enrolled yet."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="text-left text-sm text-gov-gray-600">
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">File No.</th>
                  <th className="p-3 border-b">Department</th>
                  <th className="p-3 border-b">LGA of Origin</th>
                  <th className="p-3 border-b">Rank</th>
                  <th className="p-3 border-b">Station</th>
                  <th className="p-3 border-b">Verified</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="text-sm">
                    <td className="p-3 border-b">
                      <Link
                        to={`/dashboard/employees/${encodeURIComponent(emp.employee_id)}`}
                        className="text-gov-blue-600 hover:text-gov-blue-700 font-medium"
                      >
                        {emp.full_name}
                      </Link>
                    </td>
                    <td className="p-3 border-b">{emp.employee_id}</td>
                    <td className="p-3 border-b">{emp.department || '—'}</td>
                    <td className="p-3 border-b">{emp.lga_of_origin || '—'}</td>
                    <td className="p-3 border-b">{emp.rank || '—'}</td>
                    <td className="p-3 border-b">{emp.present_station || '—'}</td>
                    <td className="p-3 border-b">
                      <span className={
                        emp.is_verified
                          ? 'px-2 py-0.5 text-xs rounded bg-green-100 text-green-700'
                          : 'px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-700'
                      }>
                        {emp.is_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
          <span className="text-sm text-gov-gray-600">
            Page {meta.page || page} of {totalPages} &middot; {meta.total || 0} total
          </span>
          <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </Card>
    </div>
  );
};

export default Employees;
