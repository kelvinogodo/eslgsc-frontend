import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ClipboardDocumentCheckIcon, ChatBubbleLeftRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Card from '../../../components/ui/Card';
import { getAuditQueue } from '../../../services/auditService';
import { getComplaints } from '../../../services/complaintService';

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

  const stats = [
    {
      name: 'Pending Reviews',
      value: loadingQueue ? null : String(auditQueue.length),
      loading: loadingQueue,
      icon: ClipboardDocumentCheckIcon
    },
    {
      name: 'New Complaints',
      value: loadingComplaints ? null : String(complaintsRes?.meta?.total ?? 0),
      loading: loadingComplaints,
      icon: ChatBubbleLeftRightIcon
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gov-gray-900">
          Audit Dashboard
        </h1>
        <p className="text-gov-gray-600 mt-1">
          Review system activity and verify pending submissions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gov-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gov-blue-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gov-gray-900">
                    {stat.loading ? (
                      <div className="h-8 w-16 bg-gov-gray-100 rounded animate-pulse" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-sm text-gov-gray-600">
                    {stat.name}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gov-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/audit-queue"
            className="flex items-center justify-center p-4 bg-gov-blue-50 rounded-lg hover:bg-gov-blue-100 transition-colors"
          >
            <ClipboardDocumentCheckIcon className="w-6 h-6 text-gov-blue-600 mr-2" />
            <span className="font-medium">Audit Queue</span>
          </Link>
          <Link
            to="/dashboard/complaints"
            className="flex items-center justify-center p-4 bg-gov-gray-100 rounded-lg hover:bg-gov-gray-200 transition-colors"
          >
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-gov-gray-600 mr-2" />
            <span className="font-medium">Complaints</span>
          </Link>
          <Link
            to="/dashboard/audit-trail"
            className="flex items-center justify-center p-4 bg-gov-gray-100 rounded-lg hover:bg-gov-gray-200 transition-colors"
          >
            <DocumentTextIcon className="w-6 h-6 text-gov-gray-600 mr-2" />
            <span className="font-medium">Onboarding Audit Trail</span>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AuditDashboard;
