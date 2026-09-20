import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Avatar from '../../portal/Avatar';
import { describeActivity } from '../../../lib/activity';
import { formatDateTime } from '../../../lib/utils';

const Row = ({ label, children }) => (
  <div>
    <dt className="text-xs font-bold uppercase tracking-wide text-ink-400">{label}</dt>
    <dd className="mt-1 text-[0.95rem] font-semibold text-ink-900">{children || <span className="font-normal text-ink-300">—</span>}</dd>
  </div>
);

const ActivityDetailModal = ({ entry, isOpen, onClose }) => {
  if (!entry) return null;
  const d = describeActivity(entry);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="What happened">
      <div className="space-y-5">
        <div className="flex items-center gap-4 rounded-2xl bg-ink-50/70 p-4">
          <Avatar name={d.actor} size="lg" />
          <p className="text-[1.02rem] leading-snug text-ink-700"><span className="font-extrabold text-ink-900">{d.actor}</span> {d.text}</p>
        </div>

        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <Row label="When">{formatDateTime(entry.timestamp)}</Row>
          <Row label="Action">{entry.action}</Row>
          <Row label="What it was about">{entry.entityType}</Row>
          <Row label="Name">{entry.entityName}</Row>
        </dl>

        {entry.details && Object.keys(entry.details).length > 0 && (
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

export default ActivityDetailModal;
