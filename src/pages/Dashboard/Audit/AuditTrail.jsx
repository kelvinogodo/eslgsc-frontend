import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import AuditTrailTable from '../../../components/dashboard/auditTrail/AuditTrailTable';
import AuditTrailDetailModal from '../../../components/dashboard/auditTrail/AuditTrailDetailModal';
import { getAuditTrail, getAuditTrailFilterOptions } from '../../../services/auditTrailService';

const AuditTrail = () => {
  const [entries, setEntries] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 50 });
  const [filterOptions, setFilterOptions] = useState({ actions: [], entityTypes: [] });
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const pageSize = 50;

  useEffect(() => {
    getAuditTrailFilterOptions()
      .then(setFilterOptions)
      .catch((err) => console.error('Failed to load audit trail filter options', err));
  }, []);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: pageSize };
      if (action) params.action = action;
      if (entityType) params.entity_type = entityType;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await getAuditTrail(params);
      setEntries(res.data || []);
      setMeta(res.meta || { total: 0, page, limit: pageSize });
    } catch (err) {
      console.error('Failed to load audit trail', err);
      toast.error('Failed to load Smart Onboarding audit trail');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [action, entityType, startDate, endDate, page]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const totalPages = Math.max(1, Math.ceil((meta.total || 0) / pageSize));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gov-gray-900">Onboarding Audit Trail</h1>
        <p className="text-gov-gray-600 mt-1">
          Read-only view of the Smart Onboarding system&apos;s own action log — enrollments, verifications, logins.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr]">
          <Select label="Action" value={action} onChange={(e) => { setPage(1); setAction(e.target.value); }}>
            <option value="">All actions</option>
            {filterOptions.actions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </Select>
          <Select label="Entity" value={entityType} onChange={(e) => { setPage(1); setEntityType(e.target.value); }}>
            <option value="">All entities</option>
            {filterOptions.entityTypes.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </Select>
          <Input label="From" type="date" value={startDate} onChange={(e) => { setPage(1); setStartDate(e.target.value); }} />
          <Input label="To" type="date" value={endDate} onChange={(e) => { setPage(1); setEndDate(e.target.value); }} />
        </div>
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => { setAction(''); setEntityType(''); setStartDate(''); setEndDate(''); setPage(1); }}
          >
            Clear filters
          </Button>
        </div>
      </Card>

      <Card className="p-0">
        <AuditTrailTable entries={entries} isLoading={loading} onSelect={setSelectedEntry} />
      </Card>

      <div className="flex items-center gap-2">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
        <span className="text-sm text-gov-gray-600">
          Page {meta.page || page} of {totalPages} &middot; {meta.total || 0} total
        </span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>

      <AuditTrailDetailModal
        entry={selectedEntry}
        isOpen={Boolean(selectedEntry)}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
};

export default AuditTrail;
