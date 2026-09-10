import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Card from '../../../components/ui/Card';
import AuditQueueTable from '../../../components/dashboard/audit/AuditQueueTable';
import AuditDetailModal from '../../../components/dashboard/audit/AuditDetailModal';
import { approveAudit, getAuditQueue, rejectAudit } from '../../../services/auditService';
import { toast } from 'react-toastify';
import useAuth from '../../../context/useAuth';

const AUDIT_QUEUE_QUERY_KEY = ['auditQueue'];

const AuditQueue = () => {
  useAuth();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState(null);

  const { data: queueItems = [], isLoading } = useQuery({
    queryKey: AUDIT_QUEUE_QUERY_KEY,
    queryFn: getAuditQueue
  });

  const closeModal = () => setSelectedItem(null);

  const invalidateRelatedQueries = () => {
    queryClient.invalidateQueries({ queryKey: AUDIT_QUEUE_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ['news'] });
    queryClient.invalidateQueries({ queryKey: ['activityLog'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'notifications'] });
  };

  const approveMutation = useMutation({
    mutationFn: (notes) => approveAudit(selectedItem.id, { notes }),
    onSuccess: () => {
      toast.success('Submission approved successfully');
      invalidateRelatedQueries();
      closeModal();
    },
    onError: (error) => {
      console.error('Approve error:', error);
      if (error?.response?.status === 403) {
        toast.error('You do not have permission to approve submissions. Only SUPER_ADMIN and ADMIN can approve.');
      } else if (error?.response?.status === 500) {
        toast.error('Server error. Please try again later');
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error?.message || 'Unable to approve submission');
      }
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (notes) => rejectAudit(selectedItem.id, { notes }),
    onSuccess: () => {
      toast.info('Submission rejected');
      invalidateRelatedQueries();
      closeModal();
    },
    onError: (error) => {
      console.error('Reject error:', error);
      if (error?.response?.status === 403) {
        toast.error('You do not have permission to reject submissions. Only SUPER_ADMIN and ADMIN can reject.');
      } else if (error?.response?.status === 500) {
        toast.error('Server error. Please try again later');
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error?.message || 'Unable to reject submission');
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gov-gray-900">Approval Queue</h1>
        <p className="text-gov-gray-600 mt-1">
          Review and approve submissions from media and audit teams before they reach production systems.
        </p>
      </div>

      <Card className="p-0">
        <AuditQueueTable
          items={queueItems}
          isLoading={isLoading}
          onReview={setSelectedItem}
        />
      </Card>

      <AuditDetailModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={closeModal}
        onApprove={(notes) => approveMutation.mutate(notes)}
        onReject={(notes) => rejectMutation.mutate(notes)}
        isApproving={approveMutation.isPending}
        isRejecting={rejectMutation.isPending}
      />
    </div>
  );
};

export default AuditQueue;
