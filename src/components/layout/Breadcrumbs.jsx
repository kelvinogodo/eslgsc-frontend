import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

const breadcrumbNames = {
  '/dashboard': 'Dashboard',
  '/dashboard/news': 'News Management',
  '/dashboard/news-editor': 'News Editor',
  '/dashboard/drafts': 'My Drafts',
  '/dashboard/audit-queue': 'Audit Queue',
  '/dashboard/activity-log': 'Activity Log',
  '/dashboard/settings': 'Settings'
};
// Add common public and admin routes so breadcrumbs render friendly labels
Object.assign(breadcrumbNames, {
  '/news-and-updates': 'News & Updates',
  '/news-and-updates/:slug': 'News',
  '/gallery': 'Gallery',
  '/services': 'Services',
  '/development-centers': 'Development Centers',
  '/local-governments': 'Local Governments',
  '/contact': 'Contact',
  '/about': 'About'
});

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" role="navigation" className="flex items-center space-x-2 text-sm text-gov-gray-600 mb-6">
      <Link 
        to="/dashboard" 
        className="flex items-center hover:text-gov-blue-700 transition-colors"
        aria-label="Go to dashboard home"
      >
        <span className="sr-only">Home</span>
        <HomeIcon className="w-4 h-4" aria-hidden="true" />
      </Link>
      
      {pathnames.map((_, index) => {
        const path = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const name = breadcrumbNames[path] || pathnames[index];

        return (
          <div key={path} className="flex items-center space-x-2" aria-current={isLast ? 'page' : undefined}>
            <ChevronRightIcon className="w-4 h-4 text-gov-gray-400" aria-hidden="true" />
            {isLast ? (
              <span className="font-medium text-gov-gray-900">{name}</span>
            ) : (
              <Link 
                to={path}
                className="hover:text-gov-blue-700 transition-colors"
              >
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
