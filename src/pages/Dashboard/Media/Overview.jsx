import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PencilSquareIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  CheckBadgeIcon,
  ArrowUturnLeftIcon,
  MegaphoneIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';
import useAuth from '../../../context/useAuth';
import DashboardHero from '../../../components/portal/DashboardHero';
import { heroButton } from '../../../components/portal/heroStyles';
import StatCard from '../../../components/portal/StatCard';
import ActionTile from '../../../components/portal/ActionTile';
import NewsStatusBadge from '../../../components/dashboard/news/NewsStatusBadge';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { Stagger, Item } from '../../../components/portal/motion';
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
  const recent = [...mine].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  return (
    <div>
      <DashboardHero
        message={
          needsChanges.length
            ? `${needsChanges.length} of your article${needsChanges.length > 1 ? 's need' : ' needs'} a few changes before it can go live.`
            : 'Ready to tell the Commission’s story? Start a new article, or pick up where you left off.'
        }
      >
        <Link to="/dashboard/news-editor" className={heroButton}>
          <PencilSquareIcon className="h-5 w-5" aria-hidden="true" /> Write a new article
        </Link>
      </DashboardHero>

      <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" delay={0.1}>
        <StatCard label="Drafts in progress" hint="Saved, not yet sent" value={drafts.length} loading={isLoading} icon={DocumentTextIcon} tone="ink" href="/dashboard/drafts" cta="Continue" />
        <StatCard label="Awaiting approval" hint="With the reviewers" value={pending.length} loading={isLoading} icon={PaperAirplaneIcon} tone="gold" href="/dashboard/drafts" cta="Track" />
        <StatCard label="Published" hint="Live on the website" value={published.length} loading={isLoading} icon={CheckBadgeIcon} href="/dashboard/drafts" cta="View" />
        <StatCard label="Need changes" hint="Sent back with feedback" value={needsChanges.length} loading={isLoading} icon={ArrowUturnLeftIcon} tone={needsChanges.length ? 'red' : 'emerald'} href="/dashboard/drafts" cta="Fix" />
      </Stagger>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <section className="card p-6 lg:col-span-3" aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="mb-4 text-lg font-extrabold text-ink-900">Your recent articles</h2>
          {isLoading ? (
            <Skeleton rows={5} />
          ) : recent.length === 0 ? (
            <EmptyState
              icon={NewspaperIcon}
              title="You haven’t written anything yet"
              description="Your first article is only a few clicks away. We’ll save it automatically as you type."
              action={<Link to="/dashboard/news-editor" className="btn btn-primary btn-md">Write your first article</Link>}
            />
          ) : (
            <Stagger as="ul" className="divide-y divide-ink-100" stagger={0.05}>
              {recent.map((a) => (
                <Item as="li" key={a.id}>
                  <Link to={`/dashboard/news-editor/${a.id}`} className="group flex items-center gap-4 rounded-xl px-2 py-3.5 transition-colors hover:bg-brand-50/60">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-ink-900 group-hover:text-brand-800">{a.title || 'Untitled article'}</p>
                      <p className="mt-0.5 text-xs text-ink-400">Edited {timeAgo(a.updatedAt)}</p>
                      {a.status === 'draft' && a.rejectionNotes && (
                        <p className="mt-1 line-clamp-1 text-xs font-semibold text-red-600">Feedback: {a.rejectionNotes}</p>
                      )}
                    </div>
                    <NewsStatusBadge status={a.status} />
                  </Link>
                </Item>
              ))}
            </Stagger>
          )}
        </section>

        <section className="lg:col-span-2" aria-labelledby="actions-heading">
          <h2 id="actions-heading" className="mb-3 text-lg font-extrabold text-ink-900">What would you like to do?</h2>
          <Stagger className="space-y-3" delay={0.25}>
            <ActionTile to="/dashboard/news-editor" icon={PencilSquareIcon} title="Write a new article" description="Start a fresh news story." />
            <ActionTile to="/dashboard/drafts" icon={DocumentTextIcon} title="See all my articles" description="Drafts, submissions and published." tone="ink" />
            <ActionTile to="/dashboard/announcements" icon={MegaphoneIcon} title="Post an announcement" description="A short notice for the public." tone="gold" />
          </Stagger>
        </section>
      </div>
    </div>
  );
};

export default MediaDashboard;
