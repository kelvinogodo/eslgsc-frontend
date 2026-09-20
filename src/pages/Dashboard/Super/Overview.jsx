import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  NewspaperIcon,
  ClipboardDocumentCheckIcon,
  IdentificationIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  UserPlusIcon,
  MegaphoneIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import useAuth from '../../../context/useAuth';
import DashboardHero from '../../../components/portal/DashboardHero';
import { heroButton, heroButtonGhost } from '../../../components/portal/heroStyles';
import StatCard from '../../../components/portal/StatCard';
import ActionTile from '../../../components/portal/ActionTile';
import ActivityFeed from '../../../components/portal/ActivityFeed';
import { Stagger } from '../../../components/portal/motion';
import { getAllNews } from '../../../services/newsService';
import { getAuditQueue } from '../../../services/auditService';
import { getActivityLog } from '../../../services/activityService';
import { getEmployees } from '../../../services/employeeService';
import { getComplaints } from '../../../services/complaintService';

const SuperDashboard = () => {
  const { user } = useAuth();
  const isSuper = user?.role === 'SUPER_ADMIN';

  const { data: publishedNews = [], isLoading: loadingNews } = useQuery({
    queryKey: ['news', 'published'],
    queryFn: () => getAllNews({ status: 'published' }),
    staleTime: 5 * 60 * 1000
  });

  const { data: auditQueue = [], isLoading: loadingAudit } = useQuery({
    queryKey: ['auditQueue', 'pending'],
    queryFn: () => getAuditQueue({ status: 'pending' }),
    staleTime: 30 * 1000
  });

  const { data: activity = [], isLoading: loadingActivity } = useQuery({
    queryKey: ['activityLog', 'recent'],
    queryFn: () => getActivityLog({}),
    staleTime: 60 * 1000
  });

  const { data: employeesRes, isLoading: loadingEmployees } = useQuery({
    queryKey: ['employees', 'count'],
    queryFn: () => getEmployees({ limit: 1 }),
    staleTime: 5 * 60 * 1000
  });

  const { data: complaintsRes, isLoading: loadingComplaints } = useQuery({
    queryKey: ['complaints', 'NEW'],
    queryFn: () => getComplaints({ status: 'NEW' }),
    staleTime: 60 * 1000
  });

  const pending = auditQueue.length;
  const newComplaints = complaintsRes?.meta?.total ?? 0;

  return (
    <div>
      <DashboardHero
        message={
          pending > 0
            ? `${pending} item${pending > 1 ? 's are' : ' is'} waiting for your review. Here’s everything else at a glance.`
            : 'Everything is up to date. Here’s how the portal looks today.'
        }
      >
        <Link to="/dashboard/news-editor" className={heroButton}>
          <PencilSquareIcon className="h-5 w-5" aria-hidden="true" /> Write an article
        </Link>
        {pending > 0 && (
          <Link to="/dashboard/audit-queue" className={heroButtonGhost}>
            <ClipboardDocumentCheckIcon className="h-5 w-5" aria-hidden="true" /> Review approvals
          </Link>
        )}
      </DashboardHero>

      <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" delay={0.1}>
        <StatCard
          label="Waiting for review"
          hint={pending ? 'Needs your decision' : 'All clear'}
          value={pending}
          loading={loadingAudit}
          icon={ClipboardDocumentCheckIcon}
          tone="gold"
          href="/dashboard/audit-queue"
          cta="Review"
        />
        <StatCard
          label="Published articles"
          hint="Live on the website"
          value={publishedNews.length}
          loading={loadingNews}
          icon={NewspaperIcon}
          href="/dashboard/news"
        />
        <StatCard
          label="Staff on record"
          hint="Enrolled in the system"
          value={employeesRes?.meta?.total ?? 0}
          loading={loadingEmployees}
          icon={IdentificationIcon}
          tone="ink"
          href="/dashboard/employees"
          cta="Browse"
        />
        <StatCard
          label="New complaints"
          hint="Not yet looked at"
          value={newComplaints}
          loading={loadingComplaints}
          icon={ChatBubbleLeftRightIcon}
          tone={newComplaints ? 'red' : 'emerald'}
          href="/dashboard/complaints"
        />
      </Stagger>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <section className="card p-6 lg:col-span-3" aria-labelledby="recent-heading">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="recent-heading" className="flex items-center gap-2 text-lg font-extrabold text-ink-900">
              <ClockIcon className="h-5 w-5 text-brand-600" aria-hidden="true" /> What’s been happening
            </h2>
          </div>
          <ActivityFeed entries={activity} loading={loadingActivity} to="/dashboard/activity-log" />
        </section>

        <section className="lg:col-span-2" aria-labelledby="actions-heading">
          <h2 id="actions-heading" className="mb-3 text-lg font-extrabold text-ink-900">What would you like to do?</h2>
          <Stagger className="space-y-3" delay={0.25}>
            <ActionTile to="/dashboard/news-editor" icon={PencilSquareIcon} title="Write an article" description="Create a news story for the website." />
            <ActionTile to="/dashboard/announcements" icon={MegaphoneIcon} title="Post an announcement" description="Share a short public notice." tone="gold" />
            <ActionTile to="/dashboard/employees" icon={IdentificationIcon} title="Look up a staff member" description="Search enrolled staff records." tone="ink" />
            {isSuper && (
              <ActionTile to="/dashboard/admin/invite" icon={UserPlusIcon} title="Invite a colleague" description="Give someone access to the portal." />
            )}
          </Stagger>
          {pending > 5 && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-gold-50 p-3 text-sm text-ink-600 ring-1 ring-gold-200">
              <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
              Several items have been waiting for review. People are counting on a quick decision.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default SuperDashboard;
