import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { FadeIn } from './motion';

/**
 * Consistent page title block. `description` should be plain language that tells
 * the operator what this page is for; `actions` are the primary buttons.
 */
const PageHeader = ({ title, description, icon: Icon, actions, backTo, backLabel = 'Back', eyebrow, className }) => (
  <FadeIn className={clsx('mb-7', className)} y={10}>
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
      <div className="flex items-start gap-4">
        {Icon && (
          <span className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-700/25">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
        )}
        <div>
          {eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-700">{eyebrow}</p>}
          <h1 className="text-2xl md:text-[1.9rem] font-extrabold tracking-tight text-ink-900 leading-tight">{title}</h1>
          {description && <p className="mt-1.5 max-w-2xl text-[0.95rem] leading-relaxed text-ink-500">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  </FadeIn>
);

export default PageHeader;
