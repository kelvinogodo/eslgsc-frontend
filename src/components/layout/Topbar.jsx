import { Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import useAuth from '../../context/useAuth';
import {
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { getInitials } from '../../lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getDashboardNotifications } from '../../services/dashboardService';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: metrics } = useQuery({
    queryKey: ['dashboard', 'notifications'],
    queryFn: getDashboardNotifications,
    refetchInterval: 60_000
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = useMemo(() => {
    if (!metrics) return [];
    const items = [];
    if (metrics.pendingAudits) {
      items.push({
        id: 'pending-audits',
        message: `${metrics.pendingAudits} submission${metrics.pendingAudits > 1 ? 's' : ''} awaiting approval`,
        link: '/dashboard/audit-queue'
      });
    }
    return items;
  }, [metrics]);

  const unreadCount = notifications.length;

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 bg-white border-b border-gov-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - could add search or breadcrumbs */}
        <div className="flex-1">
          {/* Placeholder for future search or quick actions */}
        </div>

        {/* Right side - Notifications & User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button
              className="relative p-2 text-gov-gray-600 hover:text-gov-blue-700 hover:bg-gov-gray-50 rounded-lg transition-colors"
              aria-label={unreadCount > 0 ? `Notifications. ${unreadCount} unread.` : 'Notifications'}
              aria-haspopup="true"
            >
              <BellIcon className="w-5 h-5" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white" aria-hidden="false" aria-live="polite">
                  <span className="sr-only">{unreadCount} unread notifications</span>
                  <span aria-hidden="true">{Math.min(unreadCount, 9)}</span>
                </span>
              )}
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="p-4 border-b border-gov-gray-200">
                  <h3 className="font-semibold text-gov-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-gov-gray-500 text-center">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <Menu.Item key={notif.id}>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              if (notif.link) {
                                navigate(notif.link);
                              }
                            }}
                            className={`w-full text-left px-4 py-3 border-b border-gov-gray-100 last:border-0 ${
                              active ? 'bg-gov-gray-50' : ''
                            }`}
                          >
                            <p className="text-sm text-gov-gray-700">{notif.message}</p>
                          </button>
                        )}
                      </Menu.Item>
                    ))
                  )}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button aria-haspopup="true" className="flex items-center space-x-2 p-2 hover:bg-gov-gray-50 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-gov-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {user?.name ? getInitials(user.name) : 'U'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gov-gray-900">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-gov-gray-500 capitalize">
                  {user?.role?.toLowerCase() || 'Role'}
                </div>
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-gov-gray-50' : ''
                        } flex w-full items-center space-x-2 px-4 py-2 text-sm text-gov-gray-700`}
                      >
                        <UserCircleIcon className="w-5 h-5" />
                        <span>Profile</span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-gov-gray-50' : ''
                        } flex w-full items-center space-x-2 px-4 py-2 text-sm text-gov-gray-700`}
                      >
                        <Cog6ToothIcon className="w-5 h-5" />
                        <span>Settings</span>
                      </button>
                    )}
                  </Menu.Item>
                  <div className="border-t border-gov-gray-200 my-1" />
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-gov-gray-50' : ''
                        } flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600`}
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
