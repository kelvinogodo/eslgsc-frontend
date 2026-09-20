import { useId } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

/** Pill-style switch between a few views (e.g. Edit | Preview). */
const SegmentedControl = ({ options, value, onChange, className, size = 'md', label }) => {
  const id = useId();
  return (
    <div
      role="tablist"
      aria-label={label}
      className={clsx('relative inline-flex rounded-2xl bg-ink-50 p-1 ring-1 ring-ink-100', className)}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={clsx(
              'relative z-10 inline-flex items-center gap-2 rounded-xl font-semibold transition-colors',
              size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-[0.92rem]',
              active ? 'text-ink-900' : 'text-ink-500 hover:text-ink-800'
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 -z-10 rounded-xl bg-white shadow-sm ring-1 ring-ink-100"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            {opt.label}
            {typeof opt.count === 'number' && (
              <span className={clsx('rounded-full px-2 py-0.5 text-xs font-bold', active ? 'bg-brand-100 text-brand-800' : 'bg-ink-100 text-ink-500')}>
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
