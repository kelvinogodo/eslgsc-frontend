import { Link } from 'react-router-dom';
import clsx from 'clsx';

/**
 * A headline number. Pass `href` to make the whole card a link, and `alert`
 * when the number is something that needs dealing with.
 */
const StatCard = ({ label, value, hint, href, alert = false, loading = false }) => {
  const body = (
    <div className={clsx('card h-full p-5 sm:p-6', href && 'transition-colors hover:border-brand-300')}>
      <p className="text-sm font-semibold text-ink-500">{label}</p>
      <div className={clsx('mt-2 text-[2rem] font-extrabold leading-none tracking-tight', alert && value ? 'text-red-600' : 'text-ink-900')}>
        {loading ? <span className="block h-8 w-16 animate-pulse rounded-lg bg-ink-100" /> : Number(value || 0).toLocaleString()}
      </div>
      {hint && <p className="mt-2 text-xs text-ink-400">{hint}</p>}
    </div>
  );
  return href ? <Link to={href} className="block h-full">{body}</Link> : body;
};

export default StatCard;
