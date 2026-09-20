import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  FingerPrintIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import DashboardHero from '../../../components/portal/DashboardHero';
import { heroButton } from '../../../components/portal/heroStyles';
import StatCard from '../../../components/portal/StatCard';
import ActionTile from '../../../components/portal/ActionTile';
import ActivityFeed from '../../../components/portal/ActivityFeed';
import { Stagger } from '../../../components/portal/motion';
import { getAuditQueue } from '../../../services/auditService';
import { getComplaints } from '../../../services/complaintService';
import { getActivityLog } from '../../../services/activityService';
import { getAuditTrail } from '../../../services/auditTrailService';

const AuditDashboard = () => {
  const { data: auditQueue = [], isLoading: loadingQueue } = useQuery({
    queryKey: ['auditQueue', 'pending'],
    queryFn: () => getAuditQueue({ status: 'pending' }),
    staleTime: 30 * 1000
  });

  const { data: complaintsRes, isLoading: loadingComplaints } = useQuery({
    queryKey: ['complaints', 'NEW'],
    queryFn: () => getComplaints({ status: 'NEW' }),
    staleTime: 30 * 1000
  });

  const { data: activity = [], isLoading: loadingActivity } = useQuery({
    queryKey: ['activityLog', 'recent'],
    queryFn: () => getActivityLog({}),
    staleTime: 60 * 1000
  });

  const { data: trail, isLoading: loadingTrail } = useQuery({
    queryKey: ['auditTrail', 'count'],
    queryFn: () => getAuditTrail({ limit: 1 }),
    staleTime: 5 * 60 * 1000
  });

  const newComplaints = complaintsRes?.meta?.total ?? 0;

  return (
    <div>
      <DashboardHero message="Review what’s been submitted, follow up on public complaints and keep an eye on activity across the portal.">
        <Link to="/dashboard/audit-queue" className={heroButton}>
          <ClipboardDocumentCheckIcon className="h-5 w-5" aria-hidden="true" /> Open approvals
        </Link>
      </DashboardHero>

      <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" delay={0.1}>
        <StatCard label="Waiting for review" hint="Submitted by the media team" value={auditQueue.length} loading={loadingQueue} icon={ClipboardDocumentCheckIcon} tone="gold" href="/dashboard/audit-queue" cta="Review" />
        <StatCard label="New complaints" hint="Not yet looked at" value={newComplaints} loading={loadingComplaints} icon={ChatBubbleLeftRightIcon} tone={newComplaints ? 'red' : 'emerald'} href="/dashboard/complaints" />
        <StatCard label="Portal actions logged" hint="Recent activity" value={activity.length} loading={loadingActivity} icon={ClockIcon} tone="ink" href="/dashboard/activity-log" cta="See all" />
        <StatCard label="Enrollment records" hint="Staff enrollment history" value={trail?.meta?.total ?? 0} loading={loadingTrail} icon={FingerPrintIcon} href="/dashboard/audit-trail" cta="Explore" />
      </Stagger>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <section className="card p-6 lg:col-span-3" aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="mb-3 flex items-center gap-2 text-lg font-extrabold text-ink-900">
            <ClockIcon className="h-5 w-5 text-brand-600" aria-hidden="true" /> Latest activity
          </h2>
          <ActivityFeed entries={activity} loading={loadingActivity} to="/dashboard/activity-log" />
        </section>

        <section className="lg:col-span-2" aria-labelledby="actions-heading">
          <h2 id="actions-heading" className="mb-3 text-lg font-extrabold text-ink-900">Where to next?</h2>
          <Stagger className="space-y-3" delay={0.25}>
            <ActionTile to="/dashboard/audit-queue" icon={ClipboardDocumentCheckIcon} title="Approvals" description="See what’s waiting for review." tone="gold" />
            <ActionTile to="/dashboard/complaints" icon={ChatBubbleLeftRightIcon} title="Complaints" description="Read and track public complaints." />
            <ActionTile to="/dashboard/audit-trail" icon={FingerPrintIcon} title="Enrollment records log" description="History from the staff enrollment system." tone="ink" />
          </Stagger>
        </section>
      </div>
    </div>
  );
};

export default AuditDashboard;
