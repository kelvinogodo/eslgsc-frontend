import { FingerPrintIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import EmptyState from '../../ui/EmptyState';
import Skeleton from '../../ui/Skeleton';
import { describeTrailAction, trailTone } from '../../../lib/activity';
import { timeAgo, formatDateTime } from '../../../lib/utils';

const dot = { red: 'bg-red-400', green: 'bg-brand-500', gold: 'bg-gold-400', gray: 'bg-ink-300' };
const ENTITY = { employees: 'staff record', users: 'enrollment account' };

/** One line per event from the staff enrollment system, worded for people, not databases. */
const AuditTrailTable = ({ entries = [], onSelect, isLoading }) => {
  if (isLoading) {
    return <div className="space-y-3 p-5">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>;
  }
  if (!entries.length) {
    return <div className="p-5"><EmptyState icon={FingerPrintIcon} title="No records found" description="Nothing matches those filters. Try widening the dates or choosing “Everything”." /></div>;
  }

  return (
    <ul className="divide-y divide-ink-100">
      {entries.map((e, i) => (
        <motion.li key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: Math.min(i * 0.015, 0.25) }}>
          <button type="button" onClick={() => onSelect?.(e)} className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-brand-50/50">
            <span className={clsx('h-3 w-3 shrink-0 rounded-full', dot[trailTone(e.action)])} aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block font-bold text-ink-900">{describeTrailAction(e.action)}</span>
              <span className="mt-0.5 block truncate text-xs text-ink-400">
                {ENTITY[e.entity_type] || e.entity_type || 'system'}{e.ip_address ? ` · from ${e.ip_address}` : ''}
              </span>
            </span>
            <span className="hidden text-xs font-semibold text-ink-400 sm:block" title={formatDateTime(e.created_at)}>{timeAgo(e.created_at)}</span>
            <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink-300" aria-hidden="true" />
          </button>
        </motion.li>
      ))}
    </ul>
  );
};

export default AuditTrailTable;
