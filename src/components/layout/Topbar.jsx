import { Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import useAuth from '../../context/useAuth';
import Avatar from '../portal/Avatar';
import { useRetirementSummary } from '../../hooks/useRetirementSummary';
import { getDashboardNotifications } from '../../services/dashboardService';
import { ROLE_LABELS } from '../../lib/navigation';

const menuItem = (active) =>
  clsx(
    'flex w-full items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
    active ? 'bg-ink-50 text-ink-900' : 'text-ink-700'
  );

const dropdown = {
  as: Fragment,
  enter: 'transition ease-out duration-100',
  enterFrom: 'opacity-0 -translate-y-1',
  enterTo: 'opacity-100 translate-y-0',
  leave: 'transition ease-in duration-75',
  leaveFrom: 'opacity-100',
  leaveTo: 'opacity-0'
};

const Topbar = ({ onMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: metrics } = useQuery({
    queryKey: ['dashboard', 'notifications'],
    queryFn: getDashboardNotifications,
    refetchInterval: 60_000,
    enabled: ['SUPER_ADMIN', 'ADMIN', 'AUDIT', 'MEDIA_ADMIN'].includes(user?.role)
  });

  const { data: retire } = useRetirementSummary(user?.role);

  const notifications = useMemo(() => {
    const items = [];
    if (retire?.upcoming) {
      items.push({
        id: 'retirements',
        message: `${retire.upcoming} staff retiring in the next 4 months`,
        link: '/dashboard/retirements'
      });
    }
    if (metrics?.pendingAudits && ['SUPER_ADMIN', 'ADMIN', 'AUDIT'].includes(user?.role)) {
      items.push({
        id: 'pending-audits',
        message: `${metrics.pendingAudits} item${metrics.pendingAudits > 1 ? 's' : ''} waiting for review`,
        link: '/dashboard/audit-queue'
      });
    }
    return items;
  }, [metrics, retire, user?.role]);

  return (
    <header className="fixed inset-x-0 top-0 z-30 h-16 border-b border-ink-100 bg-white lg:left-72">
      <div className="flex h-full items-center gap-2 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="-ml-1 rounded-xl p-2.5 text-ink-600 transition-colors hover:bg-ink-50 lg:hidden"
        >
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="flex-1" />

        {/* Notifications */}
        <Menu as="div" className="relative">
          <Menu.Button
            className="relative rounded-xl p-2.5 text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-800"
            aria-label={notifications.length ? `Notifications, ${notifications.length} new` : 'Notifications'}
          >
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            {notifications.length > 0 && (
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-gold-400 ring-2 ring-white" />
            )}
          </Menu.Button>
          <Transition {...dropdown}>
            <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="border-b border-ink-100 px-4 py-3 text-sm font-bold text-ink-900">Notifications</div>
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-sm text-ink-500">No new notifications.</p>
              ) : (
                notifications.map((n) => (
                  <Menu.Item key={n.id}>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => navigate(n.link)}
                        className={clsx('block w-full px-4 py-3 text-left text-sm font-semibold text-ink-800', active && 'bg-ink-50')}
                      >
                        {n.message}
                      </button>
                    )}
                  </Menu.Item>
                ))
              )}
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Account */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-3 rounded-xl p-1.5 pr-3 transition-colors hover:bg-ink-50" aria-label="Account menu">
            <Avatar name={user?.name} size="sm" />
            <span className="hidden text-left leading-tight md:block">
              <span className="block max-w-[10rem] truncate text-sm font-bold text-ink-900">{user?.name}</span>
              <span className="block text-xs text-ink-400">{ROLE_LABELS[user?.role]}</span>
            </span>
          </Menu.Button>
          <Transition {...dropdown}>
            <Menu.Items className="absolute right-0 mt-2 w-60 origin-top-right rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-3 pb-2 pt-1.5">
                <p className="truncate text-sm font-bold text-ink-900">{user?.name}</p>
                <p className="truncate text-xs text-ink-400">{user?.email}</p>
              </div>
              <div className="my-1 border-t border-ink-100" />
              <Menu.Item>
                {({ active }) => (
                  <button type="button" className={menuItem(active)} onClick={() => navigate('/dashboard/profile')}>My profile</button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button type="button" className={menuItem(active)} onClick={() => navigate('/dashboard/help')}>Help</button>
                )}
              </Menu.Item>
              <div className="my-1 border-t border-ink-100" />
              <Menu.Item>
                {({ active }) => (
                  <button type="button" onClick={logout} className={clsx(menuItem(active), '!text-red-600', active && '!bg-red-50')}>
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default Topbar;
