import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'News & Media',
      links: [
        { name: 'Latest News', href: '/news-and-updates' },
        { name: 'Press Releases', href: '/news-and-updates?category=press-releases' },
        { name: 'Photo Gallery', href: '/gallery' },
        { name: 'Announcements', href: '/news-and-updates?category=announcements' }
      ]
    },
    {
      title: 'The Commission',
      links: [
        { name: 'About ESLGSC', href: '/about' },
        { name: 'Leadership', href: '/about#leadership' },
        { name: 'Departments', href: '/about#departments' }
      ]
    },
    {
      title: 'LGAs & Public Service',
      links: [
        { name: 'Local Governments', href: '/local-governments' },
        { name: 'Development Centers', href: '/development-centers' },
        { name: 'Complaints Desk', href: '/complaints' },
        { name: 'Frequently Asked Questions', href: '/faq' }
      ]
    }
  ];

  return (
    <footer className="bg-gov-navy-900 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/logo/logo.png" 
                alt="ESLGSC Logo" 
                className="h-12 w-12"
              />
              <div className="font-bold text-xl tracking-tight leading-tight">
                ESLGSC <span className="block text-xs font-normal text-gov-gray-400">Ebonyi State</span>
              </div>
            </div>
            <p className="text-sm text-gov-gray-300 leading-relaxed">
              Ebonyi State Local Government Service Commission is committed to fostering transparency, 
              excellence, and grassroots development across all 13 Local Government Areas.
            </p>
          </div>

          {/* Dynamic Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white mb-6 uppercase tracking-wider text-xs">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-sm text-gov-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info Row */}
        <div className="border-t border-gov-navy-800 mt-16 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-3 text-sm text-gov-gray-300">
              <MapPinIcon className="w-5 h-5 flex-shrink-0 text-gov-cyan-500" />
              <span>
                Local Government Service Commission Complex, Abakaliki, Ebonyi State
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gov-gray-300">
              <PhoneIcon className="w-5 h-5 flex-shrink-0 text-gov-cyan-500" />
              <span>+234 (0) 803 555 0101</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gov-gray-300">
              <EnvelopeIcon className="w-5 h-5 flex-shrink-0 text-gov-cyan-500" />
              <span>ebonyistatelgsc@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gov-navy-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gov-gray-400">
          <p>
            &copy; {currentYear} Ebonyi State Local Government Service Commission. 
          </p>
          <div className="flex items-center space-x-6">
            <Link to="/login" className="text-gov-cyan-500 font-semibold hover:text-gov-cyan-400">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
