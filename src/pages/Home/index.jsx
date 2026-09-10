import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  AcademicCapIcon, 
  NewspaperIcon,
  ArrowRightIcon,
  PhotoIcon,
  DocumentTextIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  IdentificationIcon,
  DocumentArrowDownIcon,
  MapIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { getPublishedNews } from '../../services/newsService';
import { formatDate, truncate } from '../../lib/utils';
import { 
  OFFICIAL_NOTICE_STRIP, 
  OFFICIAL_CIRCULARS 
} from '../../lib/constants';

// 1. Official Notice Strip Component
const OfficialNoticeBar = () => {
  if (!OFFICIAL_NOTICE_STRIP) return null;
  
  return (
    <div className="bg-gov-navy-50 border-b border-gov-navy-100 py-3">
      <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 bg-gov-navy-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
            Official Notice
          </span>
          <p className="text-sm font-medium text-gov-navy-900 leading-tight">
            {OFFICIAL_NOTICE_STRIP.text}
          </p>
        </div>
        <Link 
          to={OFFICIAL_NOTICE_STRIP.link}
          className="text-xs font-bold text-gov-navy-600 hover:text-gov-navy-800 underline underline-offset-4 flex items-center gap-1"
        >
          Read full details
          <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

// 2. News-Led Hero Section (Neutralized)
const HeroSection = () => (
  <section className="relative bg-gov-navy-900 text-white overflow-hidden">
    <div className="absolute inset-0 opacity-40">
      <img 
        src="/images/hero/hero1.jpg" 
        alt="ESLGSC Complex" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gov-navy-900/80 via-gov-navy-900/20 to-transparent" />
    </div>

    <div className="relative container-custom py-20 md:py-32">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gov-cyan-400">
              Official Portal
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-balance">
            Ebonyi State Local Government Service Commission
          </h1>
          <p className="text-lg md:text-xl text-gov-gray-300 leading-relaxed max-w-2xl">
            The central authority for administrative excellence, professional discipline, and 
            unified administrative management across all 13 Local Government Areas in Ebonyi State.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button size="lg" as={Link} to="/about" className="bg-gov-cyan-500 hover:bg-gov-cyan-600 text-gov-navy-900 border-none">
            Our Statutory Mandate
          </Button>
          <Button variant="outline" size="lg" as={Link} to="/news-and-updates" className="text-white border-white/30 hover:bg-white/10">
            Official Newsroom
          </Button>
        </div>
      </div>
    </div>
  </section>
);

// 3. Quick Access Panel
const QuickAccessPanel = () => {
  const links = [
    { icon: DocumentTextIcon, title: 'Official Circulars', href: '/news-and-updates', color: 'text-blue-600' },
    { icon: BellIcon, title: 'Public Notices', href: '/news-and-updates', color: 'text-orange-600' },
    { icon: ChatBubbleLeftRightIcon, title: 'Complaints Desk', href: '/complaints', color: 'text-green-600' },
    { icon: MapIcon, title: 'LGA Directory', href: '/local-governments', color: 'text-purple-600' },
    { icon: AcademicCapIcon, title: 'Advocacy', href: '/about', color: 'text-red-600' },
    { icon: NewspaperIcon, title: 'Press Releases', href: '/news-and-updates', color: 'text-cyan-600' },
  ];

  return (
    <section className="relative -mt-12 z-10 pb-12">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {links.map((link) => (
            <Link 
              key={link.title}
              to={link.href}
              className="group bg-white p-6 rounded-xl shadow-md border border-gov-gray-200 hover:border-gov-navy-300 hover:shadow-lg transition-all text-center"
            >
              <link.icon className={`w-8 h-8 mx-auto mb-3 transition-transform group-hover:scale-110 ${link.color}`} />
              <span className="text-sm font-bold text-gov-gray-900 group-hover:text-gov-navy-700 uppercase tracking-tight leading-tight block">
                {link.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// 4. Latest News Grid (Clean Empty State)
const NewsGrid = () => {
  const { data: newsArticles = [], isLoading, isError } = useQuery({
    queryKey: ['news', 'home-preview'],
    queryFn: () => getPublishedNews({ limit: 3 }),
    retry: 1
  });

  return (
    <section className="py-20 bg-white">
      <div className="container-custom space-y-12">
        <div className="flex items-end justify-between border-b border-gov-gray-200 pb-8">
          <div className="space-y-2">
            <h2 className="heading-lg">Latest Updates & Press Releases</h2>
            <p className="text-gov-gray-600 max-w-xl">Verified official communications from the Commission.</p>
          </div>
          <Button variant="ghost" as={Link} to="/news-and-updates" className="text-gov-navy-600 font-bold hidden sm:flex items-center gap-2">
            Visit Newsroom
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
            ))}
          </div>
        ) : (isError || newsArticles.length === 0) ? (
          <EmptyState 
            title="No public updates yet"
            description="Official notices and press releases will appear here when published by the Commission."
            action={
              <Button as={Link} to="/news-and-updates" size="sm" variant="outline">
                Visit Newsroom
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsArticles.slice(0, 3).map((article) => (
              <Link key={article.id} to={`/news-and-updates/${article.id}`} className="group space-y-4 block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gov-gray-100">
                  <img 
                    src={article.image || article.imageUrl || '/images/gallery/image14.jpg'} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gov-navy-900 text-[10px] font-bold uppercase px-2 py-1 rounded-sm shadow-sm border border-white/20">
                      {article.category || 'Update'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gov-gray-500 flex items-center gap-2">
                    <BellIcon className="w-3.5 h-3.5" />
                    {formatDate(article.date || article.publishedAt || article.createdAt)}
                  </div>
                  <h3 className="text-xl font-bold text-gov-navy-900 group-hover:text-gov-blue-600 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gov-gray-600 line-clamp-2">
                    {truncate(article.summary || article.content || '', 100)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// 5. Official Documents Section (Truth Pass)
const DocumentArchive = () => (
  <section id="documents" className="py-20 bg-gov-gray-50">
    <div className="container-custom">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="heading-lg">Official Documents & Circulars</h2>
            <p className="text-gov-gray-600 leading-relaxed text-balance">
              Access official administrative guides and policy directives issued by the Commission.
            </p>
          </div>
          <div className="p-6 bg-gov-navy-700 text-white rounded-2xl space-y-4">
            <InformationCircleIcon className="w-8 h-8 text-gov-cyan-400" />
            <h3 className="text-lg font-bold">Document Access</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Official records will be uploaded to this portal once verified by the Commission Secretariat.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {OFFICIAL_CIRCULARS && OFFICIAL_CIRCULARS.length > 0 ? (
            <>
              {OFFICIAL_CIRCULARS.map((doc) => (
                <Card key={doc.id} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg border border-gov-gray-200 flex items-center justify-center flex-shrink-0">
                      <DocumentArrowDownIcon className="w-6 h-6 text-gov-navy-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gov-blue-600">
                          {doc.type}
                        </span>
                        <span className="text-gov-gray-300">•</span>
                        <span className="text-xs text-gov-gray-500 font-medium">Ref: {doc.ref}</span>
                      </div>
                      <h4 className="text-lg font-bold text-gov-navy-900 leading-tight">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-gov-gray-500 mt-2">Effective: {formatDate(doc.date)}</p>
                    </div>
                  </div>
                  {doc.url && (
                    <Button size="sm" variant="outline" className="w-full sm:w-auto border-gov-navy-200 text-gov-navy-700 hover:bg-gov-navy-50">
                      Download PDF
                    </Button>
                  )}
                </Card>
              ))}
              <div className="text-center pt-4">
                <Link to="/news-and-updates" className="text-sm font-bold text-gov-navy-600 hover:underline">
                  Browse full document archive
                </Link>
              </div>
            </>
          ) : (
            <EmptyState 
              title="Archive currently empty"
              description="No circulars or official documents have been uploaded yet. Please check back later."
            />
          )}
        </div>
      </div>
    </div>
  </section>
);

// 6. About Section
const AboutSection = () => (
  <section className="py-24 bg-white">
    <div className="container-custom">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-gov-navy-50 rounded-full -z-10" />
          <img 
            src="/images/gallery/image11.jpg" 
            alt="Commission Building" 
            className="rounded-2xl shadow-xl w-full h-[500px] object-cover"
          />
          <div className="absolute -bottom-10 -right-10 hidden xl:block">
            <Card className="p-8 space-y-2 border-l-4 border-gov-navy-600 shadow-2xl">
              <span className="text-4xl font-bold text-gov-navy-800">13</span>
              <p className="text-sm font-bold text-gov-gray-500 uppercase tracking-widest leading-tight">Local Governments</p>
            </Card>
          </div>
        </div>
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="heading-xl">Statutory Leadership & Public Accountability</h2>
            <p className="text-lg text-gov-gray-600 leading-relaxed">
              The Ebonyi State Local Government Service Commission is the supreme statutory body 
              responsible for the professional management, discipline, and oversight of local 
              government administration across all 13 LGAs.
            </p>
            <p className="text-gov-gray-600 leading-relaxed">
              We ensure that local governance is driven by verified policies, transparency, 
              and a commitment to excellent service delivery for every community in Ebonyi State.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2 border-l-2 border-gov-cyan-500 pl-4">
              <h4 className="font-bold text-gov-navy-900">Official Oversight</h4>
              <p className="text-sm text-gov-gray-600 leading-relaxed">Monitoring administrative excellence and ethical conduct across all secretariats.</p>
            </div>
            <div className="space-y-2 border-l-2 border-gov-cyan-500 pl-4">
              <h4 className="font-bold text-gov-navy-900">Policy Development</h4>
              <p className="text-sm text-gov-gray-600 leading-relaxed">Creating the unified service frameworks that power grassroots development.</p>
            </div>
          </div>
          <Button as={Link} to="/about" variant="outline" size="lg" className="border-gov-navy-300 text-gov-navy-800 hover:bg-gov-navy-50">
            Learn more about our mandate
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <OfficialNoticeBar />
      
      <HeroSection />
      
      <QuickAccessPanel />

      <NewsGrid />

      <DocumentArchive />

      <AboutSection />

      {/* LGA CTA */}
      <section className="py-20 bg-gov-navy-900 text-white">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div className="max-w-xl space-y-4">
            <h2 className="text-3xl font-bold">Explore the 13 Local Government Areas</h2>
            <p className="text-white/70 leading-relaxed text-balance">
              Access the official directory, headquarters, and flagship initiatives of Ebonyi State's local governments and development centers.
            </p>
          </div>
          <Button size="lg" as={Link} to="/local-governments" className="bg-white text-gov-navy-900 hover:bg-gov-gray-100 flex-shrink-0 w-full md:w-auto">
            Open LGA Directory
          </Button>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20">
        <div className="container-custom space-y-10 text-center">
          <div className="space-y-2">
            <h2 className="heading-lg">Commission Activities in Focus</h2>
            <p className="text-gov-gray-600">Visual records of official ceremonies and community outreach.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gov-gray-100">
                <img 
                  src={`/images/gallery/image${i}.jpg`} 
                  alt={`Gallery ${i}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                />
              </div>
            ))}
          </div>
          <Button variant="ghost" as={Link} to="/gallery" className="text-gov-navy-600 font-bold hover:bg-gov-navy-50">
            View full gallery
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
