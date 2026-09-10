import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  MapPinIcon,
  AcademicCapIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

const flagshipCenters = [
  {
    lga: 'Abakaliki',
    name: 'Ebonyi State Training School',
    focus: 'Administrative protocols, public finance, and governance modules for local government roles.',
    location: 'Abakaliki Development Centre',
    capacity: 'Administrative coordination point',
    facilities: ['Classroom suites', 'Resource library', 'Conference rooms'],
    image: '/images/gallery/image2.jpg'
  },
  {
    lga: 'Ivo',
    name: 'Community Leadership Hub',
    focus: 'Grassroots administration and citizen engagement modules for community coordination.',
    location: 'Ivo Development Centre',
    capacity: 'Administrative coordination point',
    facilities: ['Dialogue space', 'Meeting rooms'],
    image: '/images/gallery/image5.jpg'
  },
  {
    lga: 'Ikwo',
    name: 'Ikwo Digital Innovation Lab',
    focus: 'Data management, electronic records, and ICT service delivery coordination.',
    location: 'Ikwo Development Centre',
    capacity: 'Administrative coordination point',
    facilities: ['ICT suites', 'Technical workspace'],
    image: '/images/gallery/image6.jpg'
  },
  {
    lga: 'Afikpo South',
    name: 'Afikpo South Service Academy',
    focus: 'Community development, budgeting, and administrative monitoring frameworks.',
    location: 'Afikpo South Development Centre',
    capacity: 'Administrative coordination point',
    facilities: ['Facilitation rooms', 'Documentation area'],
    image: '/images/gallery/image4.jpg'
  }
];

