import { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, PencilIcon, WifiIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Spinner from '../../../ui/Spinner';
import { timeAgo } from '../../../../lib/utils';

const useTick = (ms) => {
  const [, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((n) => n + 1), ms);
    return () => clearInterval(t);
  }, [ms]);
};

/** Tells the writer, in words, whether their work is safe. */
const SaveIndicator = ({ state, lastSavedAt, hasTitle, offline, onRetry, locked }) => {
  useTick(30000);

  let icon = CheckCircleIcon;
  let tone = 'text-ink-400';
  let text = hasTitle ? 'Changes are saved automatically' : 'Add a headline to start saving';

  if (locked) {
    icon = CheckCircleIcon; text = 'Read-only while under review';
  } else if (offline) {
    icon = WifiIcon; tone = 'text-gold-600'; text = 'You’re offline — your work is kept on this computer';
  } else if (state === 'saving') {
    icon = null; tone = 'text-ink-500'; text = 'Saving…';
  } else if (state === 'error') {
    icon = ExclamationTriangleIcon; tone = 'text-red-600'; text = 'Couldn’t save.';
  } else if (state === 'dirty') {
    icon = PencilIcon; tone = 'text-ink-500'; text = hasTitle ? 'Unsaved changes…' : 'Add a headline to start saving';
  } else if (state === 'saved' && lastSavedAt) {
    icon = CheckCircleIcon; tone = 'text-brand-700'; text = `All changes saved · ${timeAgo(lastSavedAt)}`;
  }

  const Icon = icon;
  return (
    <span className={clsx('inline-flex items-center gap-2 text-sm font-semibold', tone)} role="status" aria-live="polite">
      {Icon ? <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" /> : <Spinner size="xs" label="Saving" />}
      <span className="hidden sm:inline">{text}</span>
      {state === 'error' && !offline && (
        <button type="button" onClick={onRetry} className="font-extrabold underline underline-offset-2 hover:text-red-700">Try again</button>
      )}
    </span>
  );
};

export default SaveIndicator;
