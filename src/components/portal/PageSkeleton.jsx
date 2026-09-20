import Skeleton from '../ui/Skeleton';

/** Shown while a lazy page chunk loads — matches the real layout so it doesn't jump. */
const PageSkeleton = () => (
  <div className="space-y-6" role="status" aria-label="Loading page">
    <div className="space-y-3">
      <Skeleton className="h-8 w-64 rounded-xl" />
      <Skeleton className="h-4 w-96 max-w-full rounded-lg" />
    </div>
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
    </div>
    <Skeleton className="h-72 rounded-2xl" />
  </div>
);

export default PageSkeleton;
