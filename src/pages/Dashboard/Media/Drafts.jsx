import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  PencilSquareIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  ArrowTopRightOnSquareIcon,
  PhotoIcon,
  ExclamationCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import useAuth from '../../../context/useAuth';
import PageHeader from '../../../components/portal/PageHeader';
import SegmentedControl from '../../../components/portal/SegmentedControl';
import ConfirmDialog from '../../../components/portal/ConfirmDialog';
import NewsStatusBadge from '../../../components/dashboard/news/NewsStatusBadge';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { getAllNews, submitNewsForApproval } from '../../../services/newsService';
import { categoryLabel, stripHtml, buildChecklist } from '../../../lib/article';
import { timeAgo } from '../../../lib/utils';
import { EASE } from '../../../components/portal/motionVariants';

const Drafts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [toSubmit, setToSubmit] = useState(null);
  const publishes = ['SUPER_ADMIN', 'ADMIN'].includes(user?.role);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['news', 'mine', user?.id],
    queryFn: () => getAllNews({ authorId: user.id }),
    enabled: Boolean(user?.id)
  });

  const submitMutation = useMutation({
    mutationFn: (id) => submitNewsForApproval(id, {}),
    onSuccess: () => {
      toast.success(publishes ? 'Published — it’s now live on the website' : 'Sent for review');
      setToSubmit(null);
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['auditQueue'] });
    },
    onError: (error) => {
      setToSubmit(null);
      toast.error(error?.response?.data?.message || 'We couldn’t send that. Please try again.');
    }
  });

  const counts = useMemo(() => ({
    all: articles.length,
    draft: articles.filter((a) => a.status === 'draft').length,
    pending: articles.filter((a) => a.status === 'pending').length,
    published: articles.filter((a) => a.status === 'published').length
  }), [articles]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...articles]
      .filter((a) => tab === 'all' || a.status === tab)
      .filter((a) => !q || `${a.title} ${a.summary}`.toLowerCase().includes(q))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [articles, tab, search]);

  const readyToSend = (a) => buildChecklist({ title: a.title || '', summary: a.summary || '', content: a.content || '', imageUrl: a.imageUrl }).filter((i) => i.required).every((i) => i.ok);

  return (
    <div>
      <PageHeader
        icon={DocumentTextIcon}
        title="My Articles"
        description="Everything you’ve written, in one place — drafts you can keep working on, stories waiting for review, and what’s already live."
        actions={(
          <Link to="/dashboard/news-editor" className="btn btn-primary btn-lg">
            <PencilSquareIcon className="mr-2 h-5 w-5" aria-hidden="true" /> Write a new article
          </Link>
        )}
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <SegmentedControl
          label="Filter articles"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'all', label: 'All', count: counts.all },
            { value: 'draft', label: 'Drafts', count: counts.draft },
            { value: 'pending', label: 'In review', count: counts.pending },
            { value: 'published', label: 'Published', count: counts.published }
          ]}
        />
        <div className="relative w-full sm:w-72">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-300" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search my articles"
            aria-label="Search my articles"
            className="input pl-11"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
      ) : visible.length === 0 ? (
        <div className="card p-4">
          <EmptyState
            icon={DocumentTextIcon}
            title={articles.length === 0 ? 'No articles yet' : 'Nothing matches that'}
            description={articles.length === 0 ? 'Start your first story — it saves itself as you type, so you can’t lose your work.' : 'Try a different filter or search word.'}
            action={articles.length === 0 ? <Link to="/dashboard/news-editor" className="btn btn-primary btn-md">Write your first article</Link> : (
              <button type="button" className="btn btn-outline btn-md" onClick={() => { setTab('all'); setSearch(''); }}>Show everything</button>
            )}
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
                  {a.imageUrl ? (
                    <img src={a.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink-200"><PhotoIcon className="h-8 w-8" /></div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <NewsStatusBadge status={a.status} />
                    <span className="text-xs font-semibold text-ink-400">{categoryLabel(a.category)} · edited {timeAgo(a.updatedAt)}</span>
                  </div>
                  <h2 className="mt-1.5 truncate text-lg font-extrabold text-ink-900">{a.title || 'Untitled article'}</h2>
                  <p className="line-clamp-1 text-sm text-ink-500">{a.summary || stripHtml(a.content).slice(0, 140) || 'No text yet'}</p>
                  {a.status === 'draft' && a.rejectionNotes && (
                    <p className="mt-1.5 flex items-start gap-1.5 text-sm font-semibold text-red-600">
                      <ExclamationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> Reviewer feedback: {a.rejectionNotes}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {a.status === 'draft' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setToSubmit(a)}
                        disabled={!readyToSend(a)}
                        title={readyToSend(a) ? '' : 'Open the article and finish the checklist first'}
                        className="btn btn-outline btn-md"
                      >
                        <PaperAirplaneIcon className="mr-2 h-4 w-4" aria-hidden="true" /> {publishes ? 'Publish' : 'Send'}
                      </button>
                      <Link to={`/dashboard/news-editor/${a.id}`} className="btn btn-primary btn-md">Keep writing</Link>
                    </>
                  )}
                  {a.status === 'pending' && <Link to={`/dashboard/news-editor/${a.id}`} className="btn btn-outline btn-md">View</Link>}
                  {a.status === 'published' && (
                    <>
                      <Link to={`/dashboard/news-editor/${a.id}`} className="btn btn-outline btn-md">Open</Link>
                      <a href={`/news-and-updates/${a.slug || a.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-md" aria-label="View on the website">
                        <ArrowTopRightOnSquareIcon className="h-5 w-5" aria-hidden="true" />
                      </a>
                    </>
                  )}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <ConfirmDialog
        isOpen={Boolean(toSubmit)}
        onClose={() => setToSubmit(null)}
        onConfirm={() => submitMutation.mutate(toSubmit.id)}
        loading={submitMutation.isPending}
        title={publishes ? 'Publish this article?' : 'Send for review?'}
        message={publishes
          ? `“${toSubmit?.title}” will go live on the website straight away.`
          : `“${toSubmit?.title}” will be sent to a reviewer. You won’t be able to edit it while it’s being reviewed.`}
        confirmLabel={publishes ? 'Yes, publish it' : 'Yes, send it'}
      />
    </div>
  );
};

export default Drafts;
