import { ExclamationTriangleIcon, QuestionMarkCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const tones = {
  danger: { icon: ExclamationTriangleIcon, ring: 'bg-red-100 text-red-600' },
  primary: { icon: QuestionMarkCircleIcon, ring: 'bg-brand-100 text-brand-700' },
  success: { icon: CheckCircleIcon, ring: 'bg-brand-100 text-brand-700' }
};

/**
 * A plain-language "are you sure?" box. Always says what will happen, and the
 * safe option (Cancel) is the visually calmer one.
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  children,
  confirmLabel = 'Yes, continue',
  cancelLabel = 'Cancel',
  tone = 'primary',
  loading = false
}) => {
  const t = tones[tone] || tones.primary;
  const Icon = t.icon;
  return (
    <Modal isOpen={isOpen} onClose={loading ? () => {} : onClose} size="sm" showCloseButton={false}>
      <div className="flex gap-4">
        <span className={clsx('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', t.ring)}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold text-ink-900">{title}</h3>
          {message && <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-500">{message}</p>}
          {children}
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
        <Button
          variant={tone === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Please wait…' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
