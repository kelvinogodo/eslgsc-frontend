import {
  HomeIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  NewspaperIcon,
  MegaphoneIcon,
  IdentificationIcon,
  UsersIcon,
  ArchiveBoxIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  FingerPrintIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

export const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Administrator',
  ADMIN: 'Administrator',
  MEDIA_ADMIN: 'Media Officer',
  AUDIT: 'Auditor',
  LGA: 'LGA Official'
};

const ALL = ['SUPER_ADMIN', 'ADMIN', 'MEDIA_ADMIN', 'AUDIT', 'LGA'];
const EDITORS = ['SUPER_ADMIN', 'ADMIN', 'MEDIA_ADMIN'];
const REVIEWERS = ['SUPER_ADMIN', 'ADMIN', 'AUDIT'];

/**
 * Sidebar entries, also used for page titles.
 * `badge` names a counter supplied by the Sidebar.
 */
export const NAV_GROUPS = [
  {
    label: null,
    items: [
      { name: 'Home', href: '/dashboard', icon: HomeIcon, roles: ALL, end: true }
    ]
  },
  {
    label: 'Content',
    items: [
      { name: 'Write an Article', href: '/dashboard/news-editor', icon: PencilSquareIcon, roles: EDITORS },
      { name: 'My Articles', href: '/dashboard/drafts', icon: DocumentTextIcon, roles: EDITORS },
      { name: 'News Desk', href: '/dashboard/news', icon: NewspaperIcon, roles: ['SUPER_ADMIN', 'ADMIN'] },
      { name: 'Announcements', href: '/dashboard/announcements', icon: MegaphoneIcon, roles: EDITORS }
    ]
  },
  {
    label: 'People',
    items: [
      { name: 'Staff Records', href: '/dashboard/employees', icon: IdentificationIcon, roles: ['SUPER_ADMIN', 'ADMIN', 'LGA'] },
      { name: 'Upcoming Retirements', href: '/dashboard/retirements', icon: CalendarDaysIcon, roles: ['SUPER_ADMIN', 'ADMIN'], badge: 'retiring' },
      { name: 'Retired Staff', href: '/dashboard/retired', icon: ArchiveBoxIcon, roles: ['SUPER_ADMIN', 'ADMIN'] },
      { name: 'Portal Users', href: '/dashboard/admin/users', icon: UsersIcon, roles: ['SUPER_ADMIN'] }
    ]
  },
  {
    label: 'Oversight',
    items: [
      { name: 'Approvals', href: '/dashboard/audit-queue', icon: ClipboardDocumentCheckIcon, roles: REVIEWERS, badge: 'pendingAudits' },
      { name: 'Complaints', href: '/dashboard/complaints', icon: ChatBubbleLeftRightIcon, roles: REVIEWERS },
      { name: 'Activity History', href: '/dashboard/activity-log', icon: ClockIcon, roles: REVIEWERS },
      { name: 'Enrollment Records Log', href: '/dashboard/audit-trail', icon: FingerPrintIcon, roles: REVIEWERS }
    ]
  },
  {
    label: 'Account',
    items: [
      { name: 'My Profile', href: '/dashboard/profile', icon: UserCircleIcon, roles: ALL },
      { name: 'Help', href: '/dashboard/help', icon: QuestionMarkCircleIcon, roles: ALL }
    ]
  }
];

export const navForRole = (role) =>
  NAV_GROUPS
    .map((g) => ({ ...g, items: g.items.filter((i) => i.roles.includes(role)) }))
    .filter((g) => g.items.length > 0);

const FLAT = NAV_GROUPS.flatMap((g) => g.items);

/** Pages that are not in the sidebar but still need a <title>. */
const EXTRA_TITLES = [
  { match: /^\/dashboard\/employees\/.+/, title: 'Staff Record' },
  { match: /^\/dashboard\/news-editor\/.+/, title: 'Edit Article' },
  { match: /^\/dashboard\/admin\/invite$/, title: 'Invite Someone' }
];

/** Page title for a pathname, used for <title>. */
export const getPageTitle = (pathname) => {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const extra = EXTRA_TITLES.find((e) => e.match.test(clean));
  if (extra) return extra.title;
  return FLAT.find((i) => i.href === clean)?.name || 'Portal';
};
