import { NewspaperIcon, MegaphoneIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import EmptyState from '../../ui/EmptyState';
import Skeleton from '../../ui/Skeleton';
import Avatar from '../../portal/Avatar';
import { timeAgo, formatDateTime } from '../../../lib/utils';
import { EASE } from '../../portal/motionVariants';

const kinds = {
  news: { label: 'News article', icon: NewspaperIcon },
  announcement: { label: 'Announcement', icon: MegaphoneIcon }
};

/** Waiting-for-review list. `canDecide` only changes the button wording. */
const AuditQueueTable = ({ items = [], onReview, isLoading, canDecide = true }) => {
  if (isLoading) {
    return <div className="space-y-3 p-5">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>;
  }

  if (!items.length) {
    return (
      <div className="p-5">
        <EmptyState icon={ClipboardDocumentCheckIcon} title="Nothing is waiting for review" description="You’re all caught up. New submissions will show up here as soon as someone sends them." />
      </div>
    );
  }

  return (
    <ul className="divide-y divide-ink-100">
      {items.map((item, i) => {
        const kind = kinds[item.entityType] || { label: 'Submission', icon: ClipboardDocumentCheckIcon };
        const Icon = kind.icon;
        return (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3), ease: EASE }}
            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-100 text-gold-600"><Icon className="h-6 w-6" aria-hidden="true" /></span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[1.02rem] font-extrabold text-ink-900">{item.entityName || kind.label}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-500">
                <span className="font-semibold text-gold-600">{kind.label}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5"><Avatar name={item.submittedByName} size="sm" className="!h-5 !w-5 !text-[0.6rem]" /> {item.submittedByName || 'Unknown'}</span>
                <span aria-hidden="true">·</span>
                <span title={formatDateTime(item.submittedAt)}>{timeAgo(item.submittedAt)}</span>
              </p>
            </div>
            <button type="button" onClick={() => onReview?.(item)} className={`btn btn-md ${canDecide ? 'btn-primary' : 'btn-outline'}`}>
              {canDecide ? 'Review' : 'View'}
            </button>
          </motion.li>
        );
      })}
    </ul>
  );
};

export default AuditQueueTable;
