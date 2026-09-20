import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NewspaperIcon, IdentificationIcon, ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';
import { Stagger, Item } from './motion';
import { EASE } from './motionVariants';
import usePortalTheme from '../../hooks/usePortalTheme';
import usePageTitle from '../../hooks/usePageTitle';

const highlights = [
  { icon: NewspaperIcon, title: 'Publish with confidence', text: 'Write news and announcements, with review before anything goes live.' },
  { icon: IdentificationIcon, title: 'Staff records at a glance', text: 'Search and view enrolled staff across the local governments.' },
  { icon: ShieldCheckIcon, title: 'Every action is on record', text: 'A clear history of who did what keeps the portal accountable.' }
];

/**
 * Split-screen frame shared by sign in, forgot/reset password and account
 * activation. Brand story on the left (hidden on phones), the task on the right.
 */
const AuthShell = ({ title, subtitle, children, footer, pageTitle }) => {
  usePortalTheme();
  usePageTitle(pageTitle || title);

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950 text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div className="bg-dots absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="bg-grid-soft absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_60%_at_30%_30%,black,transparent)]" aria-hidden="true" />
        <div className="absolute -left-24 top-1/3 h-96 w-96 animate-float-slow rounded-full bg-brand-500/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-16 bottom-10 h-80 w-80 animate-float-slower rounded-full bg-gold-400/25 blur-3xl" aria-hidden="true" />

        {/* Decorative seal rings */}
        <svg className="absolute -right-40 -top-40 h-[34rem] w-[34rem] opacity-[0.16]" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <circle cx="100" cy="100" r="92" stroke="#f6d77a" strokeWidth="3" />
          <circle cx="100" cy="100" r="74" stroke="#f6d77a" strokeWidth="1.2" strokeDasharray="3 6" />
          <circle cx="100" cy="100" r="56" stroke="#fff" strokeWidth="1" />
        </svg>

        <div className="relative">
          <Logo to="/" tone="light" size="lg" subtitle="Ebonyi State · Staff Portal" />
        </div>

        <Stagger className="relative max-w-xl" stagger={0.1} delay={0.15}>
          <Item as="p" className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-gold-200 ring-1 ring-white/15">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-300" /> Salt of the Nation
          </Item>
          <Item as="h2" className="text-4xl font-extrabold leading-[1.1] tracking-tight xl:text-5xl">
            Ebonyi State Local Government Service Commission
          </Item>
          <Item as="p" className="mt-5 max-w-lg text-lg leading-relaxed text-brand-100/85">
            One secure place for the Commission’s team to run news, staff records and approvals.
          </Item>

          <ul className="mt-10 space-y-5">
            {highlights.map(({ icon: Icon, title: t, text }) => (
              <Item as="li" key={t} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-gold-200 ring-1 ring-white/15">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-bold">{t}</span>
                  <span className="block text-sm leading-relaxed text-brand-100/75">{text}</span>
                </span>
              </Item>
            ))}
          </ul>
        </Stagger>

        <p className="relative text-xs text-brand-100/60">© {new Date().getFullYear()} Ebonyi State Local Government Service Commission</p>
      </aside>

      {/* Task panel */}
      <main id="main" className="relative flex flex-col justify-center px-5 py-10 sm:px-10">
        <div className="mx-auto mb-8 w-full max-w-md lg:hidden">
          <Logo to="/" />
        </div>

        <motion.div
          className="mx-auto w-full max-w-md"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="rounded-3xl bg-white p-7 shadow-2xl shadow-brand-900/10 ring-1 ring-brand-900/5 sm:p-10">
            <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink-900">{title}</h1>
            {subtitle && <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-500">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </div>
          {footer && <div className="mt-6 text-center text-sm text-ink-500">{footer}</div>}
          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-400 hover:text-brand-700">
              <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" /> Back to the public website
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AuthShell;
