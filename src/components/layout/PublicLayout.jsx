import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';
import Loader from '../ui/Loader';

const PublicLayout = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[999] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:rounded-md focus:bg-gov-blue-700 focus:text-white"
      >
        Skip to main content
      </a>
      <Header />
      <main
        id="main-content"
        role="main"
        tabIndex={-1}
        className={clsx(
          "flex-1",
          location.pathname === '/' ? "pt-[72px] md:pt-[104px]" : "pt-24 sm:pt-28"
        )}
      >
        {location.pathname !== '/' && (
          <div className="px-6 pt-6">
            <Breadcrumbs />
          </div>
        )}
        <Suspense
          fallback={(
            <div className="flex items-center justify-center py-20">
              <Loader size="lg" />
            </div>
          )}
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
