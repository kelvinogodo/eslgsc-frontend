import { Link } from 'react-router-dom';
import Skeleton from '../ui/Skeleton';
import Avatar from './Avatar';
import { describeActivity } from '../../lib/activity';
import { timeAgo, formatDateTime } from '../../lib/utils';

/** Short "who did what, when" list. Pass `to` to link to the full history. */
const ActivityFeed = ({ entries = [], loading = false, limit = 6, to, className }) => (
  <div className={className}>
    {loading ? (
      <Skeleton rows={limit} />
    ) : entries.length === 0 ? (
      <p className="py-6 text-sm text-ink-400">No activity recorded yet.</p>
    ) : (
      <ul className="divide-y divide-ink-100">
        {entries.slice(0, limit).map((a, i) => {
          const d = describeActivity(a);
          const when = a.timestamp || a.created_at;
          return (
            <li key={a.id || i} className="flex items-start gap-3 py-3">
              <Avatar name={d.actor} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-[0.92rem] leading-snug text-ink-700">
                  <span className="font-bold text-ink-900">{d.actor}</span> {d.text}
                </p>
                <p className="mt-0.5 text-xs text-ink-400" title={formatDateTime(when)}>{timeAgo(when)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    )}
    {to && entries.length > 0 && (
      <Link to={to} className="mt-2 inline-flex text-sm font-bold text-brand-700 hover:text-brand-800">View all activity</Link>
    )}
  </div>
);

export default ActivityFeed;
