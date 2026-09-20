import { Link } from 'react-router-dom';
import { FadeIn } from './motion';
import Logo from './Logo';
import usePortalTheme from '../../hooks/usePortalTheme';
import usePageTitle from '../../hooks/usePageTitle';

/** Full-page friendly message for 404 / no-permission screens. */
const ErrorPage = ({ code, title, message, icon: Icon, actions }) => {
  usePortalTheme();
  usePageTitle(title);
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 animate-float-slow rounded-full bg-brand-300/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 animate-float-slower rounded-full bg-gold-300/30 blur-3xl" aria-hidden="true" />

      <FadeIn className="relative w-full max-w-lg">
        <div className="mb-10 flex justify-center"><Logo to="/" /></div>
        <div className="card p-10">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-xl shadow-brand-700/30">
            <Icon className="h-10 w-10" aria-hidden="true" />
          </span>
          {code && <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.2em] text-gold-600">{code}</p>}
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">{title}</h1>
          <p className="mx-auto mt-3 max-w-sm text-[0.95rem] leading-relaxed text-ink-500">{message}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {actions || (
              <>
                <Link to="/dashboard" className="btn btn-primary btn-md">Go to my home page</Link>
                <Link to="/" className="btn btn-outline btn-md">Visit the website</Link>
              </>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default ErrorPage;
