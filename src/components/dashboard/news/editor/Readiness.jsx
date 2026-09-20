import { CheckIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Ring = ({ percent }) => {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-ink-100" />
        <motion.circle
          cx="32" cy="32" r={r} fill="none" strokeWidth="6" strokeLinecap="round"
          className={percent === 100 ? 'text-brand-500' : 'text-gold-400'}
          stroke="currentColor"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c - (c * percent) / 100 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-ink-800">{percent}%</span>
    </div>
  );
};

/** "Is it ready?" — a friendly checklist instead of surprise error messages on submit. */
const Readiness = ({ items, words, minutes }) => {
  const done = items.filter((i) => i.ok).length;
  const percent = Math.round((done / items.length) * 100);
  const requiredMissing = items.filter((i) => i.required && !i.ok).length;

  return (
    <div>
      <div className="flex items-center gap-4">
        <Ring percent={percent} />
        <div>
          <p className="font-extrabold text-ink-900">{requiredMissing === 0 ? 'Ready to send' : 'Almost there'}</p>
          <p className="text-xs text-ink-500">
            {words} word{words === 1 ? '' : 's'} · about {minutes} min read
          </p>
        </div>
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i.id} className="flex items-start gap-3">
            <span
              className={clsx(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors',
                i.ok ? 'bg-brand-500 text-white' : i.required ? 'bg-ink-100 text-transparent ring-1 ring-ink-200' : 'bg-white ring-1 ring-dashed ring-ink-200'
              )}
            >
              <CheckIcon className="h-3 w-3" />
            </span>
            <span>
              <span className={clsx('block text-sm font-bold', i.ok ? 'text-ink-800' : 'text-ink-600')}>
                {i.label}{!i.required && <span className="ml-1.5 text-xs font-semibold text-ink-300">optional</span>}
              </span>
              {!i.ok && <span className="block text-xs text-ink-400">{i.detail}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Readiness;
