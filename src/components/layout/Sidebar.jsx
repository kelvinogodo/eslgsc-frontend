import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import useAuth from '../../context/useAuth';
import { useRetirementSummary } from '../../hooks/useRetirementSummary';
import { getDashboardNotifications } from '../../services/dashboardService';
import { navForRole } from '../../lib/navigation';
import Logo from '../portal/Logo';
import { EASE } from '../portal/motionVariants';

const NavItem = ({ item, badge, onNavigate }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.href}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        clsx(
          'relative flex items-center gap-3 rounded-lg px-3 py-2 text-[0.93rem] font-semibold transition-colors',
          isActive
            ? 'bg-brand-50 text-brand-800 before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-brand-500'
            : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={clsx('h-5 w-5 shrink-0', isActive ? 'text-brand-600' : 'text-ink-400')} aria-hidden="true" />
          <span className="flex-1 truncate">{item.name}</span>
          {badge > 0 && (
            <span className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-gold-400 px-2 py-0.5 text-xs font-bold text-ink-900">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

const SidebarBody = ({ onNavigate }) => {
  const { user } = useAuth();
  const groups = navForRole(user?.role);
  const { data: retire } = useRetirementSummary(user?.role);

  const { data: counts } = useQuery({
    queryKey: ['dashboard', 'notifications'],
    queryFn: getDashboardNotifications,
    refetchInterval: 60_000,
    enabled: ['SUPER_ADMIN', 'ADMIN', 'AUDIT', 'MEDIA_ADMIN'].includes(user?.role)
  });
  const badges = { ...counts, retiring: retire?.upcoming };

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-4 pt-6">
        <Logo />
      </div>

      <nav aria-label="Main navigation" className="scroll-soft flex-1 space-y-5 overflow-y-auto px-3 pb-6">
        {groups.map((group, gi) => (
          <div key={group.label || gi}>
            {group.label && (
              <p className="mb-1.5 px-3 text-xs font-bold uppercase tracking-wider text-ink-400">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem key={item.href} item={item} badge={item.badge ? badges[item.badge] : 0} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 border-t border-ink-100 px-6 py-4 text-sm font-semibold text-ink-500 hover:text-brand-700"
      >
        Public website
        <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
};

const Sidebar = ({ open, onClose }) => (
  <>
    {/* Desktop: always visible */}
    <aside
      aria-label="Sidebar"
      className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-ink-100 bg-white lg:block"
    >
      <SidebarBody />
    </aside>

    {/* Mobile: slide-in drawer */}
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 bg-ink-900/50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            key="drawer"
            aria-label="Sidebar"
            className="fixed inset-y-0 left-0 z-50 w-[19rem] max-w-[85vw] bg-white shadow-xl lg:hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="absolute right-3 top-4 z-10 rounded-xl p-2 text-ink-500 hover:bg-ink-50"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <SidebarBody onNavigate={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  </>
);

export default Sidebar;
