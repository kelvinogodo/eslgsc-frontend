import EmptyState from '../../ui/EmptyState';
import Skeleton from '../../ui/Skeleton';
import { timeAgo, formatDateTime } from '../../../lib/utils';

const KIND = { news: 'News article', announcement: 'Announcement' };

/** Waiting-for-review list. `canDecide` only changes the button wording. */
const AuditQueueTable = ({ items = [], onReview, isLoading, canDecide = true }) => {
  if (isLoading) {
    return <div className="space-y-3 p-5">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>;
  }

  if (!items.length) {
    return (
      <div className="p-5">
        <EmptyState title="Nothing is waiting for review" description="New submissions will appear here." />
      </div>
    );
  }

  return (
    <ul className="divide-y divide-ink-100">
      {items.map((item) => {
        const kind = KIND[item.entityType] || 'Submission';
        return (
          <li key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[1.02rem] font-bold text-ink-900">{item.entityName || kind}</p>
              <p className="mt-0.5 text-sm text-ink-500">
                {kind} from {item.submittedByName || 'unknown'} ·{' '}
                <span title={formatDateTime(item.submittedAt)}>{timeAgo(item.submittedAt)}</span>
              </p>
            </div>
            <button type="button" onClick={() => onReview?.(item)} className={`btn btn-md ${canDecide ? 'btn-primary' : 'btn-outline'}`}>
              {canDecide ? 'Review' : 'View'}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default AuditQueueTable;
