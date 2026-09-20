import { Suspense, useEffect, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PageSkeleton from '../portal/PageSkeleton';
import ErrorBoundary from '../portal/ErrorBoundary';
import { EASE } from '../portal/motionVariants';
import usePortalTheme from '../../hooks/usePortalTheme';
import usePageTitle from '../../hooks/usePageTitle';
import { getPageMeta } from '../../lib/navigation';

// The article editor updates its own URL after the first autosave
// (/news-editor -> /news-editor/:id); that must not replay the page transition.
const transitionKey = (pathname) => pathname.replace(/^(\/dashboard\/news-editor)\/.*$/, '$1');

const DashboardLayout = () => {
  usePortalTheme();
  const location = useLocation();
  const outlet = useOutlet();
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const key = transitionKey(location.pathname);

  usePageTitle(getPageMeta(location.pathname).title);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [key]);

  return (
    <div className="min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="lg:pl-72">
        <Topbar onMenu={() => setMenuOpen(true)} />

        <main id="main" tabIndex={-1} className="mx-auto max-w-[1400px] px-4 pb-20 pt-24 outline-none sm:px-6 lg:px-10">
          <ErrorBoundary resetKey={key}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={key}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: EASE }}
              >
                <Suspense fallback={<PageSkeleton />}>{outlet}</Suspense>
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
