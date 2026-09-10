import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Breadcrumbs from './Breadcrumbs';
import Loader from '../ui/Loader';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gov-gray-50">
      <Sidebar />
      
      <div className="lg:pl-64">
        <Topbar />
        
  <main id="main" className="p-6 pt-20">
          <Breadcrumbs />
          
          <Suspense fallback={<Loader size="lg" className="py-12" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
