import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

/**
 * "Are you sure?" box. Always says what will happen, and the safe option
 * (Cancel) is the visually calmer one.
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  children,
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel',
  tone = 'primary',
  loading = false
}) => {
  const danger = tone === 'danger';
  return (
    <Modal isOpen={isOpen} onClose={loading ? () => {} : onClose} size="sm" showCloseButton={false}>
      <div className="flex gap-4">
        {danger && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <ExclamationTriangleIcon className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold text-ink-900">{title}</h3>
          {message && <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-500">{message}</p>}
          {children}
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} disabled={loading}>
          {loading ? 'Please wait…' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
