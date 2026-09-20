import { Link } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import EmptyState from '../ui/EmptyState';
import Skeleton from '../ui/Skeleton';
import Avatar from './Avatar';
import { Stagger, Item } from './motion';
import { describeActivity, activityTone } from '../../lib/activity';
import { timeAgo } from '../../lib/utils';

/** A readable "who did what, when" list. Pass `to` to show a "See everything" link. */
const ActivityFeed = ({ entries = [], loading = false, limit = 6, to, className }) => (
  <div className={className}>
    {loading ? (
      <Skeleton rows={limit} />
    ) : entries.length === 0 ? (
      <EmptyState icon={ClockIcon} title="Nothing yet" description="As people use the portal, their actions will show up here." />
    ) : (
      <Stagger as="ul" className="space-y-1" stagger={0.05}>
        {entries.slice(0, limit).map((a, i) => {
          const d = describeActivity(a);
          return (
            <Item as="li" key={a.id || i} className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-ink-50/70">
              <span className="relative">
                <Avatar name={d.actor} size="sm" />
                <span className={clsx('absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white', activityTone(a))} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.92rem] leading-snug text-ink-700">
                  <span className="font-bold text-ink-900">{d.actor}</span> {d.text}
                </p>
                <p className="mt-0.5 text-xs text-ink-400">{timeAgo(a.timestamp || a.created_at)}</p>
              </div>
            </Item>
          );
        })}
      </Stagger>
    )}
    {to && entries.length > 0 && (
      <Link to={to} className="mt-3 inline-flex text-sm font-bold text-brand-700 hover:text-brand-800">See everything →</Link>
    )}
  </div>
);

export default ActivityFeed;
