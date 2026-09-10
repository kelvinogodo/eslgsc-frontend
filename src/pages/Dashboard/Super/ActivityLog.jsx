import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import ActivityLogTable from '../../../components/dashboard/activity/ActivityLogTable';
import ActivityDetailModal from '../../../components/dashboard/activity/ActivityDetailModal';
import { getActivityLog } from '../../../services/activityService';

const entityOptions = [
  { label: 'All entities', value: '' },
  { label: 'News', value: 'news' },
  { label: 'Announcements', value: 'announcement' },
  { label: 'Uploads', value: 'upload' }
];

const ActivityLog = () => {
  const [search, setSearch] = useState('');
  const [entityType, setEntityType] = useState('');
  const [actor, setActor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['activityLog'],
    queryFn: () => getActivityLog()
  });

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesEntity = entityType ? entry.entityType === entityType : true;
      const matchesActor = actor
        ? entry.actorName?.toLowerCase().includes(actor.toLowerCase()) || entry.actorId === actor
        : true;
      const matchesSearch = search
        ? [entry.action, entry.entityName, entry.details?.notes]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(search.toLowerCase()))
        : true;
      const matchesStart = startDate ? new Date(entry.timestamp) >= new Date(startDate) : true;
      const matchesEnd = endDate ? new Date(entry.timestamp) <= new Date(endDate) : true;
      return matchesEntity && matchesActor && matchesSearch && matchesStart && matchesEnd;
    });
  }, [entries, entityType, actor, search, startDate, endDate]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gov-gray-900">Activity log</h1>
        <p className="text-gov-gray-600 mt-1">
          End-to-end trail of administrative actions across the platform.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr]">
          <Input
            label="Search"
            placeholder="Search actions or entities"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Input
            label="Actor"
            placeholder="Name or ID"
            value={actor}
            onChange={(event) => setActor(event.target.value)}
          />
          <Select
            label="Entity"
            value={entityType}
            onChange={(event) => setEntityType(event.target.value)}
          >
            {entityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Input
            label="From"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
          <Input
            label="To"
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => {
              setSearch('');
              setActor('');
              setEntityType('');
              setStartDate('');
              setEndDate('');
            }}
          >
            Clear filters
          </Button>
        </div>
      </Card>

      <Card className="p-0">
        <ActivityLogTable
          entries={filteredEntries}
          isLoading={isLoading}
          onSelect={setSelectedEntry}
        />
      </Card>

      <ActivityDetailModal
        entry={selectedEntry}
        isOpen={Boolean(selectedEntry)}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
};

export default ActivityLog;
