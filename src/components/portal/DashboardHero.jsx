import { motion } from 'framer-motion';
import useAuth from '../../context/useAuth';
import { greeting } from '../../lib/utils';
import { ROLE_LABELS } from '../../lib/navigation';
import { EASE } from './motionVariants';

/**
 * Personal welcome banner at the top of every role's home page. `children`
 * (usually one or two buttons) sit on the right.
 */
const DashboardHero = ({ message, children }) => {
  const { user } = useAuth();
  const first = user?.name?.split(' ')[0] || 'there';
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 p-7 text-white shadow-xl shadow-brand-900/20 sm:p-9"
    >
      <div className="bg-dots absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="absolute -right-10 -top-16 h-64 w-64 animate-float-slow rounded-full bg-gold-400/25 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-20 left-1/3 h-56 w-56 animate-float-slower rounded-full bg-brand-400/25 blur-3xl" aria-hidden="true" />
      <svg className="absolute -right-24 -top-24 h-80 w-80 opacity-[0.14]" viewBox="0 0 200 200" fill="none" aria-hidden="true">
        <circle cx="100" cy="100" r="92" stroke="#f6d77a" strokeWidth="3" />
        <circle cx="100" cy="100" r="70" stroke="#f6d77a" strokeWidth="1.2" strokeDasharray="3 6" />
      </svg>

      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="mb-2 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-gold-200">
            <span>{today}</span>
            <span className="h-1 w-1 rounded-full bg-gold-300" />
            <span>{ROLE_LABELS[user?.role]}</span>
          </p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-[2.15rem]">
            {greeting()}, {first}
          </h1>
          {message && <p className="mt-2 text-[0.98rem] leading-relaxed text-brand-100/85">{message}</p>}
        </div>
        {children && <div className="flex flex-wrap gap-3">{children}</div>}
      </div>
    </motion.section>
  );
};

export default DashboardHero;
