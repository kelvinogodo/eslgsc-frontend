import { useState, useEffect, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const navigation = [
  { name: 'Home', href: '/' },
  { 
    name: 'Newsroom', 
    href: '/news-and-updates',
    children: [
      { name: 'Latest News', href: '/news-and-updates' },
      { name: 'Announcements', href: '/announcements' },
      { name: 'Photo Gallery', href: '/gallery' }
    ]
  },
  { 
    name: 'The Commission', 
    href: '/about',
    children: [
      { name: 'About EBSLGSC', href: '/about' },
      { name: 'Leadership', href: '/about#leadership' },
      { name: 'Departments', href: '/about#departments' }
    ]
  },
  { 
    name: 'LGAs & Centers', 
    href: '/local-governments',
    children: [
      { name: 'Local Governments', href: '/local-governments' },
      { name: 'Development Centers', href: '/development-centers' }
    ]
  },
  { 
    name: 'Public Service', 
    href: '/complaints',
    children: [
      { name: 'Complaints Desk', href: '/complaints' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Contact Us', href: '/contact' }
    ]
  }
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  // close the mobile menu whenever the page changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      role="banner"
      className={clsx(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-white/90 shadow-lg shadow-gov-navy-900/5 backdrop-blur-md'
          : 'bg-white'
      )}
    >
      <nav role="navigation" aria-label="Primary navigation" className="container-custom py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
                    <Link to="/" className="flex items-center gap-3" aria-label="EBSLGSC home">
            <img
              src="/images/logo/logo.png"
              alt="Ebonyi State seal"
              className="h-14 w-14 shrink-0 object-contain"
            />
            <div>
              <div className="text-xl font-extrabold text-gov-navy-900 leading-tight tracking-tight">
                EBSLGSC
              </div>
              <div className="hidden text-xs text-gov-gray-600 sm:block">
                Ebonyi State LG Service Commission
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const hasChildren = Boolean(item.children);
              const childIsActive = hasChildren && item.children.some((child) => location.pathname.startsWith(child.href));

              if (hasChildren) {
                return (
                  <Menu as="div" key={item.name} className="relative">
            <Menu.Button
              aria-haspopup="true"
              className={clsx(
                        'px-4 py-2 text-sm font-medium rounded-md transition-colors inline-flex items-center space-x-1',
                        childIsActive
                          ? 'text-brand-800 bg-brand-50 ring-1 ring-brand-100'
                          : 'text-gov-gray-700 hover:text-brand-700 hover:bg-brand-50/60'
                      )}
                    >
                      <span>{item.name}</span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                      <div className="py-1">
                        {item.children.map((child) => (
                          <Menu.Item key={child.name}>
                            {({ active }) => {
                              const isCurrent = location.pathname.startsWith(child.href);
                              return (
                                <Link
                                  to={child.href}
                                  aria-current={isCurrent ? 'page' : undefined}
                                  className={clsx(
                                    'block px-4 py-2 text-sm transition-colors',
                                    active || isCurrent
                                      ? 'bg-brand-50 text-brand-800'
                                      : 'text-gov-gray-700'
                                  )}
                                >
                                  {child.name}
                                </Link>
                              );
                            }}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                );
              }

              const isCurrent = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={clsx(
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    isCurrent
                      ? 'text-brand-800 bg-brand-50 ring-1 ring-brand-100'
                      : 'text-gov-gray-700 hover:text-brand-700 hover:bg-brand-50/60'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="btn btn-primary btn-md hidden lg:inline-flex">
              Staff sign in
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden text-gov-gray-700 hover:text-gov-blue-700 transition-colors"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Reading progress */}
      <motion.div aria-hidden="true" style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-gradient-to-r from-brand-600 via-gold-400 to-gold-300" />

      {/* Mobile Menu */}
      <Transition
        show={mobileMenuOpen}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        <div className="lg:hidden border-t border-gov-gray-200 bg-white">
          <div className="container-custom py-4 space-y-2">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <Menu as="div" className="relative">
                    {({ open }) => (
                      <>
                        <Menu.Button aria-haspopup="true" className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gov-gray-700 hover:bg-gov-gray-50 rounded-md transition-colors">
                          <span>{item.name}</span>
                          <ChevronDownIcon 
                            className={clsx('w-4 h-4 transition-transform', open && 'rotate-180')} 
                          />
                        </Menu.Button>
                        <Menu.Items className="mt-1 ml-4 space-y-1">
                          {item.children.map((child) => (
                            <Menu.Item key={child.name}>
                              <Link
                                to={child.href}
                                onClick={() => setMobileMenuOpen(false)}
                                aria-current={location.pathname.startsWith(child.href) ? 'page' : undefined}
                                className={clsx(
                                  'block px-4 py-2 text-sm rounded-md transition-colors',
                                  location.pathname.startsWith(child.href)
                                    ? 'bg-brand-50 text-brand-800'
                                    : 'text-gov-gray-600 hover:text-gov-navy-700 hover:bg-gov-gray-50'
                                )}
                              >
                                {child.name}
                              </Link>
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </>
                    )}
                  </Menu>
                ) : (
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={location.pathname === item.href ? 'page' : undefined}
                    className={clsx(
                      'block px-4 py-2 text-sm font-medium rounded-md transition-colors',
                      location.pathname === item.href
                        ? 'bg-brand-50 text-brand-800'
                        : 'text-gov-gray-700 hover:bg-gov-gray-50'
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 mt-4 border-t border-gov-gray-100">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-center text-sm font-semibold text-white bg-brand-600 rounded-md hover:bg-brand-700 transition-colors"
              >
                Staff sign in
              </Link>
            </div>
          </div>
        </div>
      </Transition>
    </header>
  );
};

export default Header;
