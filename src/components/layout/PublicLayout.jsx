import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';
import Loader from '../ui/Loader';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { EASE } from '../portal/motionVariants';

const PublicLayout = () => {
  const location = useLocation();
  const reduce = useReducedMotion();
  useScrollReveal(location.pathname);

  // New page: start at the top, or jump to the #section when the link has one.
  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const t = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 350);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    return undefined;
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[999] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:rounded-md focus:bg-brand-700 focus:text-white"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" role="main" tabIndex={-1} className="flex-1 pt-[72px]">
        <motion.div
          key={location.pathname}
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
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
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
