import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

/** Page title block: title, one line on what the page is for, and the main buttons. */
const PageHeader = ({ title, description, actions, backTo, backLabel = 'Back', className }) => (
  <div className={clsx('mb-7', className)}>
    {backTo && (
      <Link
        to={backTo}
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-brand-700"
      >
        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
        {backLabel}
      </Link>
    )}
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-ink-900 md:text-[1.9rem]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[0.95rem] leading-relaxed text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  </div>
);

export default PageHeader;
