import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { NewspaperIcon, ArrowTopRightOnSquareIcon, TrashIcon, PhotoIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import PageHeader from '../../../components/portal/PageHeader';
import SegmentedControl from '../../../components/portal/SegmentedControl';
import SearchBox from '../../../components/portal/SearchBox';
import ConfirmDialog from '../../../components/portal/ConfirmDialog';
import Avatar from '../../../components/portal/Avatar';
import AuditDetailModal from '../../../components/dashboard/audit/AuditDetailModal';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { getAllNews, approveNews, rejectNews, deleteNews } from '../../../services/newsService';
import { NEWS_STATUS } from '../../../lib/constants';
import { categoryLabel } from '../../../lib/article';
import { timeAgo, formatDateTime } from '../../../lib/utils';
import { EASE } from '../../../components/portal/motionVariants';

const NewsModeration = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const { data: pending = [], isLoading: loadingPending } = useQuery({ queryKey: ['news', 'pending'], queryFn: () => getAllNews({ status: NEWS_STATUS.PENDING }) });
  const { data: published = [], isLoading: loadingPublished } = useQuery({ queryKey: ['news', 'published'], queryFn: () => getAllNews({ status: NEWS_STATUS.PUBLISHED }) });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['news'] });
    queryClient.invalidateQueries({ queryKey: ['auditQueue'] });
    queryClient.invalidateQueries({ queryKey: ['activityLog'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'notifications'] });
  };

  const approve = useMutation({
    mutationFn: (notes) => approveNews(selected.id, { notes }),
    onSuccess: () => { toast.success('Approved — it’s now live on the website'); invalidate(); setSelected(null); },
    onError: (e) => toast.error(e?.response?.data?.message || 'We couldn’t approve that article.')
  });
  const reject = useMutation({
    mutationFn: (notes) => rejectNews(selected.id, { notes }),
    onSuccess: () => { toast.info('Sent back to the writer with your feedback'); invalidate(); setSelected(null); },
    onError: (e) => toast.error(e?.response?.data?.message || 'We couldn’t send that back.')
  });
  const remove = useMutation({
    mutationFn: (id) => deleteNews(id),
    onSuccess: () => { toast.success('Article deleted'); setToDelete(null); invalidate(); },
    onError: (e) => { setToDelete(null); toast.error(e?.response?.data?.message || 'We couldn’t delete that article.'); }
  });

  const list = tab === 'pending' ? pending : published;
  const loading = tab === 'pending' ? loadingPending : loadingPublished;
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list.filter((a) => !q || `${a.title} ${a.summary} ${a.authorName}`.toLowerCase().includes(q));
  }, [list, search]);

  return (
    <div>
      <PageHeader
        icon={NewspaperIcon}
        title="News Desk"
        description="Review stories waiting to go live, and look after what’s already published on the website."
        actions={<Link to="/dashboard/news-editor" className="btn btn-primary btn-lg"><PencilSquareIcon className="mr-2 h-5 w-5" aria-hidden="true" /> Write an article</Link>}
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <SegmentedControl
          label="News list"
          value={tab}
          onChange={setTab}
          options={[{ value: 'pending', label: 'Waiting for review', count: pending.length }, { value: 'published', label: 'Published', count: published.length }]}
        />
        <SearchBox value={search} onChange={setSearch} placeholder="Search articles or writers" className="w-full sm:w-72" />
      </div>

      {loading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
      ) : visible.length === 0 ? (
        <div className="card p-4">
          <EmptyState
            icon={NewspaperIcon}
            title={search ? 'Nothing matches that' : tab === 'pending' ? 'Nothing waiting for review' : 'No published articles yet'}
            description={search ? 'Try a different word.' : tab === 'pending' ? 'You’re all caught up. New stories will appear here when writers send them.' : 'Approved and published stories will appear here.'}
          />
        </div>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((a) => (
              <motion.li
                key={a.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="group flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-100 transition-shadow hover:shadow-lg hover:shadow-brand-900/5 sm:flex-row sm:items-center"
              >
                <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-ink-50 sm:h-20 sm:w-32">
                  {a.imageUrl ? <img src={a.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-ink-200"><PhotoIcon className="h-8 w-8" /></div>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-ink-400">{categoryLabel(a.category)}</p>
                  <h2 className="truncate text-lg font-extrabold text-ink-900">{a.title || 'Untitled article'}</h2>
                  <p className="line-clamp-1 text-sm text-ink-500">{a.summary || 'No summary'}</p>
                  <p className="mt-1.5 flex items-center gap-2 text-xs text-ink-400" title={formatDateTime(a.publishedAt || a.updatedAt)}>
                    <Avatar name={a.authorName || 'Media'} size="sm" className="!h-5 !w-5 !text-[0.6rem]" />
                    {a.authorName || 'Media team'} · {tab === 'pending' ? `sent ${timeAgo(a.submittedAt || a.updatedAt)}` : `published ${timeAgo(a.publishedAt)}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {tab === 'pending' ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-md"
                      onClick={() => setSelected({ id: a.id, entityId: a.id, entityType: 'news', entityName: a.title, submittedByName: a.authorName, submittedById: a.authorId, submittedAt: a.submittedAt || a.updatedAt, payload: { article: a } })}
                    >
                      Review
                    </button>
                  ) : (
                    <>
                      <a href={`/news-and-updates/${a.slug || a.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-md"><ArrowTopRightOnSquareIcon className="mr-1.5 h-4 w-4" aria-hidden="true" /> View</a>
                      <Link to={`/dashboard/news-editor/${a.id}`} className="btn btn-ghost btn-md">Edit</Link>
                      <button type="button" onClick={() => setToDelete(a)} className="btn btn-ghost btn-md !text-red-600" aria-label={`Delete ${a.title}`}><TrashIcon className="h-5 w-5" /></button>
                    </>
                  )}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <AuditDetailModal
        item={selected}
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        onApprove={(n) => approve.mutate(n)}
        onReject={(n) => reject.mutate(n)}
        isApproving={approve.isPending}
        isRejecting={reject.isPending}
      />

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={() => remove.mutate(toDelete.id)}
        loading={remove.isPending}
        tone="danger"
        title="Delete this article?"
        message={`“${toDelete?.title}” will be removed from the website for good. This can’t be undone.`}
        confirmLabel="Yes, delete it"
        cancelLabel="Keep it"
      />
    </div>
  );
};

export default NewsModeration;
