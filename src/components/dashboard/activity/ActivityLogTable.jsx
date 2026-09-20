import { ClockIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import EmptyState from '../../ui/EmptyState';
import Skeleton from '../../ui/Skeleton';
import Avatar from '../../portal/Avatar';
import { describeActivity, activityTone } from '../../../lib/activity';
import { timeAgo, formatDateTime } from '../../../lib/utils';
import { EASE } from '../../portal/motionVariants';

/** "Who did what, when" — each row reads as a sentence; click for the full details. */
const ActivityLogTable = ({ entries = [], onSelect, isLoading }) => {
  if (isLoading) {
    return <div className="space-y-3 p-5">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>;
  }

  if (!entries.length) {
    return <div className="p-5"><EmptyState icon={ClockIcon} title="No activity found" description="Nothing matches those filters. Try widening the dates or clearing the search." /></div>;
  }

  return (
    <ul className="divide-y divide-ink-100">
      {entries.map((entry, i) => {
        const d = describeActivity(entry);
        return (
          <motion.li key={entry.id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.25), ease: EASE }}>
            <button type="button" onClick={() => onSelect?.(entry)} className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-brand-50/50">
              <span className="relative shrink-0">
                <Avatar name={d.actor} />
                <span className={clsx('absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-white', activityTone(entry))} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.95rem] leading-snug text-ink-700"><span className="font-extrabold text-ink-900">{d.actor}</span> {d.text}</span>
                <span className="mt-0.5 block text-xs text-ink-400" title={formatDateTime(entry.timestamp)}>{timeAgo(entry.timestamp)}</span>
              </span>
              <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink-300" aria-hidden="true" />
            </button>
          </motion.li>
        );
      })}
    </ul>
  );
};

export default ActivityLogTable;
