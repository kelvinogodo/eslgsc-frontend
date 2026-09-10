import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { getPublishedNews } from '../../services/newsService';
import { formatDate, truncate } from '../../lib/utils';
import {
  CalendarIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const categories = [
  { value: 'all', label: 'All Updates' },
  { value: 'news', label: 'News' },
  { value: 'press-releases', label: 'Press Releases' },
  { value: 'announcements', label: 'Announcements' },
  { value: 'speeches', label: 'Speeches' },
  { value: 'notices', label: 'Public Notices' }
];

const NewsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');

  // Sync state with search params
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('all');
    }
  }, [categoryParam]);

  const { data: newsArticles = [], isLoading } = useQuery({
    queryKey: ['news', 'public', 'published'],
    queryFn: () => getPublishedNews({ limit: 30 })
  });

  const spotlightArticle = newsArticles.length > 0 ? newsArticles[0] : null;
  const recentArticles = newsArticles.length > 1 ? newsArticles.slice(1, 4) : [];

  const filteredNews = useMemo(() => {
    let articles = newsArticles;
    if (selectedCategory === 'all') return articles;
    return (articles || []).filter((article) => article.category === selectedCategory);
  }, [selectedCategory, newsArticles]);

  if (isLoading) {
    return (
      <div className="container-custom py-12 space-y-8">
        <Skeleton rows={2} className="h-20 w-3/4" />
        <div className="grid gap-8 lg:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (newsArticles.length === 0) {
    return (
      <div className="pb-20">
        <header className="bg-gov-navy-900 text-white py-16 border-b-4 border-gov-green-600">
          <div className="container-custom max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Newsroom</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Official updates and announcements from the Ebonyi State Local Government Service Commission.
            </p>
          </div>
        </header>
        <div className="container-custom py-20">
          <EmptyState
            title="No public updates yet"
            description="Official notices and press releases will appear here when published by the Commission."
            action={<Button as={Link} to="/" size="sm" variant="outline">Return Home</Button>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-gov-gray-50/30">
      {/* Newsroom Masthead */}
      <header className="bg-gov-navy-900 text-white pt-16 pb-12 border-b-4 border-gov-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/logo/logo.png')] bg-no-repeat bg-right-top opacity-5 grayscale pointer-events-none translate-x-1/4 -translate-y-1/4 scale-150" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 bg-gov-green-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
              Official Commission Feed
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Newsroom</h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
              Official announcements, policy insights, and reform updates from ESLGSC. Stay informed about the latest developments in local governance.
            </p>
          </div>
        </div>
      </header>

      {/* Featured & Recent Section */}
      {selectedCategory === 'all' && spotlightArticle && (
        <section className="bg-white border-b border-gov-gray-200 py-12 lg:py-16">
          <div className="container-custom">
            <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
              {/* Featured Story */}
              <div className="space-y-6">
                <div className="aspect-[16/9] w-full overflow-hidden rounded-sm bg-gov-navy-50 border border-gov-gray-200">
                  {spotlightArticle.imageUrl ? (
                    <img
                      src={spotlightArticle.imageUrl}
                      alt={spotlightArticle.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gov-navy-900/5 flex items-center justify-center">
                      <span className="text-gov-navy-200 font-bold text-xl uppercase tracking-[0.2em]">Official Update</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-gov-green-700">
                      Latest Release
                    </span>
                    <span className="text-xs text-gov-gray-500 font-medium">
                      {formatDate(spotlightArticle.publishedAt || spotlightArticle.createdAt)}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gov-navy-900 hover:text-gov-blue-700 transition-colors">
                    <Link to={`/news-and-updates/${spotlightArticle.slug || spotlightArticle.id}`}>
                      {spotlightArticle.title}
                    </Link>
                  </h2>
                  <p className="text-lg text-gov-gray-600 leading-relaxed">
                    {spotlightArticle.summary || truncate(spotlightArticle.content || '', 180)}
                  </p>
                  <Button 
                    as={Link} 
                    to={`/news-and-updates/${spotlightArticle.slug || spotlightArticle.id}`} 
                    variant="primary" 
                    className="rounded-none px-8"
                  >
                    Read Full Release
                  </Button>
                </div>
              </div>

              {/* Recent Briefs */}
              <div className="space-y-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gov-gray-500 border-b border-gov-gray-200 pb-4">
                  Recent Releases
                </h3>
                <div className="space-y-6">
                  {recentArticles.map((article) => (
                    <article key={article.id} className="group grid grid-cols-[100px_1fr] gap-4 items-start">
                      <div className="aspect-square bg-gov-gray-50 rounded-sm overflow-hidden border border-gov-gray-200">
                        {article.imageUrl ? (
                          <img src={article.imageUrl} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        ) : (
                          <div className="h-full w-full bg-gov-gray-100 flex items-center justify-center">
                            <span className="text-[10px] text-gov-gray-300 font-bold uppercase">ESLGSC</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-gov-blue-600">
                          {article.category || 'Update'}
                        </span>
                        <h4 className="font-bold text-gov-navy-900 leading-snug group-hover:text-gov-blue-700 transition-colors">
                          <Link to={`/news-and-updates/${article.slug || article.id}`}>
                            {article.title}
                          </Link>
                        </h4>
                        <p className="text-xs text-gov-gray-500">
                          {formatDate(article.publishedAt || article.createdAt)}
                        </p>
                      </div>
                    </article>
                  ))}
                  {recentArticles.length === 0 && (
                    <p className="text-sm text-gov-gray-400 italic">No other recent updates.</p>
                  )}
                </div>
                
                <Card className="bg-gov-gray-50 border-gov-gray-200 p-6 rounded-none shadow-none">
                  <h4 className="text-sm font-bold text-gov-navy-900 mb-2 uppercase tracking-wide">Media Enquiries</h4>
                  <p className="text-xs text-gov-gray-600 leading-relaxed mb-4">
                    Official statements and interview requests for ESLGSC leadership can be directed to the Press Office.
                  </p>
                  <a href="mailto:ebonyistatelgsc@gmail.com" className="text-sm font-bold text-gov-blue-600 hover:underline">
                    ebonyistatelgsc@gmail.com
                  </a>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter Navigation */}
      <nav className="bg-gov-navy-900 text-white sticky top-0 z-20 shadow-lg">
        <div className="container-custom">
          <div className="flex flex-wrap items-center">
            {categories.map((category) => (
              <button
                key={category.value}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-4 ${
                  selectedCategory === category.value 
                  ? 'border-gov-green-600 bg-white/5 text-white' 
                  : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => {
                  setSelectedCategory(category.value);
                  if (category.value === 'all') {
                    searchParams.delete('category');
                  } else {
                    searchParams.set('category', category.value);
                  }
                  setSearchParams(searchParams);
                }}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* News Feed */}
      <section id="updates" className="container-custom py-16">
        {filteredNews.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12">
            <h3 className="text-xl font-bold text-gov-navy-900 uppercase tracking-tight">No updates found</h3>
            <p className="text-gov-gray-500 mt-2 mb-6 leading-relaxed">We haven't published any releases under the "{categories.find(c => c.value === selectedCategory)?.label}" category yet.</p>
            <Button onClick={() => setSelectedCategory('all')} variant="outline" size="sm" className="rounded-none">
              View All Updates
            </Button>
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((article) => (
              <article key={article.id} className="group flex flex-col space-y-4">
                <Link to={`/news-and-updates/${article.slug || article.id}`} className="block aspect-[3/2] overflow-hidden bg-gov-gray-100 border border-gov-gray-200">
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full bg-gov-navy-900/5 flex items-center justify-center">
                      <span className="text-gov-navy-200/40 font-bold uppercase tracking-widest text-xs">ESLGSC Release</span>
                    </div>
                  )}
                </Link>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gov-green-700 bg-gov-green-50 px-2 py-0.5 border border-gov-green-100">
                      {article.category || 'News'}
                    </span>
                    <div className="flex items-center gap-1.5 text-gov-gray-400">
                      <CalendarIcon className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {formatDate(article.publishedAt || article.createdAt)}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gov-navy-900 group-hover:text-gov-blue-700 transition-colors leading-snug">
                    <Link to={`/news-and-updates/${article.slug || article.id}`}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gov-gray-600 line-clamp-3 leading-relaxed">
                    {article.summary || truncate(article.content || '', 140)}
                  </p>
                  <Link 
                    to={`/news-and-updates/${article.slug || article.id}`}
                    className="inline-flex items-center text-xs font-bold text-gov-blue-600 hover:text-gov-navy-900 uppercase tracking-widest transition-colors"
                  >
                    Read Release
                    <ChevronRightIcon className="ml-1 w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Official Media Block */}
      <section className="bg-gov-navy-900 text-white py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block border-l-4 border-gov-green-600 pl-4">
                <h2 className="text-3xl font-bold uppercase tracking-tight">Official Communications</h2>
                <p className="text-sm text-gov-green-500 font-bold uppercase tracking-[0.2em] mt-1">Press Desk & Public Information</p>
              </div>
              <p className="text-lg text-white/70 leading-relaxed">
                The ESLGSC Communications Office is the official source for all commission-related statements, policy briefings, and public announcements. We ensure that citizens and partners receive accurate, timely information.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button as="a" href="mailto:ebonyistatelgsc@gmail.com" variant="primary" className="rounded-none bg-gov-green-600 hover:bg-gov-green-700 border-none">
                  Contact Press Office
                </Button>
                <Button as="a" href="https://ebonyistate.gov.ng" target="_blank" variant="outline" className="rounded-none border-white/20 text-white hover:bg-white/5">
                  State Government News
                </Button>
              </div>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="bg-white/5 border-white/10 p-8 rounded-none shadow-none">
                <h4 className="font-bold mb-3 uppercase tracking-widest text-gov-green-500 text-xs">Public Enquiries</h4>
                <p className="text-sm text-white/60 leading-relaxed font-medium italic border-l border-white/20 pl-4">
                  "Direct information regarding commission programmes and community service delivery."
                </p>
              </Card>
              <Card className="bg-white/5 border-white/10 p-8 rounded-none shadow-none">
                <h4 className="font-bold mb-3 uppercase tracking-widest text-gov-green-500 text-xs">Policy Updates</h4>
                <p className="text-sm text-white/60 leading-relaxed font-medium italic border-l border-white/20 pl-4">
                  "Verified access to administrative circulars, reforms, and institutional documentation."
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;