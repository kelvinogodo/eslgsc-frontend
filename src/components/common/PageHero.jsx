import { useId } from 'react';
import clsx from 'clsx';

const backgroundVariants = {
  default: 'bg-gradient-to-b from-gov-blue-50 via-white to-white',
  muted: 'bg-gov-gray-50',
  subtle: 'bg-white'
};

const alignmentVariants = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right'
};

const PageHero = ({
  eyebrow,
  title,
  description,
  actions,
  children,
  variant = 'default',
  align = 'left',
  className
}) => {
  const headingId = useId();
  const descriptionId = description ? `${headingId}-description` : undefined;

  return (
    <section
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      className={clsx(
        'relative overflow-hidden py-16 md:py-20 border-b border-gov-gray-200/60',
        backgroundVariants[variant] ?? backgroundVariants.default,
        className
      )}
    >
      <div className="container-custom">
        <div className={clsx('flex flex-col gap-6 max-w-4xl', alignmentVariants[align])}>
          {eyebrow && (
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gov-blue-600">
              {eyebrow}
            </span>
          )}

          <div className="space-y-4">
            <h1 id={headingId} className="heading-xl text-balance">
              {title}
            </h1>
            {description && (
              <p
                id={descriptionId}
                className="text-lg text-gov-gray-600 leading-relaxed text-balance"
              >
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex flex-wrap items-center gap-3">
              {actions}
            </div>
          )}

          {children}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
