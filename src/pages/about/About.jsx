import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { EXECUTIVES } from '../../lib/constants';
import { SITE } from '../../lib/siteInfo';
import { getDirectory } from '../../services/directoryService';

// Only names, photos and titles of the Commission's leadership are hand-kept (lib/constants.js).
// Departments come from the staff records. No mandate wording, quotes or figures are invented here.
const About = () => {
  const chairman = EXECUTIVES.find((e) => e.role.includes('Chairman'));
  const commissioner1 = EXECUTIVES.find((e) => e.role.includes('Commissioner 1'));
  const otherStaff = EXECUTIVES.filter((e) => e !== chairman && e !== commissioner1);
  const { data } = useQuery({ queryKey: ['public', 'directory'], queryFn: getDirectory, staleTime: 30 * 60 * 1000 });
  const departments = data?.departments ?? [];

  return (
    <div className="bg-gov-gray-50/30 min-h-screen pb-20">
      <header className="page-banner bg-gov-navy-900 text-white pt-10 pb-8 md:pt-12 md:pb-10 border-b-4 border-gov-cyan-500 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 bg-gov-cyan-500 text-gov-navy-900 text-[10px] font-bold uppercase tracking-widest rounded-sm">
              About
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">About the Commission</h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
              The {SITE.name} ({SITE.short}), Abakaliki, Ebonyi State.
            </p>
          </div>
        </div>
      </header>

      <div className="container-custom py-12 lg:py-16">
        <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-start">
          <div className="space-y-14">
            <section id="leadership" className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gov-navy-900 uppercase tracking-tight">Commission Leadership</h2>
                <div className="h-px flex-1 bg-gov-gray-200" />
              </div>

              {chairman && (
                <div className="bg-white border border-gov-gray-200 rounded-2xl overflow-hidden flex flex-col md:flex-row items-center shadow-sm">
                  <div className="md:w-64 aspect-[4/5] bg-gov-gray-100 shrink-0 w-full">
                    <img src={chairman.image} alt={chairman.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-8 md:p-10 space-y-2">
                    <span className="text-xs font-bold text-brand-700 uppercase tracking-[0.2em]">Chairman</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-gov-navy-900">{chairman.name}</h3>
                  </div>
                </div>
              )}

              {commissioner1 && (
                <div className="bg-white border border-gov-gray-200 rounded-2xl p-6 flex gap-6 items-center shadow-sm">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gov-gray-100 shrink-0 border-2 border-gov-gray-100">
                    <img src={commissioner1.image} alt={commissioner1.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-brand-700 uppercase tracking-widest">Commissioner 1</span>
                    <h4 className="text-lg font-bold text-gov-navy-900">{commissioner1.name}</h4>
                  </div>
                </div>
              )}

              {otherStaff.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gov-navy-900 uppercase tracking-widest border-b border-gov-gray-100 pb-2">Directors and officers</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {otherStaff.map((staff) => (
                      <div key={staff.name} className="bg-white border border-gov-gray-100 rounded-xl p-4 transition-colors hover:border-gold-400">
                        <h4 className="text-sm font-bold text-gov-navy-900 leading-tight">{staff.name}</h4>
                        {staff.role && <p className="text-[11px] text-gov-gray-500 mt-1 uppercase tracking-tight">{staff.role}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {departments.length > 0 && (
              <section id="departments" className="bg-white border border-gov-gray-200 rounded-2xl p-8 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gov-navy-900 uppercase tracking-tight">Departments</h2>
                  <p className="text-sm text-gov-gray-600">The departments in the local government service, as recorded in the Commission’s staff records.</p>
                </div>
                <ul className="grid sm:grid-cols-2 gap-x-8">
                  {departments.map((d) => (
                    <li key={d} className="flex items-center gap-3 py-3 border-b border-gov-gray-50">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" />
                      <span className="text-sm font-medium text-gov-gray-700">{d}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 w-full self-start space-y-6">
            <div className="p-6 bg-white border border-gov-gray-200 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gov-navy-900 border-b border-gov-gray-100 pb-2">Explore</h3>
              <ul className="space-y-3 text-sm font-semibold">
                <li><Link to="/news-and-updates" className="flex items-center justify-between text-brand-700 hover:underline">Newsroom <ChevronRightIcon className="w-4 h-4" /></Link></li>
                <li><Link to="/announcements" className="flex items-center justify-between text-brand-700 hover:underline">Announcements <ChevronRightIcon className="w-4 h-4" /></Link></li>
                <li><Link to="/local-governments" className="flex items-center justify-between text-brand-700 hover:underline">Local governments <ChevronRightIcon className="w-4 h-4" /></Link></li>
                <li><Link to="/complaints" className="flex items-center justify-between text-brand-700 hover:underline">Complaints desk <ChevronRightIcon className="w-4 h-4" /></Link></li>
              </ul>
            </div>
            {SITE.email && (
              <div className="p-6 bg-gov-navy-900 text-white rounded-2xl space-y-3">
                <h4 className="text-[10px] font-bold text-gov-cyan-400 uppercase tracking-widest">Enquiries</h4>
                <a href={`mailto:${SITE.email}`} className="block text-sm font-bold hover:underline underline-offset-4 break-all">{SITE.email}</a>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default About;
