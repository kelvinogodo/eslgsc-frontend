import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../context/useAuth';
import { getAllNews } from '../../services/newsService';
import { NEWS_STATUS } from '../../lib/constants';
import {
  HomeIcon,
  UsersIcon,
  NewspaperIcon,
  ClipboardDocumentCheckIcon,
  BellAlertIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Fetch pending news count for badge
  const { data: pendingNews = [] } = useQuery({
    queryKey: ['news', 'pending', 'count'],
    queryFn: () => getAllNews({ status: NEWS_STATUS.PENDING }),
    enabled: user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN'
  });

  // Role-based navigation
  const getNavigation = () => {
    const baseNav = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['SUPER_ADMIN', 'ADMIN', 'MEDIA_ADMIN', 'AUDIT'] }
    ];

    const roleSpecificNav = {
      SUPER_ADMIN: [
        { name: 'Users', href: '/dashboard/admin/users', icon: UsersIcon },
        { name: 'Employees', href: '/dashboard/employees', icon: IdentificationIcon },
        { name: 'News Moderation', href: '/dashboard/news', icon: NewspaperIcon },
        { name: 'Audit Queue', href: '/dashboard/audit-queue', icon: ClipboardDocumentCheckIcon },
        { name: 'Complaints', href: '/dashboard/complaints', icon: ChatBubbleLeftRightIcon },
        { name: 'Activity Log', href: '/dashboard/activity-log', icon: DocumentTextIcon },
        { name: 'Onboarding Audit Trail', href: '/dashboard/audit-trail', icon: DocumentTextIcon },
        { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
        { name: 'Invite User', href: '/dashboard/admin/invite', icon: UsersIcon }
      ],
      ADMIN: [
        { name: 'Employees', href: '/dashboard/employees', icon: IdentificationIcon },
        { name: 'News Moderation', href: '/dashboard/news', icon: NewspaperIcon },
        { name: 'Audit Queue', href: '/dashboard/audit-queue', icon: ClipboardDocumentCheckIcon },
        { name: 'Complaints', href: '/dashboard/complaints', icon: ChatBubbleLeftRightIcon },
        { name: 'Activity Log', href: '/dashboard/activity-log', icon: DocumentTextIcon },
        { name: 'Onboarding Audit Trail', href: '/dashboard/audit-trail', icon: DocumentTextIcon }
      ],
      MEDIA_ADMIN: [
        { name: 'News Editor', href: '/dashboard/news-editor', icon: NewspaperIcon },
        { name: 'My Drafts', href: '/dashboard/drafts', icon: DocumentTextIcon }
      ],
      AUDIT: [
        { name: 'Audit Queue', href: '/dashboard/audit-queue', icon: ClipboardDocumentCheckIcon },
        { name: 'Complaints', href: '/dashboard/complaints', icon: ChatBubbleLeftRightIcon },
        { name: 'Activity Log', href: '/dashboard/activity-log', icon: DocumentTextIcon },
        { name: 'Onboarding Audit Trail', href: '/dashboard/audit-trail', icon: DocumentTextIcon }
      ],
      LGA: [
        { name: 'Employees', href: '/dashboard/employees', icon: IdentificationIcon }
      ]
    };

    const userNav = roleSpecificNav[user?.role] || [];
    return [...baseNav, ...userNav];
  };

  const navigation = getNavigation();

  const isActive = (href) => location.pathname === href;

  const getBadgeCount = (href) => {
    if (href === '/dashboard/news' && pendingNews.length > 0) {
      return pendingNews.length;
    }
    return null;
  };

  return (
    <>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="main-sidebar"
        role="complementary"
        aria-label="Main sidebar"
        className={clsx(
          'fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-gov-gray-200 transform transition-transform duration-300 lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-gov-gray-200">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img 
              src="/images/logo/logo.png" 
              alt="ESLGSC" 
              className="h-8 w-8"
            />
            <div>
              <div className="font-bold text-gov-blue-800">ESLGSC</div>
              <div className="text-xs text-gov-gray-600">Dashboard</div>
            </div>
          </Link>
          
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close sidebar"
            className="lg:hidden text-gov-gray-500 hover:text-gov-gray-700"
          >
            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const badgeCount = getBadgeCount(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  'flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-gov-blue-50 text-gov-blue-700'
                    : 'text-gov-gray-700 hover:bg-gov-gray-50 hover:text-gov-blue-700'
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                {badgeCount && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open sidebar menu"
        aria-controls="main-sidebar"
        aria-expanded={mobileMenuOpen}
        className={clsx(
          'fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-md text-gov-gray-700 hover:text-gov-blue-700',
          mobileMenuOpen && 'hidden'
        )}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
};

export default Sidebar;
