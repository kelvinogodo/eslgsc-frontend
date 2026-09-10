import { useEffect, useState } from 'react';
import Modal from '../../ui/Modal';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import Textarea from '../../ui/Textarea';
import Card from '../../ui/Card';
import { formatDate } from '../../../lib/utils';
import { AUDIT_STATUS } from '../../../lib/constants';

const SectionTitle = ({ children }) => (
  <h3 className="text-sm font-semibold text-gov-gray-900 uppercase tracking-wide">
    {children}
  </h3>
);


const AuditDetailModal = ({
  item,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isApproving,
  isRejecting
}) => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setNotes('');
    }
  }, [isOpen]);


  const handleApprove = () => {
    onApprove?.(notes || undefined);
  };

  const handleReject = () => {
    onReject?.(notes || undefined);
  };

  if (!item) return null;

  const submittedInfo = (
    <div className="space-y-2 text-sm text-gov-gray-600">
      <p>
        <span className="font-medium text-gov-gray-900">Submitted by:</span>{' '}
        {item.submittedByName || 'Unknown'}
      </p>
      <p>
        <span className="font-medium text-gov-gray-900">Submitted:</span>{' '}
        {formatDate(item.submittedAt)}
      </p>
      {item.payload?.reason && (
        <p>
          <span className="font-medium text-gov-gray-900">Change rationale:</span>{' '}
          {item.payload.reason}
        </p>
      )}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="Review Submission">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gov-gray-500 uppercase tracking-wide">Item</p>
            <h2 className="text-lg font-semibold text-gov-gray-900">
              {item.entityName || item.entityType}
            </h2>
          </div>
          <Badge variant="yellow">{AUDIT_STATUS.PENDING}</Badge>
        </div>

        <Card className="p-5 space-y-3">
          <SectionTitle>Submission details</SectionTitle>
          {submittedInfo}
        </Card>


        {item.entityType === 'news' && (
          <Card className="p-5 space-y-4">
            <SectionTitle>Article preview</SectionTitle>
            <div className="space-y-2">
              <p className="text-xs uppercase text-gov-gray-500">Headline</p>
              <p className="text-lg font-semibold text-gov-gray-900">{item.payload?.article?.title}</p>
            </div>
            {item.payload?.article?.summary && (
              <div className="space-y-2">
                <p className="text-xs uppercase text-gov-gray-500">Summary</p>
                <p className="text-sm text-gov-gray-700">{item.payload.article.summary}</p>
              </div>
            )}
            {item.payload?.article?.content && (
              <div className="space-y-2">
                <p className="text-xs uppercase text-gov-gray-500">Content</p>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.payload.article.content }}
                />
              </div>
            )}
          </Card>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gov-gray-900" htmlFor="decision-notes">
            Reviewer notes (optional)
          </label>
          <Textarea
            id="decision-notes"
            placeholder="Add context for your decision"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={isApproving || isRejecting}>
            Close
          </Button>
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={isApproving || isRejecting}
          >
            {isRejecting ? 'Rejecting…' : 'Reject'}
          </Button>
          <Button onClick={handleApprove} disabled={isApproving || isRejecting}>
            {isApproving ? 'Approving…' : 'Approve'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AuditDetailModal;
