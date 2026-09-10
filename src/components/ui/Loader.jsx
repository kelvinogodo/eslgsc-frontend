import clsx from 'clsx';

const Loader = ({ size = 'md', className }) => {
  const sizeClass = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }[size];

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div 
        className={clsx(
          'animate-spin rounded-full border-gov-blue-600 border-t-transparent',
          sizeClass
        )}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
