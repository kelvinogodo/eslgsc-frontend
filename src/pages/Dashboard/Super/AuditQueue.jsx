import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../../components/portal/PageHeader';
import AuditQueueTable from '../../../components/dashboard/audit/AuditQueueTable';
import AuditDetailModal from '../../../components/dashboard/audit/AuditDetailModal';
import Badge from '../../../components/ui/Badge';
import useAuth from '../../../context/useAuth';
import { approveAudit, getAuditQueue, rejectAudit } from '../../../services/auditService';

const QUEUE_KEY = ['auditQueue'];

const AuditQueue = () => {
  const { user } = useAuth();
  const canDecide = ['SUPER_ADMIN', 'ADMIN'].includes(user?.role);
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);

  const { data: items = [], isLoading } = useQuery({ queryKey: QUEUE_KEY, queryFn: () => getAuditQueue({ status: 'pending' }) });

  const done = () => {
    queryClient.invalidateQueries({ queryKey: QUEUE_KEY });
    queryClient.invalidateQueries({ queryKey: ['news'] });
    queryClient.invalidateQueries({ queryKey: ['activityLog'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'notifications'] });
    setSelected(null);
  };

  const fail = (fallback) => (error) => {
    toast.error(error?.response?.status === 403 ? 'Only Administrators can decide on submissions.' : error?.response?.data?.message || fallback);
  };

  const approve = useMutation({
    mutationFn: (notes) => approveAudit(selected.id, { notes }),
    onSuccess: () => { toast.success('Approved — it’s now live'); done(); },
    onError: fail('We couldn’t approve that. Please try again.')
  });
  const reject = useMutation({
    mutationFn: (notes) => rejectAudit(selected.id, { notes }),
    onSuccess: () => { toast.info('Sent back to the writer with your feedback'); done(); },
    onError: fail('We couldn’t send that back. Please try again.')
  });

  return (
    <div>
      <PageHeader
        icon={ClipboardDocumentCheckIcon}
        title="Approvals"
        description={canDecide
          ? 'Things people have sent for review. Read each one, then approve it or send it back with feedback.'
          : 'Things waiting for an Administrator’s decision. You can look at them, but not approve or reject.'}
        actions={!isLoading && <Badge variant={items.length ? 'yellow' : 'green'}>{items.length ? `${items.length} waiting` : 'All clear'}</Badge>}
      />

      <div className="card">
        <AuditQueueTable items={items} isLoading={isLoading} onReview={setSelected} canDecide={canDecide} />
      </div>

      <AuditDetailModal
        item={selected}
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        onApprove={(notes) => approve.mutate(notes)}
        onReject={(notes) => reject.mutate(notes)}
        isApproving={approve.isPending}
        isRejecting={reject.isPending}
        canDecide={canDecide}
      />
    </div>
  );
};

export default AuditQueue;
