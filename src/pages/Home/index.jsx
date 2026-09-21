import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  NewspaperIcon,
  ArrowRightIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  MapIcon,
  BuildingOffice2Icon,
  QuestionMarkCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { getPublishedNews } from '../../services/newsService';
import { getDirectory } from '../../services/directoryService';
import { formatDate, truncate } from '../../lib/utils';

// Everything on this page is either fixed wording about the website itself, or comes from
// data: published news (posted by the Commission's staff) and the staff records (station and
// department names). Nothing here is a hand-typed claim or figure.

// 1. Hero (size and layout unchanged)
const HeroSection = () => (
  <section data-no-reveal className="relative bg-gov-navy-900 text-white overflow-hidden">
    <div className="absolute inset-0 opacity-40">
      <img
        src="/images/hero/hero8.jpg"
        alt="Government building displaying the Ebonyi State coat of arms"
        className="kenburns w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gov-navy-900/80 via-gov-navy-900/20 to-transparent" />
    </div>

    <div className="relative container-custom py-20 md:py-32">
      <div className="hero-rise max-w-3xl space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gov-cyan-400">
              Official Website
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-balance">
            Ebonyi State Local Government Service Commission
          </h1>
          <p className="text-lg md:text-xl text-gov-gray-300 leading-relaxed max-w-2xl">
            News and announcements from the Commission, a directory of local government headquarters
            and development centres, and a desk for public complaints.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button size="lg" as={Link} to="/about" className="bg-gov-cyan-500 hover:bg-gov-cyan-600 text-gov-navy-900 border-none">
            About the Commission
          </Button>
          <Button variant="outline" size="lg" as={Link} to="/news-and-updates" className="text-white border-white/30 hover:bg-white/10">
            Official Newsroom
          </Button>
        </div>
      </div>
    </div>
  </section>
);

