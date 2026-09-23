import clsx from 'clsx';
import { getInitials } from '../../lib/utils';

const palette = ['bg-brand-600', 'bg-gold-500', 'bg-ink-500', 'bg-teal-600', 'bg-brand-800'];

const hash = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0);

const Avatar = ({ name, size = 'md', className }) => {
  const dims = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg', xl: 'h-20 w-20 text-2xl' }[size];
  return (
    <span
      aria-hidden="true"
      className={clsx(
        'inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white',
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
