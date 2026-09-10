import { formatDistanceToNow } from 'date-fns';
import Table from '../../ui/Table';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import Skeleton from '../../ui/Skeleton';
import { AUDIT_STATUS } from '../../../lib/constants';

const entityLabels = {
  news: 'News Article',
  announcement: 'Public Announcement'
};

const statusVariantMap = {
  [AUDIT_STATUS.PENDING]: 'yellow',
  [AUDIT_STATUS.APPROVED]: 'green',
  [AUDIT_STATUS.REJECTED]: 'red'
};

const AuditQueueTable = ({ items = [], onReview, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton rows={4} />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="p-4">
        <EmptyState title="No pending approvals" description="You're all caught up. New submissions will appear here for review." />
      </div>
    );
  }

  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Item</Table.HeaderCell>
          <Table.HeaderCell>Submitted By</Table.HeaderCell>
          <Table.HeaderCell>Submitted</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Action</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {items.map((item) => (
          <Table.Row key={item.id}>
            <Table.Cell>
              <div className="space-y-1">
                <p className="font-medium text-gov-gray-900">
                  {item.entityName || entityLabels[item.entityType]}
                </p>
                <p className="text-xs text-gov-gray-500">
                  {entityLabels[item.entityType] || 'Submission'}
                </p>
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gov-gray-900">
                  {item.submittedByName || 'Unknown'}
                </p>
                <p className="text-xs text-gov-gray-500">ID: {item.submittedById || '—'}</p>
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="space-y-1">
                <p className="text-sm text-gov-gray-700">
                  {formatDistanceToNow(new Date(item.submittedAt), { addSuffix: true })}
                </p>
                <p className="text-xs text-gov-gray-500">
                  {new Date(item.submittedAt).toLocaleString()}
                </p>
              </div>
            </Table.Cell>
            <Table.Cell>
              <Badge variant={statusVariantMap[item.status] || 'blue'}>
                {item.status}
              </Badge>
            </Table.Cell>
            <Table.Cell className="text-right">
              <Button size="sm" onClick={() => onReview?.(item)}>
                Review
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default AuditQueueTable;
