import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getNewsBySlug, getPublishedNewsById, getPublishedNews } from '../../services/newsService';
import Skeleton from '../../components/ui/Skeleton';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  UserIcon, 
  ShareIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { formatDate } from '../../lib/utils';

const isUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

const NewsDetailPage = () => {
  const { slug } = useParams();
  const isId = isUUID(slug);
  
  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['news', 'public', slug, isId ? 'id' : 'slug'],
    queryFn: async () => {
      if (isId) {
        return await getPublishedNewsById(slug);
      } else {
        try {
          return await getNewsBySlug(slug);
        } catch (error) {
          if (error?.response?.status === 404 && isUUID(slug)) {
            return await getPublishedNewsById(slug);
          }
          throw error;
        }
      }
    },
    retry: false
  });

  const { data: latestNews = [] } = useQuery({
    queryKey: ['news', 'public', 'latest-sidebar'],
    queryFn: () => getPublishedNews({ limit: 5 }),
    enabled: !!article
  });

  if (isLoading) {
    return (
      <div className="container-custom py-12 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          <div className="space-y-8">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-[400px] w-full" />
            <Skeleton rows={10} />
          </div>
          <div className="hidden lg:block space-y-8">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !article || article.status !== 'published') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-6">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gov-navy-900 uppercase tracking-tight">Release Not Found</h1>
            <p className="text-gov-gray-600 leading-relaxed">
              The requested official update could not be found. It may have been archived or moved.
            </p>
          </div>
          <Button as={Link} to="/news-and-updates" variant="primary" className="rounded-none">
            Return to Newsroom
          </Button>
        </div>
      </div>
    );
  }

  const otherNews = latestNews.filter(n => n.id !== article.id).slice(0, 3);

  return (
    <div className="pb-20 bg-white">
      {/* Article Header */}
      <header className="bg-gov-gray-50 border-b border-gov-gray-200 pt-8 pb-12">
        <div className="container-custom">
          <nav className="mb-8">
            <Link to="/news-and-updates" className="inline-flex items-center text-sm font-bold text-gov-blue-600 hover:text-gov-navy-900 transition-colors uppercase tracking-widest">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Newsroom
            </Link>
          </nav>
          
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-4">
              <span className="px-2 py-0.5 bg-gov-green-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-sm">
                {article.category || 'Commission Update'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gov-navy-900 leading-tight tracking-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-y-4 gap-x-8 pt-4 border-t border-gov-gray-200">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gov-green-600" />
                <span className="text-xs font-bold text-gov-navy-700 uppercase tracking-widest">
                  {formatDate(article.publishedAt || article.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gov-green-600" />
                <span className="text-xs font-bold text-gov-navy-700 uppercase tracking-widest">
                  {article.authorName || 'ESLGSC Media'}
                </span>
              </div>
              <div className="bg-gov-navy-900 px-2 py-0.5">
                <span className="text-[9px] font-bold text-white uppercase tracking-[0.2em]">
                  Official Release
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-12 lg:py-16">
        <div className="grid lg:grid-cols-[1fr_320px] gap-16">
          {/* Main Content */}
          <article className="space-y-10">
            {/* Main Image */}
            {article.imageUrl && (
              <figure className="space-y-3">
                <div className="overflow-hidden bg-gov-gray-100 border border-gov-gray-200 shadow-sm">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-auto object-cover max-h-[600px]" 
                  />
                </div>
                <figcaption className="text-[10px] text-gov-gray-400 font-bold uppercase tracking-widest border-l border-gov-green-600 pl-3">
                  Commission Media Asset
                </figcaption>
              </figure>
            )}

            {/* Article Body */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gov-navy-900 prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-p:text-gov-gray-700 prose-p:leading-relaxed prose-strong:text-gov-navy-900 prose-a:text-gov-blue-600 prose-img:rounded-none border-b border-gov-gray-100 pb-12"
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />

            {/* Source Attribution */}
            <div className="bg-gov-gray-50 p-6 border-l-4 border-gov-navy-900">
              <h4 className="text-xs font-bold text-gov-navy-900 mb-1 uppercase tracking-[0.2em]">Source Information</h4>
              <p className="text-sm text-gov-gray-600 leading-relaxed">
                This announcement was released by the <strong>Ebonyi State Local Government Service Commission</strong>. 
                For verified inquiries, contact <a href="mailto:ebonyistatelgsc@gmail.com" className="text-gov-blue-600 font-bold underline">ebonyistatelgsc@gmail.com</a>.
              </p>
            </div>

            {/* Sharing */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gov-gray-400">Share Release</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-none border-gov-gray-200 hover:bg-gov-gray-50 text-[10px] font-bold uppercase tracking-widest" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank')}>
                  <ShareIcon className="w-3 h-3 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" size="sm" className="rounded-none border-gov-gray-200 hover:bg-gov-gray-50 text-[10px] font-bold uppercase tracking-widest" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>
                  <ShareIcon className="w-3 h-3 mr-2" />
                  Facebook
                </Button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-12">
            {/* Latest Updates */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gov-navy-900 border-b-2 border-gov-navy-900 pb-2">
                Recent Updates
              </h3>
              <div className="space-y-6">
                {otherNews.length > 0 ? otherNews.map((n) => (
                  <Link key={n.id} to={`/news-and-updates/${n.slug || n.id}`} className="group block space-y-2">
                    <span className="text-[10px] font-bold text-gov-blue-600 uppercase tracking-widest">
                      {n.category || 'Update'}
                    </span>
                    <h4 className="text-sm font-bold text-gov-navy-900 group-hover:text-gov-blue-700 transition-colors leading-snug">
                      {n.title}
                    </h4>
                    <p className="text-[11px] text-gov-gray-400 font-medium">
                      {formatDate(n.publishedAt || n.createdAt)}
                    </p>
                  </Link>
                )) : (
                  <p className="text-xs text-gov-gray-400 italic">No other recent releases.</p>
                )}
              </div>
              <Link 
                to="/news-and-updates" 
                className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gov-navy-900 hover:text-gov-blue-600 transition-colors"
              >
                Browse Newsroom
                <ChevronRightIcon className="ml-1 w-3 h-3" />
              </Link>
            </div>

            {/* Official Contact */}
            <div className="bg-gov-navy-900 text-white p-8 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-gov-green-500">Communications</h4>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                Accredited media houses can request high-resolution assets and official comments via our press office.
              </p>
              <a href="mailto:ebonyistatelgsc@gmail.com" className="block text-sm font-bold text-white hover:text-gov-green-500 transition-colors break-words">
                ebonyistatelgsc@gmail.com
              </a>
            </div>

            {/* Notice */}
            <div className="p-6 border border-gov-gray-200 bg-gov-gray-50 space-y-3">
              <h4 className="text-[10px] font-bold text-gov-navy-900 uppercase tracking-widest border-b border-gov-gray-200 pb-2">Disclaimer</h4>
              <p className="text-[11px] text-gov-gray-500 leading-relaxed font-medium italic">
                Official documentation of the ESLGSC. Redistribution permitted only with source citation.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;

