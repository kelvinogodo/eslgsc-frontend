import { Link } from 'react-router-dom';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { SITE } from '../../lib/siteInfo';

// Contact details come from lib/siteInfo.js, the one place they are kept. Anything not
// confirmed (left null there) is not shown, and there is no enquiry form: a form that does not
// reach anyone is worse than none. Complaints have their own working form.
const Contact = () => {
  const details = [
    SITE.address && { icon: MapPinIcon, title: 'Office address', content: SITE.address },
    SITE.email && { icon: EnvelopeIcon, title: 'Email', content: SITE.email, href: `mailto:${SITE.email}` },
    SITE.phone && { icon: PhoneIcon, title: 'Phone', content: SITE.phone, href: `tel:${SITE.phone.replace(/[^\d+]/g, '')}` },
    SITE.officeHours && { icon: ClockIcon, title: 'Office hours', content: SITE.officeHours }
  ].filter(Boolean);

  return (
    <div className="bg-gov-gray-50/30 min-h-screen pb-20">
      <header className="page-banner bg-gov-navy-900 text-white pt-10 pb-8 md:pt-12 md:pb-10 border-b-4 border-gov-cyan-500 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 bg-gov-cyan-500 text-gov-navy-900 text-[10px] font-bold uppercase tracking-widest rounded-sm">
              Contact
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Contact the Commission</h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl">How to reach the {SITE.name}.</p>
          </div>
        </div>
      </header>

      <section className="container-custom py-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] items-start">
          <div className="grid gap-4 sm:grid-cols-2">
            {details.map(({ icon: Icon, title, content, href }) => (
              <div key={title} className="rounded-xl border border-gov-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:shadow-md">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gov-gray-500">{title}</h2>
                {href ? (
                  <a href={href} className="mt-1 block break-words font-semibold text-gov-navy-900 hover:underline underline-offset-4">{content}</a>
                ) : (
                  <p className="mt-1 font-semibold text-gov-navy-900 leading-relaxed">{content}</p>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-gov-navy-900 p-8 text-white space-y-4">
            <ChatBubbleLeftRightIcon className="h-10 w-10 text-gov-cyan-400" aria-hidden="true" />
            <h2 className="text-xl font-bold">Have a complaint?</h2>
            <p className="text-sm leading-relaxed text-white/75">
              Report a concern through the complaints desk. You are given a reference ID when it is sent, and your name and contact details are optional.
            </p>
            <Link to="/complaints" className="btn btn-primary btn-md w-full">Open the complaints desk</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
