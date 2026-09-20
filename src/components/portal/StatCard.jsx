import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import AnimatedNumber from './AnimatedNumber';
import { fadeUp } from './motionVariants';

const tones = {
  emerald: 'from-brand-500 to-brand-700 shadow-brand-700/25',
  gold: 'from-gold-300 to-gold-500 shadow-gold-500/30',
  ink: 'from-ink-500 to-ink-800 shadow-ink-800/25',
  red: 'from-red-400 to-red-600 shadow-red-600/25'
};

/**
 * Headline number with an icon. Pass `href` to make the whole card a link.
 * Use inside <Stagger> so a row of cards animates in one after another.
 */
const StatCard = ({ label, value, icon: Icon, hint, href, tone = 'emerald', loading = false, cta = 'Open' }) => {
  const body = (
    <motion.div
      variants={fadeUp}
      whileHover={href ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={clsx(
        'group card relative h-full overflow-hidden p-5 sm:p-6',
        href && 'cursor-pointer hover:shadow-xl hover:shadow-brand-900/10'
      )}
    >
      <div className="flex items-start justify-between">
        <span className={clsx('flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg', tones[tone])}>
          {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
        </span>
        {href && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-400 transition-colors group-hover:text-brand-700">
            {cta}
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="mt-5 text-[2rem] font-extrabold leading-none tracking-tight text-ink-900">
        {loading ? <span className="block h-8 w-20 animate-pulse rounded-lg bg-ink-100" /> : <AnimatedNumber value={value} />}
      </div>
      <p className="mt-2 text-sm font-semibold text-ink-600">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-ink-400">{hint}</p>}
      <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-50 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
    </motion.div>
  );
  return href ? <Link to={href} className="block h-full">{body}</Link> : body;
};

export default StatCard;
