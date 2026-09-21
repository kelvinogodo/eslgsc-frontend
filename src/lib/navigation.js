import {
  HomeIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  NewspaperIcon,
  MegaphoneIcon,
  IdentificationIcon,
  UsersIcon,
  UserPlusIcon,
  ArchiveBoxIcon,
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
 * Single source of truth for the sidebar, breadcrumbs and page titles.
 * Labels are deliberately plain language ("Approvals", not "Audit Queue").
 * `badge` names a counter supplied by the layout (see Sidebar).
 */
export const NAV_GROUPS = [
  {
    label: null,
    items: [
      { name: 'Home', href: '/dashboard', icon: HomeIcon, roles: ALL, end: true, description: 'Your overview' }
    ]
  },
  {
    label: 'Content',
    items: [
      { name: 'Write an Article', href: '/dashboard/news-editor', icon: PencilSquareIcon, roles: EDITORS, description: 'Create a news story' },
      { name: 'My Articles', href: '/dashboard/drafts', icon: DocumentTextIcon, roles: EDITORS, description: 'Drafts and submissions' },
      { name: 'News Desk', href: '/dashboard/news', icon: NewspaperIcon, roles: ['SUPER_ADMIN', 'ADMIN'], description: 'Review and manage published news' },
      { name: 'Announcements', href: '/dashboard/announcements', icon: MegaphoneIcon, roles: EDITORS, description: 'Short public notices' }
    ]
  },
  {
    label: 'People',
    items: [
      { name: 'Staff Records', href: '/dashboard/employees', icon: IdentificationIcon, roles: ['SUPER_ADMIN', 'ADMIN', 'LGA'], description: 'Browse enrolled staff' },
      { name: 'Upcoming Retirements', href: '/dashboard/retirements', icon: ClockIcon, roles: ['SUPER_ADMIN', 'ADMIN'], badge: 'retiring', description: 'Staff retiring in the next 4 months' },
      { name: 'Retired Staff', href: '/dashboard/retired', icon: ArchiveBoxIcon, roles: ['SUPER_ADMIN', 'ADMIN'], description: 'Staff who have already retired' },
      { name: 'Portal Users', href: '/dashboard/admin/users', icon: UsersIcon, roles: ['SUPER_ADMIN'], description: 'Manage who can sign in' },
      { name: 'Invite Someone', href: '/dashboard/admin/invite', icon: UserPlusIcon, roles: ['SUPER_ADMIN'], description: 'Send a sign-up invitation' }
    ]
  },
  {
    label: 'Oversight',
    items: [
      { name: 'Approvals', href: '/dashboard/audit-queue', icon: ClipboardDocumentCheckIcon, roles: REVIEWERS, badge: 'pendingAudits', description: 'Items waiting for review' },
      { name: 'Complaints', href: '/dashboard/complaints', icon: ChatBubbleLeftRightIcon, roles: REVIEWERS, description: 'Messages from the public' },
      { name: 'Activity History', href: '/dashboard/activity-log', icon: ClockIcon, roles: REVIEWERS, description: 'Who did what, and when' },
      { name: 'Enrollment Records Log', href: '/dashboard/audit-trail', icon: FingerPrintIcon, roles: REVIEWERS, description: 'Staff enrollment system history' }
    ]
  },
  {
    label: 'Account',
    items: [
      { name: 'My Profile', href: '/dashboard/profile', icon: UserCircleIcon, roles: ALL, description: 'Your details and password' },
      { name: 'Help & Guides', href: '/dashboard/help', icon: QuestionMarkCircleIcon, roles: ALL, description: 'Step-by-step help' }
    ]
  }
];

export const navForRole = (role) =>
  NAV_GROUPS
    .map((g) => ({ ...g, items: g.items.filter((i) => i.roles.includes(role)) }))
    .filter((g) => g.items.length > 0);

const FLAT = NAV_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label })));

/** Extra pages that are not in the sidebar but still deserve a proper title. */
const EXTRA_TITLES = [
  { match: /^\/dashboard\/employees\/.+/, title: 'Staff Record', parent: '/dashboard/employees' },
  { match: /^\/dashboard\/news-editor\/.+/, title: 'Edit Article', parent: '/dashboard/drafts' }
];

/** Title + parent trail for a pathname, used by the topbar breadcrumb and <title>. */
export const getPageMeta = (pathname) => {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const extra = EXTRA_TITLES.find((e) => e.match.test(clean));
  if (extra) {
    const parent = FLAT.find((i) => i.href === extra.parent);
    return { title: extra.title, trail: parent ? [{ name: parent.name, href: parent.href }] : [] };
  }
  const item = FLAT.find((i) => i.href === clean);
  if (!item) return { title: 'Portal', trail: [] };
  return { title: item.name, trail: item.href === '/dashboard' ? [] : [] };
};

/** Where each role lands right after signing in. */
export const HOME_FOR_ROLE = {
  SUPER_ADMIN: '/dashboard',
  ADMIN: '/dashboard',
  MEDIA_ADMIN: '/dashboard',
  AUDIT: '/dashboard',
  LGA: '/dashboard'
};
