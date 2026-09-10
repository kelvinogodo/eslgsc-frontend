import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { EXECUTIVES, DEPARTMENTS } from '../../lib/constants';
import {
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';

const About = () => {
  // Separate Chairman and Commissioners from other executives
  const chairman = EXECUTIVES.find(e => e.role.includes('Chairman'));
  const commissioner1 = EXECUTIVES.find(e => e.role.includes('Commissioner 1'));
  const otherStaff = EXECUTIVES.filter(e => e !== chairman && e !== commissioner1);

  return (
    <div className="bg-gov-gray-50/30 min-h-screen pb-20">
      {/* Institutional Masthead */}
      <header className="bg-gov-navy-900 text-white pt-16 pb-12 border-b-4 border-gov-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/logo/logo.png')] bg-no-repeat bg-right-top opacity-5 grayscale pointer-events-none translate-x-1/4 -translate-y-1/4 scale-150" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 bg-gov-green-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
              Official Profile
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">About the Commission</h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
              The Ebonyi State Local Government Service Commission (ESLGSC) is the statutory body responsible for the oversight, regulation, and administrative coordination of the Local Government Service across the state.
            </p>
          </div>
        </div>
      </header>

      <div className="container-custom py-12 lg:py-16">
        <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-start">
          {/* Main Content */}
          <div className="space-y-16">
            
            {/* Statutory Mandate */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gov-navy-900 uppercase tracking-tight">Statutory Mandate</h2>
                <div className="h-px flex-1 bg-gov-gray-200" />
              </div>
              <div className="prose prose-gov max-w-none">
                <p className="text-lg text-gov-gray-700 leading-relaxed">
                  Established under the Ebonyi State Local Government Law, the Commission functions as a centralized regulatory authority. Our mandate is to ensure that local governance is executed with professional integrity, administrative consistency, and strict adherence to public service standards.
                </p>
                <div className="grid md:grid-cols-2 gap-8 mt-10">
                  <div className="space-y-3 p-6 bg-white border border-gov-gray-100">
                    <h3 className="text-sm font-bold text-gov-navy-900 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheckIcon className="w-5 h-5 text-gov-green-600" />
                      Administrative Oversight
                    </h3>
                    <p className="text-sm text-gov-gray-600 leading-relaxed">
                      Monitoring and regulating service standards across all 13 Local Government Areas to maintain uniformity in grassroots administration.
                    </p>
                  </div>
                  <div className="space-y-3 p-6 bg-white border border-gov-gray-100">
                    <h3 className="text-sm font-bold text-gov-navy-900 uppercase tracking-widest flex items-center gap-2">
                      <DocumentTextIcon className="w-5 h-5 text-gov-green-600" />
                      Policy Coordination
                    </h3>
                    <p className="text-sm text-gov-gray-600 leading-relaxed">
                      Inaugurating and disseminating official circulars, administrative directives, and public notices to guide local service delivery.
                    </p>
                  </div>
                  <div className="space-y-3 p-6 bg-white border border-gov-gray-100">
                    <h3 className="text-sm font-bold text-gov-navy-900 uppercase tracking-widest flex items-center gap-2">
                      <ChatBubbleLeftRightIcon className="w-5 h-5 text-gov-green-600" />
                      Public Communication
                    </h3>
                    <p className="text-sm text-gov-gray-600 leading-relaxed">
                      Facilitating a transparent channel for public enquiries, complaints, and access to official commission newsroom records.
                    </p>
                  </div>
                  <div className="space-y-3 p-6 bg-white border border-gov-gray-100">
                    <h3 className="text-sm font-bold text-gov-navy-900 uppercase tracking-widest flex items-center gap-2">
                      <IdentificationIcon className="w-5 h-5 text-gov-green-600" />
                      Service Verification
                    </h3>
                    <p className="text-sm text-gov-gray-600 leading-relaxed">
                      Maintaining the integrity of the Local Government Service through continuous audits, identity verification, and professional record-keeping.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Leadership Section */}
            <section id="leadership" className="space-y-10">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gov-navy-900 uppercase tracking-tight">Commission Leadership</h2>
                <div className="h-px flex-1 bg-gov-gray-200" />
              </div>

              {/* Chairman Highlight */}
              {chairman && (
                <div className="bg-white border border-gov-gray-200 overflow-hidden flex flex-col md:row items-center md:flex-row shadow-sm">
                  <div className="md:w-72 aspect-[4/5] bg-gov-gray-100 shrink-0">
                    <img
                      src={chairman.image}
                      alt={chairman.name}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div className="p-8 md:p-12 space-y-6">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-gov-green-600 uppercase tracking-[0.2em]">Executive Chairman</span>
                      <h3 className="text-3xl font-bold text-gov-navy-900">{chairman.name}</h3>
                    </div>
                    <p className="text-gov-gray-600 leading-relaxed italic">
                      "Our focus remains on building a transparent and accountable local government service that truly serves the grassroots communities of Ebonyi State."
                    </p>
                  </div>
                </div>
              )}

              {/* Commissioner Highlight */}
              {commissioner1 && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white border border-gov-gray-200 p-6 flex gap-6 items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gov-gray-100 shrink-0 border-2 border-gov-gray-100">
                      <img src={commissioner1.image} alt={commissioner1.name} className="w-full h-full object-cover grayscale" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gov-blue-600 uppercase tracking-widest">Commissioner 1</span>
                      <h4 className="text-lg font-bold text-gov-navy-900">{commissioner1.name}</h4>
                    </div>
                  </div>
                  <div className="bg-white border border-gov-gray-200 p-6 flex items-center justify-center text-center">
                    <p className="text-sm text-gov-gray-400 italic">Additional Commissioner information will be updated following official gazette notifications.</p>
                  </div>
                </div>
              )}

              {/* Administrative Leads */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gov-navy-900 uppercase tracking-widest border-b border-gov-gray-100 pb-2">Administrative & Directorate Leads</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otherStaff.map(staff => (
                    <div key={staff.name} className="bg-white border border-gov-gray-100 p-4 hover:border-gov-blue-300 transition-colors">
                      <h4 className="text-sm font-bold text-gov-navy-900 leading-tight">{staff.name}</h4>
                      <p className="text-[11px] text-gov-gray-500 mt-1 uppercase tracking-tighter">{staff.role || 'Administrative Lead'}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gov-gray-400 italic">The full directory of administrative leads and directorate heads is maintained within the Commission's internal registry.</p>
              </div>
            </section>

            {/* Departments Section */}
            <section id="departments" className="bg-white border border-gov-gray-200 p-8 lg:p-12 space-y-10">
              <div className="max-w-2xl space-y-4">
                <h2 className="text-2xl font-bold text-gov-navy-900 uppercase tracking-tight">Directorates & Departments</h2>
                <p className="text-gov-gray-600 leading-relaxed">
                  The Commission is organized into specialized directorates and departments, each managing a critical pillar of the local government service.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                {DEPARTMENTS.map(dept => (
                  <div key={dept} className="flex items-center gap-3 py-3 border-b border-gov-gray-50">
                    <div className="w-1.5 h-1.5 rounded-full bg-gov-green-600" />
                    <span className="text-sm font-medium text-gov-gray-700">{dept}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Public Accountability */}
            <section className="bg-gov-navy-900 text-white p-8 lg:p-16 relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('/images/hero/hero1.jpg')] bg-cover bg-center opacity-10 grayscale mix-blend-overlay" />
               <div className="relative z-10 space-y-6">
                <h2 className="text-3xl font-bold">Public Accountability & Access</h2>
                <p className="text-white/80 max-w-2xl leading-relaxed">
                  This portal serves as a digital extension of the Commission's commitment to transparency. By providing centralized access to LGA directories, Development Center locations, and official newsroom updates, we ensure that public information remains accessible to every citizen of Ebonyi State.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/news-and-updates" className="text-sm font-bold text-gov-green-400 hover:text-gov-green-300 flex items-center gap-2">
                    Access Newsroom <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                  <Link to="/local-governments" className="text-sm font-bold text-gov-green-400 hover:text-gov-green-300 flex items-center gap-2">
                    LGA Directory <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                </div>
               </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-8 w-full self-start">
            <div className="space-y-10">
            <div className="p-6 bg-white border border-gov-gray-200 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gov-navy-900 border-b border-gov-gray-100 pb-2">
                Public Records
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link to="/news-and-updates" className="group block">
                    <span className="text-[10px] font-bold text-gov-blue-600 uppercase tracking-widest group-hover:underline">Official Newsroom</span>
                    <p className="text-xs text-gov-gray-500 mt-1">Direct access to press releases and circulars.</p>
                  </Link>
                </li>
                <li>
                  <Link to="/complaints" className="group block">
                    <span className="text-[10px] font-bold text-gov-blue-600 uppercase tracking-widest group-hover:underline">Public Petitions</span>
                    <p className="text-xs text-gov-gray-500 mt-1">Submit formal complaints for Commission review.</p>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-gov-navy-900 text-white space-y-4">
              <h4 className="text-[10px] font-bold text-gov-green-500 uppercase tracking-widest">Enquiries</h4>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                For administrative enquiries or verification requests, please contact our central office.
              </p>
              <a href="mailto:ebonyistatelgsc@gmail.com" className="block text-sm font-bold hover:underline underline-offset-4">
                ebonyistatelgsc@gmail.com
              </a>
            </div>

            <div className="p-6 border border-gov-gray-200 bg-white space-y-4">
              <h4 className="text-[10px] font-bold text-gov-navy-900 uppercase tracking-widest">External Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="https://ebonyistate.gov.ng" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-xs font-bold text-gov-gray-500 hover:text-gov-blue-600 uppercase tracking-tighter">
                    State Government Portal
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                  </a>
                </li>
              </ul>
            </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default About;