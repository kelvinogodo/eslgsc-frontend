import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Modal from '../../../components/ui/Modal';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { getComplaints, updateComplaintStatus } from '../../../services/complaintService';
import { formatDate } from '../../../lib/utils';
import { toast } from 'react-toastify';
import useAuth from '../../../context/useAuth';

const Complaints = () => {
  useAuth();
  const queryClient = useQueryClient();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [statusToSet, setStatusToSet] = useState('');

  const { data: complaintsData = { data: [] }, isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: () => getComplaints()
  });

  const complaints = complaintsData.data || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, adminNote }) => updateComplaintStatus(id, { status, adminNote }),
    onSuccess: () => {
      toast.success('Complaint status updated');
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['activityLog'] });
      setSelectedComplaint(null);
      setAdminNote('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  });

  const handleReview = (complaint) => {
    setSelectedComplaint(complaint);
    setAdminNote(complaint.adminNote || '');
    setStatusToSet(complaint.status);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW': return <Badge variant="blue">New</Badge>;
      case 'IN_REVIEW': return <Badge variant="yellow">In Review</Badge>;
      case 'CLOSED': return <Badge variant="green">Closed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gov-gray-900">Complaints & Petitions</h1>
        <p className="text-gov-gray-600 mt-1">
          Review and manage public submissions from the accountability channel.
        </p>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>Petitioner</Table.HeaderCell>
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>LGA/Office</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Action</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <Skeleton rows={5} />
                  </Table.Cell>
                </Table.Row>
              ) : complaints.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} className="py-12">
                    <EmptyState 
                      title="No complaints found" 
                      description="All public submissions have been processed or none have been submitted yet." 
                    />
                  </Table.Cell>
                </Table.Row>
              ) : (
                complaints.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <div className="font-medium text-gov-gray-900">{item.fullName}</div>
                      <div className="text-xs text-gov-gray-500">{item.email || item.phone || 'Anonymous'}</div>
                    </Table.Cell>
                    <Table.Cell className="capitalize">{item.category.replace(/-/g, ' ')}</Table.Cell>
                    <Table.Cell>{item.localGovernment || '—'}</Table.Cell>
                    <Table.Cell>{getStatusBadge(item.status)}</Table.Cell>
                    <Table.Cell>{formatDate(item.createdAt)}</Table.Cell>
                    <Table.Cell className="text-right">
                      <Button size="sm" onClick={() => handleReview(item)}>Review</Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </Card>

      {/* Review Modal */}
      <Modal
        isOpen={Boolean(selectedComplaint)}
        onClose={() => setSelectedComplaint(null)}
        title="Petition Detail"
        size="lg"
      >
        {selectedComplaint && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-gov-gray-500 font-bold uppercase tracking-widest text-[10px]">Petitioner</span>
                <p className="mt-1 font-medium">{selectedComplaint.fullName}</p>
              </div>
              <div>
                <span className="block text-gov-gray-500 font-bold uppercase tracking-widest text-[10px]">Contact</span>
                <p className="mt-1">{selectedComplaint.email || '—'} / {selectedComplaint.phone || '—'}</p>
              </div>
              <div>
                <span className="block text-gov-gray-500 font-bold uppercase tracking-widest text-[10px]">Category</span>
                <p className="mt-1 capitalize">{selectedComplaint.category.replace(/-/g, ' ')}</p>
              </div>
              <div>
                <span className="block text-gov-gray-500 font-bold uppercase tracking-widest text-[10px]">LGA / Office</span>
                <p className="mt-1">{selectedComplaint.localGovernment || 'Commission Wide'}</p>
              </div>
            </div>

            <div className="p-4 bg-gov-gray-50 border border-gov-gray-200 rounded-lg">
              <span className="block text-gov-gray-500 font-bold uppercase tracking-widest text-[10px] mb-2">Detailed Message</span>
              <p className="text-sm text-gov-gray-800 whitespace-pre-wrap leading-relaxed">
                {selectedComplaint.message}
              </p>
            </div>

            {selectedComplaint.suggestedAction && (
              <div className="p-4 bg-gov-navy-50 border border-gov-navy-100 rounded-lg">
                <span className="block text-gov-navy-600 font-bold uppercase tracking-widest text-[10px] mb-2">Suggested Administrative Action</span>
                <p className="text-sm text-gov-navy-900 whitespace-pre-wrap leading-relaxed">
                  {selectedComplaint.suggestedAction}
                </p>
              </div>
            )}

            <div className="space-y-4 border-t border-gov-gray-100 pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gov-navy-900 uppercase tracking-widest">Update Status</label>
                  <select 
                    className="w-full rounded-md border-gov-gray-300 text-sm focus:border-gov-navy-500 focus:ring-gov-navy-500"
                    value={statusToSet}
                    onChange={(e) => setStatusToSet(e.target.value)}
                  >
                    <option value="NEW">New</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gov-navy-900 uppercase tracking-widest">Administrative Notes</label>
                <textarea 
                  className="w-full rounded-md border-gov-gray-300 text-sm focus:border-gov-navy-500 focus:ring-gov-navy-500"
                  rows={3}
                  placeholder="Internal notes regarding investigation or response..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setSelectedComplaint(null)}>Cancel</Button>
              <Button 
                disabled={updateStatusMutation.isPending}
                onClick={() => updateStatusMutation.mutate({ 
                  id: selectedComplaint.id, 
                  status: statusToSet, 
                  adminNote 
                })}
              >
                {updateStatusMutation.isPending ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Complaints;
