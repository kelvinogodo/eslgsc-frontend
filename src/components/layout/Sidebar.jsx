import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import useAuth from '../../context/useAuth';
import { useRetirementSummary } from '../../hooks/useRetirementSummary';
import { getDashboardNotifications } from '../../services/dashboardService';
import { navForRole, ROLE_LABELS } from '../../lib/navigation';
import Logo from '../portal/Logo';
import Avatar from '../portal/Avatar';
import { EASE } from '../portal/motionVariants';

const NavItem = ({ item, badge, onNavigate }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.href}
      end={item.end}
      onClick={onNavigate}
      className="group relative block rounded-xl outline-none"
    >
      {({ isActive }) => (
        <span
          className={clsx(
            'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.93rem] font-semibold transition-colors',
            isActive ? 'text-brand-800' : 'text-ink-600 group-hover:text-ink-900'
          )}
        >
          {isActive && (
            <motion.span
              layoutId="sidebar-active"
              className="absolute inset-0 rounded-xl bg-brand-50 ring-1 ring-brand-100"
              transition={{ type: 'spring', stiffness: 400, damping: 34 }}
            >
              <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-brand-500" />
            </motion.span>
          )}
          <span
            className={clsx(
              'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all',
              isActive
                ? 'bg-brand-600 text-white shadow-md shadow-brand-700/30'
                : 'bg-ink-50 text-ink-500 group-hover:bg-white group-hover:text-brand-700 group-hover:shadow-sm'
            )}
          >
            <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
          </span>
          <span className="relative flex-1 truncate">{item.name}</span>
          {badge > 0 && (
            <span className="relative inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-gold-400 px-2 py-0.5 text-xs font-extrabold text-ink-900">
              {badge}
            </span>
          )}
        </span>
      )}
    </NavLink>
  );
};

const SidebarBody = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const groups = navForRole(user?.role);
  const { data: retire } = useRetirementSummary(user?.role);

  const { data: counts } = useQuery({
    queryKey: ['dashboard', 'notifications'],
    queryFn: getDashboardNotifications,
    refetchInterval: 60_000,
    enabled: ['SUPER_ADMIN', 'ADMIN', 'AUDIT', 'MEDIA_ADMIN'].includes(user?.role)
  });

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-4 pt-6">
        <Logo />
      </div>

      <nav aria-label="Main navigation" className="scroll-soft flex-1 space-y-5 overflow-y-auto px-3 pb-8 [mask-image:linear-gradient(to_bottom,black_calc(100%-2.5rem),transparent)]">
        {groups.map((group, gi) => (
          <div key={group.label || gi}>
            {group.label && (
              <p className="mb-1.5 px-3 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-ink-400">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavItem key={item.href} item={item} badge={item.badge ? ({ ...counts, retiring: retire?.upcoming })[item.badge] : 0} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="m-3 rounded-2xl bg-gradient-to-br from-brand-800 to-brand-950 p-4 text-white shadow-lg shadow-brand-900/25">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{user?.name || 'Signed in'}</p>
            <p className="truncate text-xs text-brand-100/80">{ROLE_LABELS[user?.role] || 'Staff'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ open, onClose }) => (
  <>
    {/* Desktop: always visible */}
    <aside
      aria-label="Sidebar"
      className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-ink-100 bg-white/95 backdrop-blur lg:block"
    >
      <SidebarBody />
    </aside>

    {/* Mobile: slide-in drawer */}
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            key="drawer"
            aria-label="Sidebar"
            className="fixed inset-y-0 left-0 z-50 w-[19rem] max-w-[85vw] bg-white shadow-2xl lg:hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: EASE }}
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
