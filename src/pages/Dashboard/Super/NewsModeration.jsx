import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import PageHeader from '../../../components/portal/PageHeader';
import SegmentedControl from '../../../components/portal/SegmentedControl';
import SearchBox from '../../../components/portal/SearchBox';
import ConfirmDialog from '../../../components/portal/ConfirmDialog';
import AuditDetailModal from '../../../components/dashboard/audit/AuditDetailModal';
import ArticleRow from '../../../components/dashboard/news/ArticleRow';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { getAllNews, approveNews, rejectNews, deleteNews } from '../../../services/newsService';
import { NEWS_STATUS } from '../../../lib/constants';
import { categoryLabel } from '../../../lib/article';
import { timeAgo, formatDateTime } from '../../../lib/utils';

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
        title="News Desk"
        description="Review articles waiting to go live, and manage what’s already published."
        actions={<Link to="/dashboard/news-editor" className="btn btn-primary btn-md">Write an article</Link>}
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
            title={search ? 'No articles match' : tab === 'pending' ? 'Nothing waiting for review' : 'No published articles yet'}
            description={search ? 'Try a different word.' : tab === 'pending' ? 'Articles sent for review will appear here.' : 'Approved articles will appear here.'}
          />
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((a) => {
            const when = tab === 'pending' ? a.submittedAt || a.updatedAt : a.publishedAt;
            return (
              <ArticleRow
                key={a.id}
                article={a}
                meta={(
                  <>
                    <span>{categoryLabel(a.category)}</span>
                    <span aria-hidden="true">·</span>
                    <span title={formatDateTime(when)}>
                      {a.authorName || 'Media team'}, {tab === 'pending' ? 'sent' : 'published'} {timeAgo(when)}
                    </span>
                  </>
                )}
              >
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
                    <a href={`/news-and-updates/${a.slug || a.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-md">View</a>
                    <Link to={`/dashboard/news-editor/${a.id}`} className="btn btn-ghost btn-md">Edit</Link>
                    <button type="button" onClick={() => setToDelete(a)} className="btn btn-ghost btn-md !text-red-600">Delete</button>
                  </>
                )}
              </ArticleRow>
            );
          })}
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
        message={`“${toDelete?.title}” will be removed from the website. This can’t be undone.`}
        confirmLabel="Delete"
        cancelLabel="Keep it"
      />
    </div>
  );
};

export default NewsModeration;
