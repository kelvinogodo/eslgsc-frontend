import { forwardRef, useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';

/** A textarea that grows with its content and shows a live character counter. */
const AutoTextarea = forwardRef(({ value, onChange, max, warnAt, className, counter = true, ...props }, ref) => {
  const inner = useRef(null);
  const setRef = (el) => {
    inner.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const len = value?.length || 0;
  const over = max && len > max;
  const warn = warnAt && len >= warnAt;

  return (
    <div className="relative">
      <textarea
        ref={setRef}
        rows={1}
        value={value}
        onChange={onChange}
        maxLength={max ? max + 40 : undefined}
        className={clsx('block w-full resize-none overflow-hidden border-0 bg-transparent p-0 outline-none placeholder:text-ink-300 focus:ring-0', className)}
        {...props}
      />
      {counter && max && (
        <span
          aria-live="polite"
          className={clsx(
            'pointer-events-none mt-1 block text-right text-xs font-semibold tabular-nums transition-colors',
            over ? 'text-red-600' : warn ? 'text-gold-600' : 'text-ink-300'
          )}
        >
          {len}/{max}
        </span>
      )}
    </div>
  );
});

AutoTextarea.displayName = 'AutoTextarea';

export default AutoTextarea;
