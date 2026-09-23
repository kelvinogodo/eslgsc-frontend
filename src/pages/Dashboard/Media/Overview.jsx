import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../context/useAuth';
import DashboardHero from '../../../components/portal/DashboardHero';
import { heroButton } from '../../../components/portal/heroStyles';
import StatCard from '../../../components/portal/StatCard';
import NewsStatusBadge from '../../../components/dashboard/news/NewsStatusBadge';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { getAllNews } from '../../../services/newsService';
import { timeAgo } from '../../../lib/utils';

const MediaDashboard = () => {
  const { user } = useAuth();

  const { data: mine = [], isLoading } = useQuery({
    queryKey: ['news', 'mine', user?.id],
    queryFn: () => getAllNews({ authorId: user.id }),
    enabled: Boolean(user?.id),
    staleTime: 30 * 1000
  });

  const drafts = mine.filter((a) => a.status === 'draft');
  const pending = mine.filter((a) => a.status === 'pending');
  const published = mine.filter((a) => a.status === 'published');
  const needsChanges = drafts.filter((a) => a.rejectionNotes);
  const recent = [...mine].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6);

  return (
    <div>
      <DashboardHero
        message={needsChanges.length
          ? `${needsChanges.length} of your articles ${needsChanges.length > 1 ? 'have' : 'has'} been sent back with feedback.`
          : null}
      >
        <Link to="/dashboard/news-editor" className={heroButton}>Write an article</Link>
      </DashboardHero>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Drafts" value={drafts.length} loading={isLoading} href="/dashboard/drafts" />
        <StatCard label="Awaiting approval" value={pending.length} loading={isLoading} href="/dashboard/drafts" />
        <StatCard label="Published" value={published.length} loading={isLoading} href="/dashboard/drafts" />
        <StatCard label="Sent back" hint="Returned with feedback" value={needsChanges.length} loading={isLoading} alert href="/dashboard/drafts" />
      </div>

      <section className="card mt-8 p-6" aria-labelledby="recent-heading">
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <h2 id="recent-heading" className="text-lg font-extrabold text-ink-900">Your recent articles</h2>
          {mine.length > recent.length && <Link to="/dashboard/drafts" className="text-sm font-bold">See all</Link>}
        </div>
        {isLoading ? (
          <Skeleton rows={5} />
        ) : recent.length === 0 ? (
          <EmptyState
            title="No articles yet"
            description="Drafts save automatically as you type."
            action={<Link to="/dashboard/news-editor" className="btn btn-primary btn-md">Write an article</Link>}
          />
        ) : (
          <ul className="divide-y divide-ink-100">
            {recent.map((a) => (
              <li key={a.id}>
                <Link to={`/dashboard/news-editor/${a.id}`} className="-mx-2 flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-ink-50">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-ink-900">{a.title || 'Untitled article'}</p>
                    <p className="mt-0.5 text-xs text-ink-400">Edited {timeAgo(a.updatedAt)}</p>
                    {a.status === 'draft' && a.rejectionNotes && (
                      <p className="mt-1 line-clamp-1 text-xs font-semibold text-red-600">Feedback: {a.rejectionNotes}</p>
                    )}
                  </div>
                  <NewsStatusBadge status={a.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default MediaDashboard;
