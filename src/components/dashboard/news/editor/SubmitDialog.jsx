import { CheckCircleIcon, XCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';

/**
 * Last step before sending. Shows exactly what is (and isn't) ready, and says in
 * plain words what will happen next — differently for people who publish directly.
 */
const SubmitDialog = ({ isOpen, onClose, onConfirm, checklist, publishes, loading }) => {
  const blockers = checklist.filter((i) => i.required && !i.ok);
  const canSend = blockers.length === 0;

  return (
    <Modal isOpen={isOpen} onClose={loading ? () => {} : onClose} title={publishes ? 'Publish this article?' : 'Send this article for review?'} size="md">
      <p className="text-[0.95rem] leading-relaxed text-ink-600">
        {publishes
          ? 'It will go live on the website straight away.'
          : 'A reviewer will read it before it goes on the website. While it is being reviewed you won’t be able to change it — if they ask for changes, it comes back to you.'}
      </p>

      <ul className="mt-5 space-y-2.5 rounded-2xl bg-ink-50/70 p-4">
        {checklist.map((i) => (
          <li key={i.id} className="flex items-start gap-3">
            {i.ok ? (
              <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
            ) : (
              <XCircleIcon className={clsx('mt-0.5 h-5 w-5 shrink-0', i.required ? 'text-red-500' : 'text-ink-300')} aria-hidden="true" />
            )}
            <span className="text-sm">
              <span className="font-bold text-ink-800">{i.label}</span>
              {!i.ok && <span className="block text-ink-500">{i.required ? `Needed: ${i.detail}` : i.detail}</span>}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {canSend ? 'Not yet' : 'Go back and finish'}
        </Button>
        {canSend && (
          <Button onClick={onConfirm} disabled={loading}>
            <PaperAirplaneIcon className="mr-2 h-5 w-5" aria-hidden="true" />
            {loading ? 'Sending…' : publishes ? 'Publish now' : 'Send for review'}
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default SubmitDialog;
