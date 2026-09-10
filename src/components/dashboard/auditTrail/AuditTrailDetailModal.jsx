import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import { formatDate } from '../../../lib/utils';

const AuditTrailDetailModal = ({ entry, isOpen, onClose }) => {
  if (!entry) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Smart Onboarding activity details">
      <div className="space-y-5 text-sm text-gov-gray-700">
        <div className="space-y-1">
          <p className="text-xs uppercase text-gov-gray-500">Action</p>
          <p className="text-base font-semibold text-gov-gray-900">{entry.action}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-gov-gray-500">Entity</p>
            {entry.entity_type && <Badge variant="blue">{entry.entity_type}</Badge>}
            <p className="text-sm text-gov-gray-900 mt-1">{entry.entity_id || '—'}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-gov-gray-500">Timestamp</p>
            <p className="text-sm text-gov-gray-900">{formatDate(entry.created_at)}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-gov-gray-500">IP Address</p>
            <p className="text-sm text-gov-gray-900">{entry.ip_address || '—'}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-gov-gray-500">User Agent</p>
            <p className="text-xs text-gov-gray-600 break-words">{entry.user_agent || '—'}</p>
          </div>
        </div>

        {entry.details && (
          <div className="space-y-2">
            <p className="text-xs uppercase text-gov-gray-500">Context</p>
            <pre className="bg-gov-gray-900/5 rounded-lg p-4 text-xs text-gov-gray-700 whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(entry.details, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-right">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AuditTrailDetailModal;
