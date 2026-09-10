import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  BuildingOffice2Icon,
  ChevronRightIcon,
  MapIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const zones = [
  { 
    id: 'north', 
    label: 'Ebonyi North',
    lgas: [
      { name: 'Abakaliki', headquarters: 'Abakaliki', devCentres: 4, priority: 'Urban Infrastructure & Digital Governance' },
      { name: 'Ebonyi', headquarters: 'Ugbodo', devCentres: 3, priority: 'Agricultural Development' },
      { name: 'Izzi', headquarters: 'Iboko', devCentres: 3, priority: 'Land & Rural Development' },
      { name: 'Ohaukwu', headquarters: 'Ezzamgbo', devCentres: 3, priority: 'Trade & Administrative Support' }
    ]
  },
  { 
    id: 'central', 
    label: 'Ebonyi Central',
    lgas: [
      { name: 'Ezza North', headquarters: 'Ebonyi', devCentres: 3, priority: 'Civic Engagement & Youth Support' },
      { name: 'Ezza South', headquarters: 'Onueke', devCentres: 3, priority: 'Healthcare & Education' },
      { name: 'Ikwo', headquarters: 'Onuebonyi Echara', devCentres: 4, priority: 'Administrative Innovation & ICT' },
      { name: 'Ishielu', headquarters: 'Ezillo', devCentres: 3, priority: 'Infrastructure & Road Maintenance' }
    ]
  },
  { 
    id: 'south', 
    label: 'Ebonyi South',
    lgas: [
      { name: 'Afikpo North', headquarters: 'Afikpo', devCentres: 2, priority: 'Tourism & Citizen Services' },
      { name: 'Afikpo South', headquarters: 'Nguzu Edda', devCentres: 2, priority: 'Community Development' },
      { name: 'Ivo', headquarters: 'Isiaka', devCentres: 2, priority: 'Public Service & Health' },
      { name: 'Ohaozara', headquarters: 'Obiozara', devCentres: 2, priority: 'Water, Sanitation & Reform' },
      { name: 'Onicha', headquarters: 'Isu', devCentres: 2, priority: 'SME & Social Inclusion' }
    ]
  }
];

const LocalGovernmentPage = () => {
  return (
    <div className="bg-gov-gray-50/30 min-h-screen pb-20">
      {/* Directory Masthead */}
      <header className="bg-gov-navy-900 text-white pt-16 pb-12 border-b-4 border-gov-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/logo/logo.png')] bg-no-repeat bg-right-top opacity-5 grayscale pointer-events-none translate-x-1/4 -translate-y-1/4 scale-150" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 bg-gov-green-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
              Official Directory
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Local Governments</h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
              Directory of the 13 Local Government Areas (LGAs) in Ebonyi State. ESLGSC provides regulatory oversight and administrative support across all jurisdictions.
            </p>
          </div>
        </div>
      </header>

      <div className="container-custom py-12 lg:py-16">
        <div className="grid lg:grid-cols-[300px_1fr] gap-12 items-start">
          {/* Sidebar Context */}
          <aside className="lg:sticky lg:top-8 w-full self-start">
            <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gov-navy-900 border-b border-gov-gray-200 pb-2">
                Oversight Authority
              </h3>
              <p className="text-sm text-gov-gray-600 leading-relaxed">
                The Local Government Service Commission is mandated to manage administrative services and service standards across all 13 LGAs.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gov-gray-700">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gov-green-600 shrink-0" />
                  Official Postings & Gazettes
                </li>
                <li className="flex items-start gap-3 text-sm text-gov-gray-700">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gov-green-600 shrink-0" />
                  Performance Audits
                </li>
                <li className="flex items-start gap-3 text-sm text-gov-gray-700">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gov-green-600 shrink-0" />
                  Administrative Reforms
                </li>
              </ul>
            </div>

            <Card className="bg-gov-navy-900 text-white p-6 rounded-none shadow-none border-none">
              <h4 className="text-xs font-bold text-gov-green-500 uppercase tracking-widest mb-2">Public Enquiries</h4>
              <p className="text-xs text-white/70 leading-relaxed mb-4">
                Enquiries regarding specific LGA services or identity verification can be directed to our central desk.
              </p>
              <a href="mailto:ebonyistatelgsc@gmail.com" className="text-sm font-bold hover:underline underline-offset-4">
                ebonyistatelgsc@gmail.com
              </a>
            </Card>
            </div>
          </aside>

          {/* Directory Main */}
          <div className="space-y-16">
            {zones.map((zone) => (
              <section key={zone.id} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-gov-navy-900">{zone.label}</h2>
                  <div className="h-px flex-1 bg-gov-gray-200" />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  {zone.lgas.map((lga) => (
                    <article key={lga.name} className="group bg-white border border-gov-gray-200 p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6 hover:border-gov-blue-300 hover:shadow-md transition-all">
                      <div className="space-y-4 xl:space-y-1">
                        <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-4">
                          <h3 className="text-xl font-bold text-gov-navy-900">{lga.name}</h3>
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-gray-400 uppercase tracking-widest">
                            <MapPinIcon className="w-3 h-3" />
                            HQ: {lga.headquarters}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                          <div className="flex items-center gap-2 text-xs font-medium text-gov-gray-500">
                            <MapIcon className="w-4 h-4 text-gov-blue-500" />
                            <span>{lga.devCentres} Development Centres</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-gov-gray-500">
                            <BuildingOffice2Icon className="w-4 h-4 text-gov-blue-500" />
                            <span>Priority: {lga.priority}</span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Button
                          as={Link}
                          to={`/contact?lga=${lga.name.toLowerCase()}`}
                          variant="outline"
                          size="sm"
                          className="rounded-none w-full xl:w-auto uppercase text-[10px] tracking-widest font-bold border-gov-gray-200 group-hover:border-gov-blue-600 group-hover:text-gov-blue-600"
                        >
                          Contact Office
                          <ChevronRightIcon className="ml-2 w-3 h-3" />
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}

            {/* General Information Block */}
            <section className="bg-white border border-gov-gray-200 p-8 lg:p-12 space-y-8">
              <div className="max-w-2xl space-y-4">
                <h2 className="text-2xl font-bold text-gov-navy-900">Directory Information</h2>
                <p className="text-gov-gray-600 leading-relaxed">
                  This directory provides an overview of the administrative structure of Local Government Areas in Ebonyi State. Data is updated based on official gazettes and administrative directives from the Commission.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-gov-gray-100">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gov-navy-900 uppercase tracking-widest">Public Accountability</h4>
                  <p className="text-sm text-gov-gray-500 leading-relaxed">
                    Monthly performance metrics and administrative audits for all LGAs are maintained by the Commission to ensure transparency in local governance.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gov-navy-900 uppercase tracking-widest">Development Partners</h4>
                  <p className="text-sm text-gov-gray-500 leading-relaxed">
                    Collaborative projects between LGAs and international partners (USAID, World Bank, etc.) are coordinated through the central ESLGSC Planning Directorate.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalGovernmentPage;