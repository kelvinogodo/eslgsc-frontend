import clsx from 'clsx';
import { getInitials } from '../../lib/utils';

const palette = [
  'from-brand-500 to-brand-700',
  'from-gold-400 to-gold-600',
  'from-ink-400 to-ink-700',
  'from-teal-400 to-teal-700',
  'from-emerald-400 to-emerald-700'
];

const hash = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0);

const Avatar = ({ name, size = 'md', className }) => {
  const dims = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg', xl: 'h-20 w-20 text-2xl' }[size];
  return (
    <span
      aria-hidden="true"
      className={clsx(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white shadow-sm',
        palette[hash(name) % palette.length],
        dims,
        className
      )}
    >
      {name ? getInitials(name) : 'U'}
    </span>
  );
};

export default Avatar;
