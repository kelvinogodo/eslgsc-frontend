import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PhotoIcon } from '@heroicons/react/24/outline';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { getPublishedNews } from '../../services/newsService';
import { formatDate } from '../../lib/utils';

// The gallery is built only from the pictures on articles the Commission has published, so every
// photo comes with a real title and date, and links to the story it belongs to.
const GalleryPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['news', 'gallery'],
    queryFn: () => getPublishedNews({ limit: 60 }),
    staleTime: 5 * 60 * 1000
  });
  const items = (Array.isArray(data) ? data : []).filter((a) => a.imageUrl);

  return (
    <div className="bg-gov-gray-50/30 min-h-screen pb-20">
      <header className="page-banner bg-gov-navy-900 text-white pt-10 pb-8 md:pt-12 md:pb-10 border-b-4 border-gov-cyan-500 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 bg-gov-cyan-500 text-gov-navy-900 text-[10px] font-bold uppercase tracking-widest rounded-sm">
              Photo Gallery
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photo Gallery</h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl">Pictures from the Commission’s published news stories.</p>
          </div>
        </div>
      </header>

      <div className="container-custom py-12">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3] rounded-xl" />)}</div>
        ) : isError ? (
          <EmptyState icon={PhotoIcon} title="The gallery isn’t available right now" description="Please try again in a little while." />
        ) : items.length === 0 ? (
          <EmptyState icon={PhotoIcon} title="No photos yet" description="Pictures will appear here as news stories with photos are published." action={<Link to="/news-and-updates" className="btn btn-outline btn-md">Go to the Newsroom</Link>} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <Link key={a.id} to={`/news-and-updates/${a.slug || a.id}`} className="group overflow-hidden rounded-xl border border-gov-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-gold-400 hover:shadow-lg">
                <div className="aspect-[4/3] overflow-hidden bg-gov-gray-100">
                  <img src={a.imageUrl} alt={a.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <p className="font-bold text-gov-navy-900 leading-snug line-clamp-2">{a.title}</p>
                  <p className="mt-1 text-xs text-gov-gray-500">{formatDate(a.publishedAt || a.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
