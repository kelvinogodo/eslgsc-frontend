import React from 'react';
import clsx from 'clsx';

/**
 * Shimmering placeholder. Pass `rows` for a stack of text-like lines
 * (several pages already call it that way), or size it with `className`.
 */
function Skeleton({ className = '', rows }) {
  if (rows) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className={clsx('h-4 rounded-lg', i === rows - 1 ? 'w-2/3' : 'w-full')} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded bg-gray-200/80',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer',
        'before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent',
        className
      )}
    />
  );
}

export default Skeleton;
