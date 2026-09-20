import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import Loader from '../components/ui/Loader';

// Public Pages (lazy loaded)
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/about/About'));
const Services = lazy(() => import('../pages/Services'));
const Contact = lazy(() => import('../pages/Contact'));
const Complaint = lazy(() => import('../pages/complaints/Complaint'));
const GalleryPage = lazy(() => import('../pages/gallery/GalleryPage'));
const NewsPage = lazy(() => import('../pages/NewsPage/NewsPage'));
const NewsDetailPage = lazy(() => import('../pages/NewsPage/NewsDetailPage'));
const LocalGovernmentPage = lazy(() => import('../pages/LocalGovernmentPage/LocalGovernmentPage'));
const DcPage = lazy(() => import('../pages/DevelopmentCenterPage/DcPage'));
const Faq = lazy(() => import('../pages/faq/Faq'));

// Auth & error screens (lazy loaded)
const Login = lazy(() => import('../pages/auth/Login'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const SetPassword = lazy(() => import('../pages/auth/SetPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const Unauthorized = lazy(() => import('../pages/errors/Unauthorized'));
const NotFound = lazy(() => import('../pages/errors/NotFound'));

// Dashboard Pages (lazy loaded)
const Dashboard = lazy(() => import('../pages/Dashboard'));
const AuditQueue = lazy(() => import('../pages/Dashboard/Super/AuditQueue'));
const NewsModeration = lazy(() => import('../pages/Dashboard/Super/NewsModeration'));
const Complaints = lazy(() => import('../pages/Dashboard/Super/Complaints'));
const ActivityLog = lazy(() => import('../pages/Dashboard/Super/ActivityLog'));
const Employees = lazy(() => import('../pages/Dashboard/Super/Employees'));
const EmployeeDetail = lazy(() => import('../pages/Dashboard/Super/EmployeeDetail'));
const AuditTrail = lazy(() => import('../pages/Dashboard/Audit/AuditTrail'));
const NewsEditor = lazy(() => import('../pages/Dashboard/Media/NewsEditor'));
const Drafts = lazy(() => import('../pages/Dashboard/Media/Drafts'));
const Announcements = lazy(() => import('../pages/Dashboard/Media/Announcements'));
const Profile = lazy(() => import('../pages/Dashboard/Account/Profile'));
const Help = lazy(() => import('../pages/Dashboard/Account/Help'));
const InviteUser = lazy(() => import('../pages/admin/InviteUser'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));

const FullPageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <Loader size="lg" />
  </div>
);

const screen = (element) => <Suspense fallback={<FullPageLoader />}>{element}</Suspense>;

const EDITORS = ['SUPER_ADMIN', 'ADMIN', 'MEDIA_ADMIN'];
const REVIEWERS = ['SUPER_ADMIN', 'ADMIN', 'AUDIT'];
const ADMINS = ['SUPER_ADMIN', 'ADMIN'];

// Page-level role guard. The layout supplies the Suspense boundary for these.
const guard = (roles, element) => <ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>;

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes with Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/development-centers" element={<DcPage />} />
        <Route path="/local-governments" element={<LocalGovernmentPage />} />
        <Route path="/news-and-updates" element={<NewsPage />} />
        <Route path="/news-and-updates/:slug" element={<NewsDetailPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/complaints" element={<Complaint />} />
        <Route path="/faq" element={<Faq />} />
      </Route>

      {/* Sign-in and account screens (full page, no website header/footer) */}
      <Route path="/login" element={screen(<Login />)} />
      <Route path="/forgot-password" element={screen(<ForgotPassword />)} />
      <Route path="/set-password" element={screen(<SetPassword />)} />
      <Route path="/reset-password" element={screen(<ResetPassword />)} />
      <Route path="/unauthorized" element={screen(<Unauthorized />)} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MEDIA_ADMIN', 'AUDIT', 'LGA']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        {/* Content */}
        <Route path="news-editor/:newsId?" element={guard(EDITORS, <NewsEditor />)} />
        <Route path="drafts" element={guard(EDITORS, <Drafts />)} />
        <Route path="news" element={guard(ADMINS, <NewsModeration />)} />
        <Route path="announcements" element={guard(EDITORS, <Announcements />)} />

        {/* People */}
        <Route path="employees" element={guard(['SUPER_ADMIN', 'ADMIN', 'LGA'], <Employees />)} />
        <Route path="employees/:employeeId" element={guard(['SUPER_ADMIN', 'ADMIN', 'LGA'], <EmployeeDetail />)} />
        <Route path="admin/users" element={guard(['SUPER_ADMIN'], <UserManagement />)} />
        <Route path="admin/invite" element={guard(['SUPER_ADMIN'], <InviteUser />)} />

        {/* Oversight */}
        <Route path="audit-queue" element={guard(REVIEWERS, <AuditQueue />)} />
        <Route path="complaints" element={guard(REVIEWERS, <Complaints />)} />
        <Route path="activity-log" element={guard(REVIEWERS, <ActivityLog />)} />
        <Route path="audit-trail" element={guard(REVIEWERS, <AuditTrail />)} />

        {/* Account */}
        <Route path="profile" element={<Profile />} />
        <Route path="help" element={<Help />} />
        <Route path="settings" element={<Navigate to="/dashboard/profile" replace />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={screen(<NotFound />)} />
    </Routes>
  );
};

export default AppRouter;
