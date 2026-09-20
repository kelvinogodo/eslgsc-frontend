import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { fadeUp } from './motionVariants';

const tones = {
  emerald: 'bg-brand-50 text-brand-700 group-hover:bg-brand-600 group-hover:text-white',
  gold: 'bg-gold-50 text-gold-600 group-hover:bg-gold-400 group-hover:text-ink-900',
  ink: 'bg-ink-50 text-ink-600 group-hover:bg-ink-700 group-hover:text-white'
};

/** Big, obvious "do this next" button-card with a one-line explanation. */
const ActionTile = ({ to, icon: Icon, title, description, tone = 'emerald' }) => (
  <motion.div variants={fadeUp} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 320, damping: 24 }}>
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-sm transition-shadow hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5"
    >
      <span className={clsx('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300', tones[tone])}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-ink-900">{title}</span>
        {description && <span className="block text-sm leading-snug text-ink-500">{description}</span>}
      </span>
      <ArrowRightIcon className="h-5 w-5 shrink-0 text-ink-300 transition-all group-hover:translate-x-1 group-hover:text-brand-600" aria-hidden="true" />
    </Link>
  </motion.div>
);

export default ActionTile;
