import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import useAuth from '../../../context/useAuth';
import PageHeader from '../../../components/portal/PageHeader';
import SegmentedControl from '../../../components/portal/SegmentedControl';
import SearchBox from '../../../components/portal/SearchBox';
import ConfirmDialog from '../../../components/portal/ConfirmDialog';
import NewsStatusBadge from '../../../components/dashboard/news/NewsStatusBadge';
import ArticleRow from '../../../components/dashboard/news/ArticleRow';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { getAllNews, submitNewsForApproval } from '../../../services/newsService';
import { categoryLabel, stripHtml, buildChecklist } from '../../../lib/article';
import { timeAgo } from '../../../lib/utils';

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
        title="My Articles"
        description="Your drafts, articles in review and published articles."
        actions={<Link to="/dashboard/news-editor" className="btn btn-primary btn-md">Write an article</Link>}
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
        <SearchBox value={search} onChange={setSearch} placeholder="Search my articles" className="w-full sm:w-72" />
      </div>

      {isLoading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
      ) : visible.length === 0 ? (
        <div className="card p-4">
          <EmptyState
            title={articles.length === 0 ? 'No articles yet' : 'No articles match'}
            description={articles.length === 0 ? 'Drafts save automatically as you type.' : 'Try a different filter or search word.'}
            action={articles.length === 0 ? <Link to="/dashboard/news-editor" className="btn btn-primary btn-md">Write an article</Link> : (
              <button type="button" className="btn btn-outline btn-md" onClick={() => { setTab('all'); setSearch(''); }}>Clear filters</button>
            )}
          />
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((a) => (
            <ArticleRow
              key={a.id}
              article={a}
              meta={<><NewsStatusBadge status={a.status} /><span>{categoryLabel(a.category)} · edited {timeAgo(a.updatedAt)}</span></>}
              summary={a.summary || stripHtml(a.content).slice(0, 140) || 'No text yet'}
              footer={a.status === 'draft' && a.rejectionNotes && (
                <p className="mt-1.5 text-sm font-semibold text-red-600">Reviewer feedback: {a.rejectionNotes}</p>
              )}
            >
              {a.status === 'draft' && (
                <>
                  <button
                    type="button"
                    onClick={() => setToSubmit(a)}
                    disabled={!readyToSend(a)}
                    title={readyToSend(a) ? '' : 'Open the article and finish the checklist first'}
                    className="btn btn-outline btn-md"
                  >
                    {publishes ? 'Publish' : 'Send for review'}
                  </button>
                  <Link to={`/dashboard/news-editor/${a.id}`} className="btn btn-primary btn-md">Edit</Link>
                </>
              )}
              {a.status === 'pending' && <Link to={`/dashboard/news-editor/${a.id}`} className="btn btn-outline btn-md">View</Link>}
              {a.status === 'published' && (
                <>
                  <Link to={`/dashboard/news-editor/${a.id}`} className="btn btn-outline btn-md">Open</Link>
                  <a href={`/news-and-updates/${a.slug || a.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-md">View on site</a>
                </>
              )}
            </ArticleRow>
          ))}
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
        confirmLabel={publishes ? 'Publish' : 'Send'}
      />
    </div>
  );
};

export default Drafts;