// 2. Quick access: only pages that exist and are kept up to date from data
const QuickAccessPanel = () => {
  const links = [
    { icon: NewspaperIcon, title: 'Newsroom', href: '/news-and-updates' },
    { icon: BellIcon, title: 'Announcements', href: '/announcements' },
    { icon: ChatBubbleLeftRightIcon, title: 'Complaints Desk', href: '/complaints' },
    { icon: MapIcon, title: 'Local Governments', href: '/local-governments' },
    { icon: BuildingOffice2Icon, title: 'Development Centres', href: '/development-centers' },
    { icon: QuestionMarkCircleIcon, title: 'FAQ', href: '/faq' }
  ];

  return (
    <section className="relative -mt-12 z-10 pb-12">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {links.map((link) => (
            <Link
              key={link.title}
              to={link.href}
              className="group bg-white p-6 rounded-xl shadow-md border border-gov-gray-200 hover:border-gold-400 hover:shadow-lg hover:-translate-y-0.5 transition-all text-center"
            >
              <link.icon className="w-8 h-8 mx-auto mb-3 transition-transform group-hover:scale-110 text-brand-600" />
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

// 3. Latest news: only when the Commission has published something
const NewsGrid = () => {
  const { data: newsArticles = [], isLoading, isError } = useQuery({
    queryKey: ['news', 'home-preview'],
    queryFn: () => getPublishedNews({ limit: 3 }),
    retry: 1
  });

  if (!isLoading && (isError || newsArticles.length === 0)) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container-custom space-y-12">
        <div className="flex items-end justify-between border-b border-gov-gray-200 pb-8">
          <div className="space-y-2">
            <h2 className="heading-lg">Latest News</h2>
            <p className="text-gov-gray-600 max-w-xl">Posted by the Commission.</p>
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsArticles.slice(0, 3).map((article) => (
              <Link key={article.id} to={`/news-and-updates/${article.slug || article.id}`} className="group space-y-4 block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gov-gray-100">
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gov-gray-300"><NewspaperIcon className="h-12 w-12" aria-hidden="true" /></div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gov-gray-500 flex items-center gap-2">
                    <BellIcon className="w-3.5 h-3.5" />
                    {formatDate(article.publishedAt || article.createdAt)}
                  </div>
                  <h3 className="text-xl font-bold text-gov-navy-900 group-hover:text-brand-700 transition-colors leading-snug">
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

// 4. Where staff are posted: counts come straight from the staff records
const StationsOverview = () => {
  const { data } = useQuery({ queryKey: ['public', 'directory'], queryFn: getDirectory, staleTime: 30 * 60 * 1000 });
  const stats = [
    { value: data?.headquarters?.length, label: 'Local government headquarters', href: '/local-governments' },
    { value: data?.centres?.length, label: 'Development centres', href: '/development-centers' },
    { value: data?.departments?.length, label: 'Departments', href: '/about#departments' }
  ].filter((s) => s.value > 0);

  if (stats.length === 0) return null;

  return (
    <section className="py-16 bg-gov-gray-50">
      <div className="container-custom space-y-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="heading-lg">Across Ebonyi State</h2>
          <p className="text-gov-gray-600">Where Commission staff are posted, taken from the Commission’s staff records.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {stats.map((s) => (
            <Link key={s.label} to={s.href} className="group rounded-2xl border border-gov-gray-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-gold-400 hover:shadow-lg">
              <p className="text-4xl font-extrabold text-brand-700">{s.value}</p>
              <p className="mt-2 font-semibold text-gov-navy-900">{s.label}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                See the list <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. How can we help
const ServiceDesk = () => {
  const items = [
    { icon: ChatBubbleLeftRightIcon, title: 'Submit a complaint', text: 'Report a concern to the Commission. You are given a reference ID when it is sent, and giving your name is optional.', to: '/complaints', cta: 'Open the complaints desk' },
    { icon: MapIcon, title: 'Find a local government', text: 'See the local government headquarters and development centres where Commission staff are posted.', to: '/local-governments', cta: 'Open the directory' },
    { icon: InformationCircleIcon, title: 'Get answers quickly', text: 'Read answers to common questions about using this website.', to: '/faq', cta: 'Read the FAQ' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom space-y-10">
        <div className="max-w-2xl space-y-3">
          <h2 className="heading-lg">How can we help?</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, title, text, to, cta }) => (
            <Link key={title} to={to} className="group flex flex-col rounded-2xl border border-gov-gray-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-gold-400 hover:shadow-lg">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-gold-400 group-hover:text-gov-navy-900">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-bold text-gov-navy-900">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gov-gray-600">{text}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                {cta} <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// 6. Photos from published news (nothing is shown until stories with photos exist)
const PhotoStrip = () => {
  const { data } = useQuery({ queryKey: ['news', 'gallery-preview'], queryFn: () => getPublishedNews({ limit: 24 }), staleTime: 5 * 60 * 1000 });
  const photos = (Array.isArray(data) ? data : []).filter((a) => a.imageUrl).slice(0, 4);
  if (photos.length === 0) return null;

  return (
    <section className="py-20 bg-gov-gray-50">
      <div className="container-custom space-y-10 text-center">
        <div className="space-y-2">
          <h2 className="heading-lg">In Pictures</h2>
          <p className="text-gov-gray-600">Photos from the Commission’s published news.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((a) => (
            <Link key={a.id} to={`/news-and-updates/${a.slug || a.id}`} title={a.title} className="group aspect-square rounded-xl overflow-hidden bg-gov-gray-100 block">
              <img src={a.imageUrl} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </Link>
          ))}
        </div>
        <Button variant="ghost" as={Link} to="/gallery" className="text-gov-navy-600 font-bold hover:bg-gov-navy-50">
          View the gallery
        </Button>
      </div>
    </section>
  );
};

const Home = () => (
  <div className="min-h-screen bg-white">
    <HeroSection />
    <QuickAccessPanel />
    <NewsGrid />
    <StationsOverview />
    <ServiceDesk />
    <PhotoStrip />
  </div>
);

export default Home;
