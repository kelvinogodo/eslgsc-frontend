import { forwardRef, useMemo, useState } from 'react';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { passwordChecks, passwordScore } from '../../lib/password';

const strengthMeta = [
  { label: 'Too short', bar: 'bg-red-400', text: 'text-red-600' },
  { label: 'Weak', bar: 'bg-red-400', text: 'text-red-600' },
  { label: 'Okay', bar: 'bg-gold-400', text: 'text-gold-600' },
  { label: 'Good', bar: 'bg-brand-400', text: 'text-brand-700' },
  { label: 'Strong', bar: 'bg-brand-600', text: 'text-brand-700' }
];

/**
 * Password input with a show/hide toggle. With `showStrength` it also lists the
 * rules and ticks them off live, so nobody has to guess why a password failed.
 */
const PasswordField = forwardRef(({ label, error, showStrength = false, value = '', helperText, className, id, ...props }, ref) => {
  const [visible, setVisible] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const inputId = id || props.name;
  const checks = useMemo(() => passwordChecks(value), [value]);
  const score = passwordScore(value);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-bold text-ink-700">{label}</label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={visible ? 'text' : 'password'}
          value={value}
          onKeyUp={(e) => setCapsOn(e.getModifierState?.('CapsLock') ?? false)}
          onBlur={() => setCapsOn(false)}
          aria-invalid={error ? 'true' : undefined}
          className={clsx('input pr-12', error && 'border-red-400 focus:border-red-500', className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-1.5 my-auto flex h-9 w-9 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700"
        >
          {visible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>

      {capsOn && <p className="mt-1.5 text-sm font-semibold text-gold-600">Caps Lock is on</p>}
      {error && <p className="mt-1.5 text-sm font-semibold text-red-600" role="alert">{error}</p>}
      {!error && helperText && <p className="mt-1.5 text-sm text-ink-500">{helperText}</p>}

      {showStrength && (
        <div className="mt-3 space-y-2.5" aria-live="polite">
          <div className="flex items-center gap-3">
            <div className="flex flex-1 gap-1.5">
              {[1, 2, 3, 4].map((n) => (
                <span
                  key={n}
                  className={clsx('h-1.5 flex-1 rounded-full transition-colors duration-300', score >= n ? strengthMeta[score].bar : 'bg-ink-100')}
                />
              ))}
            </div>
            <span className={clsx('w-16 text-right text-xs font-bold', value ? strengthMeta[score].text : 'text-ink-300')}>
              {value ? strengthMeta[score].label : ''}
            </span>
          </div>
          <ul className="grid gap-1">
            {checks.map((c) => (
              <li key={c.id} className={clsx('flex items-center gap-2 text-[0.82rem] font-medium transition-colors', c.ok ? 'text-brand-700' : 'text-ink-400')}>
                <CheckCircleIcon className={clsx('h-4 w-4 transition-colors', c.ok ? 'text-brand-500' : 'text-ink-200')} />
                {c.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

PasswordField.displayName = 'PasswordField';

export default PasswordField;
