import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { describeTrailAction } from '../../../lib/activity';
import { formatDateTime } from '../../../lib/utils';

const Row = ({ label, children, mono }) => (
  <div>
    <dt className="text-xs font-bold uppercase tracking-wide text-ink-400">{label}</dt>
    <dd className={`mt-1 break-words text-[0.95rem] font-semibold text-ink-900 ${mono ? 'font-mono text-sm' : ''}`}>{children || <span className="font-normal text-ink-300">—</span>}</dd>
  </div>
);

const AuditTrailDetailModal = ({ entry, isOpen, onClose }) => {
  if (!entry) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Enrollment system record">
      <div className="space-y-5">
        <p className="text-xl font-extrabold text-ink-900">{describeTrailAction(entry.action)}</p>
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <Row label="When">{formatDateTime(entry.created_at)}</Row>
          <Row label="Action code" mono>{entry.action}</Row>
          <Row label="About">{entry.entity_type}</Row>
          <Row label="Reference" mono>{entry.entity_id}</Row>
          <Row label="From address" mono>{entry.ip_address}</Row>
          <Row label="Device / browser">{entry.user_agent}</Row>
        </dl>
        {entry.details && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">More details</p>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl bg-ink-900 p-4 text-xs leading-relaxed text-brand-100">{JSON.stringify(entry.details, null, 2)}</pre>
          </div>
        )}
        <div className="flex justify-end"><Button variant="outline" onClick={onClose}>Close</Button></div>
      </div>
    </Modal>
  );
};

export default AuditTrailDetailModal;