const DcPage = () => {
  return (
    <div className="bg-gov-gray-50/30 min-h-screen pb-20">
      {/* Masthead */}
      <header className="bg-gov-navy-900 text-white pt-16 pb-12 border-b-4 border-gov-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/logo/logo.png')] bg-no-repeat bg-right-top opacity-5 grayscale pointer-events-none translate-x-1/4 -translate-y-1/4 scale-150" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 bg-gov-green-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
              Official Directory
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Development Centers</h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
              Directory of administrative units supporting grassroots development across Ebonyi State. The Commission coordinates centers across the 13 LGAs.
            </p>
          </div>
        </div>
      </header>

      <div className="container-custom py-12 lg:py-16">
        <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-start">
          {/* Main Content */}
          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <h2 className="text-2xl font-bold text-gov-navy-900 uppercase tracking-tight whitespace-nowrap">Development Center Directory</h2>
                  <div className="h-px flex-1 bg-gov-gray-200 hidden md:block" />
                </div>
                <span className="text-[10px] font-bold text-gov-gray-400 uppercase tracking-widest bg-white px-2 py-1 border border-gov-gray-100">
                  * Images represent general administrative facilities
                </span>
              </div>
              
              <div className="grid gap-8">
                {flagshipCenters.map((centre) => (
                  <article key={centre.name} className="group bg-white border border-gov-gray-200 overflow-hidden flex flex-col md:flex-row hover:border-gov-blue-300 transition-colors">
                    <div className="md:w-64 h-48 md:h-auto shrink-0 bg-gov-gray-100">
                      <img
                        src={centre.image}
                        alt="Administrative Facility Illustration"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-8 space-y-4 flex-1">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gov-blue-600 uppercase tracking-widest">{centre.lga} LGA Jurisdiction</span>
                        <h3 className="text-xl font-bold text-gov-navy-900">{centre.name}</h3>
                      </div>
                      <p className="text-sm text-gov-gray-600 leading-relaxed max-w-2xl">
                        {centre.focus}
                      </p>
                      <div className="flex flex-wrap gap-4 pt-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-gov-gray-500 uppercase tracking-widest">
                          <MapPinIcon className="w-3.5 h-3.5 text-gov-green-600" />
                          {centre.location}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gov-gray-500 uppercase tracking-widest">
                          <AcademicCapIcon className="w-3.5 h-3.5 text-gov-green-600" />
                          {centre.capacity}
                        </div>
                      </div>
                      <div className="pt-4 flex flex-wrap gap-2">
                        {centre.facilities.map(f => (
                          <span key={f} className="px-2 py-1 bg-gov-gray-50 border border-gov-gray-200 text-[10px] font-bold text-gov-gray-500 uppercase tracking-tighter">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Directory Overview */}
            <section className="bg-white border border-gov-gray-200 p-8 lg:p-12 space-y-10">
              <div className="max-w-2xl space-y-4">
                <h2 className="text-2xl font-bold text-gov-navy-900">Administrative Structure</h2>
                <p className="text-gov-gray-600 leading-relaxed">
                  Development Centers (DCs) function as the administrative arms of Local Government Areas, ensuring that services and development coordination reach the communities across Ebonyi State.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 border-l-2 border-gov-navy-900 bg-gov-gray-50">
                  <h4 className="text-xs font-bold text-gov-navy-900 uppercase tracking-widest mb-1">Ebonyi North Region</h4>
                  <p className="text-[11px] text-gov-gray-500 font-medium italic">Administrative coordination units.</p>
                </div>
                <div className="p-4 border-l-2 border-gov-navy-900 bg-gov-gray-50">
                  <h4 className="text-xs font-bold text-gov-navy-900 uppercase tracking-widest mb-1">Ebonyi South Cluster</h4>
                  <p className="text-[11px] text-gov-gray-500 font-medium italic">Administrative coordination units.</p>
                </div>
                <div className="p-4 border-l-2 border-gov-navy-900 bg-gov-gray-50">
                  <h4 className="text-xs font-bold text-gov-navy-900 uppercase tracking-widest mb-1">Ebonyi Central Cluster</h4>
                  <p className="text-[11px] text-gov-gray-500 font-medium italic">Administrative coordination units.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gov-gray-100">
                <p className="text-xs text-gov-gray-400 italic">
                  * Note: This directory lists primary administrative facilities. For a full official list of development centers, contact the Directorate of Local Government Affairs.
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-8 w-full self-start">
            <div className="space-y-12">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gov-navy-900 border-b-2 border-gov-navy-900 pb-2">
                Coordination Areas
              </h3>
              <div className="space-y-4">
                {[
                  { title: 'Administrative Excellence', type: 'Administrative' },
                  { title: 'Service Delivery', type: 'Operations' },
                  { title: 'Information Systems', type: 'ICT' },
                  { title: 'Community Coordination', type: 'Community' }
                ].map(p => (
                  <div key={p.title} className="group p-4 border border-gov-gray-200 bg-white hover:border-gov-blue-600 transition-colors">
                    <span className="text-[9px] font-bold text-gov-blue-600 uppercase tracking-widest">{p.type} Track</span>
                    <h4 className="text-sm font-bold text-gov-navy-900 mt-1">{p.title}</h4>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-gov-navy-900 text-white p-8 space-y-4 rounded-none border-none">
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-gov-green-500">Public Enquiries</h4>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                Enquiries regarding center activities and administrative coordination can be directed to the Commission.
              </p>
              <Button as="a" href="mailto:ebonyistatelgsc@gmail.com" className="w-full bg-gov-green-600 hover:bg-gov-green-700 text-white border-none rounded-none text-xs font-bold uppercase tracking-widest">
                Contact Commission
              </Button>
            </Card>

            <div className="p-6 border border-gov-gray-200 bg-white space-y-4">
              <h4 className="text-[10px] font-bold text-gov-navy-900 uppercase tracking-widest">External Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="https://ebonyistate.gov.ng" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-xs font-bold text-gov-gray-500 hover:text-gov-blue-600 uppercase tracking-tighter">
                    State Government Portal
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a href="/news-and-updates" className="flex items-center justify-between text-xs font-bold text-gov-gray-500 hover:text-gov-blue-600 uppercase tracking-tighter">
                    Commission Newsroom
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

export default DcPage;