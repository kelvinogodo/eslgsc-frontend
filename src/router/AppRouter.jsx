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
const Unauthorized = lazy(() => import('../pages/errors/Unauthorized'));
const SetPassword = lazy(() => import('../pages/auth/SetPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

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
const InviteUser = lazy(() => import('../pages/admin/InviteUser'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader size="lg" />
  </div>
);

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
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Auth Routes (no layout) */}
      <Route
        path="/login"
        element={(
          <Suspense fallback={<LoadingFallback />}>
            <Login />
          </Suspense>
        )}
      />
      <Route
        path="/unauthorized"
        element={(
          <Suspense fallback={<LoadingFallback />}>
            <Unauthorized />
          </Suspense>
        )}
      />

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MEDIA_ADMIN', 'AUDIT', 'LGA']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route 
          index 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
          } 
        />
        <Route 
          path="news" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <NewsModeration />
            </Suspense>
          } 
        />
        <Route 
          path="audit-queue" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AuditQueue />
            </Suspense>
          } 
        />
        <Route 
          path="complaints" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Complaints />
            </Suspense>
          } 
        />
        <Route 
          path="activity-log" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ActivityLog />
            </Suspense>
          } 
        />
        <Route path="settings" element={<div className="p-6">Settings (Coming Soon)</div>} />
        <Route
          path="employees"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'LGA']}>
              <Suspense fallback={<LoadingFallback />}>
                <Employees />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="employees/:employeeId"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'LGA']}>
              <Suspense fallback={<LoadingFallback />}>
                <EmployeeDetail />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="audit-trail"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'AUDIT']}>
              <Suspense fallback={<LoadingFallback />}>
                <AuditTrail />
              </Suspense>
            </ProtectedRoute>
          }
        />
          <Route
            path="admin/invite"
            element={
              <ProtectedRoute allowedRoles={[ 'SUPER_ADMIN' ]}>
                <Suspense fallback={<LoadingFallback />}>
                  <InviteUser />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <ProtectedRoute allowedRoles={[ 'SUPER_ADMIN' ]}>
                <Suspense fallback={<LoadingFallback />}>
                  <UserManagement />
                </Suspense>
              </ProtectedRoute>
            }
          />
        <Route 
          path="news-editor/:newsId?" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <NewsEditor />
            </Suspense>
          } 
        />
        <Route 
          path="drafts" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Drafts />
            </Suspense>
          } 
        />
</Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
