import { Link } from 'react-router-dom';
import {
  UsersIcon,
  NewspaperIcon,
  ClipboardDocumentCheckIcon,
  PhotoIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import Card from '../../../components/ui/Card';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { getAllNews } from '../../../services/newsService';
import { getAuditQueue } from '../../../services/auditService';
import { getActivityLog } from '../../../services/activityService';
import { getEmployees } from '../../../services/employeeService';

const SuperDashboard = () => {
  const { data: publishedNews = [], isLoading: loadingNews } = useQuery({
    queryKey: ['news', 'published'],
    queryFn: () => getAllNews({ status: 'published' }),
    staleTime: 5 * 60 * 1000
  });

  const { data: draftNews = [], isLoading: loadingDrafts } = useQuery({
    queryKey: ['news', 'draft'],
    queryFn: () => getAllNews({ status: 'draft' }),
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

  const stats = [
    {
      name: 'Published Articles',
      value: loadingNews ? null : String(publishedNews.length),
      loading: loadingNews,
      trend: 'up',
      icon: NewspaperIcon,
      href: '/dashboard/news'
    },
    {
      name: 'Draft Articles',
      value: loadingDrafts ? null : String(draftNews.length),
      loading: loadingDrafts,
      trend: 'up',
      icon: DocumentDuplicateIcon,
      href: '/dashboard/drafts'
    },
    {
      name: 'Pending Approvals',
      value: loadingAudit ? null : String(auditQueue.length),
      loading: loadingAudit,
      trend: 'down',
      icon: ClipboardDocumentCheckIcon,
      href: '/dashboard/audit-queue'
    },
    {
      name: 'Media Assets',
      value: '—', // Metric not yet implemented
      loading: false,
      trend: 'up',
      icon: PhotoIcon,
      href: '/dashboard/news'
    },
    {
      name: 'Employees on Record',
      value: loadingEmployees ? null : String(employeesRes?.meta?.total ?? 0),
      loading: loadingEmployees,
      trend: 'up',
      icon: IdentificationIcon,
      href: '/dashboard/employees'
    }
  ];

  const recentActivities = loadingActivity ? [] : (activity || []).slice(0, 6).map((a, idx) => ({
    id: a.id || idx,
    action: a.action,
    user: a.actorName || 'System',
    time: new Date(a.timestamp).toLocaleString()
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <header>
        <h1 className="heading-md">Content Management Dashboard</h1>
        <p className="text-gov-gray-600 mt-1">Monitor public information and editorial workflows.</p>
      </header>

      {/* Stats Grid */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Dashboard statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} to={stat.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gov-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gov-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gov-gray-900 mb-1">
                  {stat.loading ? (
                    <div className="h-8 w-24 bg-gov-gray-100 rounded animate-pulse" />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-sm text-gov-gray-600">
                  {stat.name}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gov-gray-900 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2 text-gov-blue-600" />
              Recent Activity
            </h2>
            <Link to="/dashboard/activity-log" className="text-sm text-gov-blue-600 hover:text-gov-blue-700">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {loadingActivity ? (
              <Skeleton rows={6} />
            ) : recentActivities.length === 0 ? (
              <EmptyState
                title="No recent activity"
                description="Activity logs will appear here as actions are taken in the portal."
              />
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gov-gray-100 last:border-0">
                  <div className="flex-shrink-0 w-2 h-2 bg-gov-blue-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-gov-gray-900 font-medium">
                      {activity.action.charAt(0).toUpperCase() + activity.action.slice(1).replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gov-gray-500 mt-1">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gov-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <Link 
              to="/dashboard/news-editor" 
              className="flex items-center p-4 bg-gov-green-50 rounded-lg hover:bg-gov-green-100 transition-colors"
            >
              <NewspaperIcon className="w-6 h-6 text-gov-green-600 mr-3" />
              <span className="text-sm font-medium text-gov-gray-900">Create News Post</span>
            </Link>
            <Link 
              to="/dashboard/news" 
              className="flex items-center p-4 bg-gov-blue-50 rounded-lg hover:bg-gov-blue-100 transition-colors"
            >
              <ClipboardDocumentCheckIcon className="w-6 h-6 text-gov-blue-600 mr-3" />
              <span className="text-sm font-medium text-gov-gray-900">Moderate News</span>
            </Link>
            <Link 
              to="/dashboard/admin/users" 
              className="flex items-center p-4 bg-gov-gray-50 rounded-lg hover:bg-gov-gray-100 transition-colors"
            >
              <UsersIcon className="w-6 h-6 text-gov-gray-600 mr-3" />
              <span className="text-sm font-medium text-gov-gray-900">Manage Users</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SuperDashboard;
