import React from 'react';
import clsx from 'clsx';

function Skeleton({ className = '' }) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded bg-gray-200 dark:bg-gray-700',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite]',
        'before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent',
        className
      )}
      style={{
        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
      }}
    />
  );
}

export default Skeleton;

/*
  Tailwind CSS keyframes (if using @layer utilities). If not available, the component will still use animate-pulse-like shimmer.
  Add to your globals if desired:
  @keyframes shimmer {
    100% { transform: translateX(100%); }
  }
*/