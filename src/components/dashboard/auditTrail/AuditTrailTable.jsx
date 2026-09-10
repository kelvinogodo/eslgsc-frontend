import Table from '../../ui/Table';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import EmptyState from '../../ui/EmptyState';
import Skeleton from '../../ui/Skeleton';
import { formatDate } from '../../../lib/utils';

const entityVariant = {
  employees: 'green',
  users: 'blue',
};

const AuditTrailTable = ({ entries = [], onSelect, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton rows={6} />
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="p-4">
        <EmptyState title="No activity" description="No Smart Onboarding activity found for the selected filters." />
      </div>
    );
  }

  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Action</Table.HeaderCell>
          <Table.HeaderCell>Entity</Table.HeaderCell>
          <Table.HeaderCell>IP Address</Table.HeaderCell>
          <Table.HeaderCell>Timestamp</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Details</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {entries.map((entry) => (
          <Table.Row key={entry.id}>
            <Table.Cell>
              <p className="font-medium text-gov-gray-900">{entry.action}</p>
            </Table.Cell>
            <Table.Cell>
              <div className="space-y-1">
                {entry.entity_type && (
                  <Badge variant={entityVariant[entry.entity_type] || 'gray'}>
                    {entry.entity_type}
                  </Badge>
                )}
                <p className="text-xs text-gov-gray-500">{entry.entity_id || '—'}</p>
              </div>
            </Table.Cell>
            <Table.Cell>{entry.ip_address || '—'}</Table.Cell>
            <Table.Cell>{formatDate(entry.created_at)}</Table.Cell>
            <Table.Cell className="text-right">
              <Button size="sm" variant="outline" onClick={() => onSelect?.(entry)}>
                View
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default AuditTrailTable;
