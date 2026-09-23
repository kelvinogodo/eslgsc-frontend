import { Link } from 'react-router-dom';
import Skeleton from '../ui/Skeleton';
import { timeAgo, formatDateTime } from '../../lib/utils';

const KIND = { news: 'Article', announcement: 'Announcement' };

/** The first few approval-queue items, for the home page. */
const PendingList = ({ items = [], loading = false, limit = 5 }) => {
  if (loading) return <Skeleton rows={3} />;
  if (!items.length) return <p className="py-6 text-sm text-ink-400">Nothing is waiting for review.</p>;

  return (
    <>
      <ul className="divide-y divide-ink-100">
        {items.slice(0, limit).map((item) => (
          <li key={item.id} className="py-3">
            <p className="truncate font-bold text-ink-900">{item.entityName || KIND[item.entityType] || 'Submission'}</p>
            <p className="mt-0.5 text-xs text-ink-400">
              {KIND[item.entityType] || 'Submission'} from {item.submittedByName || 'unknown'} ·{' '}
              <span title={formatDateTime(item.submittedAt)}>{timeAgo(item.submittedAt)}</span>
            </p>
          </li>
        ))}
      </ul>
      <Link to="/dashboard/audit-queue" className="mt-2 inline-flex text-sm font-bold text-brand-700 hover:text-brand-800">
        {items.length > limit ? `See all ${items.length}` : 'Open approvals'}
      </Link>
    </>
  );
};

export default PendingList;
