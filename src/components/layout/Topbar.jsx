import { Fragment, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import useAuth from '../../context/useAuth';
import Avatar from '../portal/Avatar';
import { getDashboardNotifications } from '../../services/dashboardService';
import { getPageMeta, ROLE_LABELS } from '../../lib/navigation';

const menuItem = (active) =>
  clsx(
    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
    active ? 'bg-brand-50 text-brand-800' : 'text-ink-700'
  );

const Topbar = ({ onMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const meta = getPageMeta(location.pathname);

  const { data: metrics } = useQuery({
    queryKey: ['dashboard', 'notifications'],
    queryFn: getDashboardNotifications,
    refetchInterval: 60_000,
    enabled: ['SUPER_ADMIN', 'ADMIN', 'AUDIT', 'MEDIA_ADMIN'].includes(user?.role)
  });

  const notifications = useMemo(() => {
    const items = [];
    if (metrics?.pendingAudits && ['SUPER_ADMIN', 'ADMIN', 'AUDIT'].includes(user?.role)) {
      items.push({
        id: 'pending-audits',
        message: `${metrics.pendingAudits} item${metrics.pendingAudits > 1 ? 's' : ''} waiting for review`,
        link: '/dashboard/audit-queue'
      });
    }
    return items;
  }, [metrics, user?.role]);

  return (
    <header className="fixed inset-x-0 top-0 z-30 h-16 border-b border-ink-100 bg-white/85 backdrop-blur-xl lg:left-72">
      <div className="flex h-full items-center gap-3 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="-ml-1 rounded-xl p-2.5 text-ink-600 transition-colors hover:bg-ink-50 lg:hidden"
        >
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Where am I? */}
        <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-2 text-sm">
          <Link to="/dashboard" className="hidden font-semibold text-ink-400 hover:text-brand-700 sm:inline">Portal</Link>
          <ChevronRightIcon className="hidden h-4 w-4 text-ink-300 sm:block" aria-hidden="true" />
          {meta.trail.map((t) => (
            <Fragment key={t.href}>
              <Link to={t.href} className="hidden font-semibold text-ink-400 hover:text-brand-700 sm:inline">{t.name}</Link>
              <ChevronRightIcon className="hidden h-4 w-4 text-ink-300 sm:block" aria-hidden="true" />
            </Fragment>
          ))}
          <span className="truncate font-extrabold text-ink-900" aria-current="page">{meta.title}</span>
        </nav>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-ink-500 transition-colors hover:bg-ink-50 hover:text-brand-700 md:inline-flex"
        >
          View public site
          <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
        </a>

        {/* Notifications */}
        <Menu as="div" className="relative">
          <Menu.Button
            className="relative rounded-xl p-2.5 text-ink-600 transition-colors hover:bg-ink-50"
            aria-label={notifications.length ? `Notifications, ${notifications.length} new` : 'Notifications'}
          >
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            {notifications.length > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-400 text-[0.65rem] font-extrabold text-ink-900 ring-2 ring-white">
                {Math.min(notifications.length, 9)}
              </span>
            )}
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right overflow-hidden rounded-2xl bg-white shadow-2xl shadow-ink-900/15 ring-1 ring-black/5 focus:outline-none">
              <div className="border-b border-ink-100 px-4 py-3 text-sm font-extrabold text-ink-900">Notifications</div>
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm font-semibold text-ink-700">You’re all caught up</p>
                  <p className="mt-1 text-xs text-ink-400">Nothing needs your attention right now.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <Menu.Item key={n.id}>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => navigate(n.link)}
                        className={clsx('flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-ink-800', active && 'bg-brand-50')}
                      >
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gold-400" />
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
          <Menu.Button className="flex items-center gap-3 rounded-2xl p-1.5 pr-3 transition-colors hover:bg-ink-50" aria-label="Account menu">
            <Avatar name={user?.name} size="sm" />
            <span className="hidden text-left leading-tight md:block">
              <span className="block max-w-[10rem] truncate text-sm font-bold text-ink-900">{user?.name}</span>
              <span className="block text-xs text-ink-400">{ROLE_LABELS[user?.role]}</span>
            </span>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl bg-white p-2 shadow-2xl shadow-ink-900/15 ring-1 ring-black/5 focus:outline-none">
              <div className="px-3 pb-2 pt-1.5">
                <p className="truncate text-sm font-extrabold text-ink-900">{user?.name}</p>
                <p className="truncate text-xs text-ink-400">{user?.email}</p>
              </div>
              <div className="my-1 border-t border-ink-100" />
              <Menu.Item>
                {({ active }) => (
                  <button type="button" className={menuItem(active)} onClick={() => navigate('/dashboard/profile')}>
                    <UserCircleIcon className="h-5 w-5" aria-hidden="true" /> My profile &amp; password
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button type="button" className={menuItem(active)} onClick={() => navigate('/dashboard/help')}>
                    <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" /> Help &amp; guides
                  </button>
                )}
              </Menu.Item>
              <div className="my-1 border-t border-ink-100" />
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={logout}
                    className={clsx(menuItem(active), active ? '!bg-red-50 !text-red-700' : '!text-red-600')}
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" /> Sign out
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
