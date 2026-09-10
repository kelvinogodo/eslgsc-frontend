import { useState, useEffect, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Button from '../ui/Button';

const navigation = [
  { name: 'Home', href: '/' },
  { 
    name: 'Newsroom', 
    href: '/news-and-updates',
    children: [
      { name: 'Latest News', href: '/news-and-updates' },
      { name: 'Press Releases', href: '/news-and-updates?category=press-releases' },
      { name: 'Announcements', href: '/news-and-updates?category=announcements' },
      { name: 'Gallery', href: '/gallery' }
    ]
  },
  { 
    name: 'The Commission', 
    href: '/about',
    children: [
      { name: 'About ESLGSC', href: '/about' },
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
          ? 'bg-white shadow-lg' 
          : 'bg-white'
      )}
    >
      {/* Top Utility Bar */}
      <div className="bg-gov-navy-700 text-white py-2 hidden md:block">
        <div className="container-custom flex justify-between items-center text-xs font-medium">
          <div className="flex items-center space-x-6">
            <a href="mailto:ebonyistatelgsc@gmail.com" className="flex items-center hover:text-gov-cyan-300 transition-colors">
              <EnvelopeIcon className="w-4 h-4 mr-2" />
              ebonyistatelgsc@gmail.com
            </a>
            <span className="flex items-center">
              <PhoneIcon className="w-4 h-4 mr-2" />
              +234 (0) 803 555 0101
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="hover:text-gov-cyan-300 transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
  <nav role="navigation" aria-label="Primary navigation" className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/images/logo/logo.png" 
              alt="ESLGSC Logo" 
              className="h-10 w-10 object-contain"
            />
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-gov-navy-900 leading-tight">
                ESLGSC
              </div>
              <div className="text-xs text-gov-gray-600">
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
                          ? 'text-white bg-gov-navy-900 shadow-sm'
                          : 'text-gov-gray-700 hover:text-gov-navy-700 hover:bg-gov-gray-50'
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
                                      ? 'bg-gov-navy-900 text-white shadow-sm'
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
                      ? 'text-white bg-gov-navy-900 shadow-sm'
                      : 'text-gov-gray-700 hover:text-gov-navy-700 hover:bg-gov-gray-50'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
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
                                    ? 'bg-gov-navy-900 text-white'
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
                        ? 'bg-gov-navy-900 text-white shadow-sm'
                        : 'text-gov-gray-700 hover:bg-gov-gray-50'
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 mt-4 border-t border-gov-gray-100 md:hidden">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-center text-sm font-semibold text-white bg-gov-navy-600 rounded-md hover:bg-gov-navy-700 transition-colors"
              >
                Staff Portal
              </Link>
            </div>
          </div>
        </div>
      </Transition>
    </header>
  );
};

export default Header;
