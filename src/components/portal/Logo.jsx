import { Link } from 'react-router-dom';
import clsx from 'clsx';

/** Brand mark + wordmark. `tone="light"` is for dark/brand backgrounds. */
const Logo = ({ to = '/dashboard', tone = 'dark', size = 'md', subtitle = 'Staff Portal', className }) => {
  const box = size === 'lg' ? 'h-14 w-14' : size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';
  const content = (
    <span className={clsx('inline-flex items-center gap-3', className)}>
      <img src="/favicon.svg" alt="" className={clsx(box, 'rounded-xl shadow-md shadow-brand-900/20')} />
      <span className="leading-tight">
        <span className={clsx('block font-extrabold tracking-tight', size === 'lg' ? 'text-2xl' : 'text-lg', tone === 'light' ? 'text-white' : 'text-ink-900')}>
          ESLGSC
        </span>
        <span className={clsx('block text-xs font-medium', tone === 'light' ? 'text-brand-100/80' : 'text-ink-500')}>
          {subtitle}
        </span>
      </span>
    </span>
  );
  return to ? <Link to={to} className="inline-flex" aria-label="ESLGSC home">{content}</Link> : content;
};

export default Logo;
