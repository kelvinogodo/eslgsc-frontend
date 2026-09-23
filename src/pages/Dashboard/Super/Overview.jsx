import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardHero from '../../../components/portal/DashboardHero';
import { heroButton, heroButtonGhost } from '../../../components/portal/heroStyles';
import StatCard from '../../../components/portal/StatCard';
import ActivityFeed from '../../../components/portal/ActivityFeed';
import PendingList from '../../../components/portal/PendingList';
import { getAllNews } from '../../../services/newsService';
import { getAuditQueue } from '../../../services/auditService';
import { getActivityLog } from '../../../services/activityService';
import { getEmployees } from '../../../services/employeeService';
import { getComplaints } from '../../../services/complaintService';

const SuperDashboard = () => {
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
      <DashboardHero message={pending > 0 ? `${pending} item${pending > 1 ? 's are' : ' is'} waiting for review.` : null}>
        {pending > 0 && <Link to="/dashboard/audit-queue" className={heroButton}>Review approvals</Link>}
        <Link to="/dashboard/news-editor" className={pending > 0 ? heroButtonGhost : heroButton}>Write an article</Link>
      </DashboardHero>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Waiting for review" value={pending} loading={loadingAudit} href="/dashboard/audit-queue" />
        <StatCard label="Published articles" value={publishedNews.length} loading={loadingNews} href="/dashboard/news" />
        <StatCard label="Staff on record" value={employeesRes?.meta?.total ?? 0} loading={loadingEmployees} href="/dashboard/employees" />
        <StatCard label="New complaints" hint="Not yet opened" value={newComplaints} loading={loadingComplaints} alert href="/dashboard/complaints" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <section className="card p-6 lg:col-span-3" aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="mb-2 text-lg font-extrabold text-ink-900">Recent activity</h2>
          <ActivityFeed entries={activity} loading={loadingActivity} to="/dashboard/activity-log" />
        </section>

        <section className="card p-6 lg:col-span-2" aria-labelledby="pending-heading">
          <h2 id="pending-heading" className="mb-2 text-lg font-extrabold text-ink-900">Waiting for review</h2>
          <PendingList items={auditQueue} loading={loadingAudit} />
        </section>
      </div>
    </div>
  );
};

export default SuperDashboard;
