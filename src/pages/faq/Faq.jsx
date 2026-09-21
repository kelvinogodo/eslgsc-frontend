import { Link } from 'react-router-dom';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { SITE } from '../../lib/siteInfo';

// Only describes what this website actually does. Nothing here promises response times,
// programmes or figures that the Commission has not published.
const faqs = [
  {
    question: 'What is this website?',
    answer: `This is the official website of the ${SITE.name}. It publishes the Commission’s news and announcements, a directory of local government headquarters and development centres, and a desk for public complaints.`
  },
  {
    question: 'Where do I find official news and announcements?',
    answer: 'In the Newsroom and on the Announcements page. Everything published there is posted by the Commission’s authorised staff after it has been reviewed.'
  },
  {
    question: 'How do I submit a complaint or petition?',
    answer: 'Open the Complaints page, choose a category, and describe your concern. When it is sent you are shown a reference ID: please keep it.'
  },
  {
    question: 'Can I make a complaint without giving my name?',
    answer: 'Yes. Your name, phone number and email are optional. If you leave out all contact details, the Commission will have no way to reply to you.'
  },
  {
    question: 'Where are the local government offices and development centres?',
    answer: 'The Local Governments page lists the local government headquarters, and the Development Centres page lists every development centre with its location. Both come from the Commission’s staff records.'
  },
  {
    question: 'How can I contact the Commission?',
    answer: `${SITE.email ? `By email at ${SITE.email}. ` : ''}${SITE.address ? `The office is at the ${SITE.address}. ` : ''}You can also use the Contact page.`.trim()
  },
  {
    question: 'What is “Staff sign in” for?',
    answer: 'It is for authorised Commission staff only. Members of the public do not need an account to read the news, use the directory or submit a complaint.'
  }
];

const Faq = () => (
  <div className="bg-gov-gray-50/30 min-h-screen pb-20">
    <header className="page-banner bg-gov-navy-900 text-white pt-10 pb-8 md:pt-12 md:pb-10 border-b-4 border-gov-cyan-500 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="max-w-3xl space-y-4">
          <span className="inline-block px-3 py-1 bg-gov-cyan-500 text-gov-navy-900 text-[10px] font-bold uppercase tracking-widest rounded-sm">
            Public Support
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl">Quick answers about using this website.</p>
        </div>
      </div>
    </header>

    <section className="container-custom py-12">
      <div className="grid lg:grid-cols-[1fr_340px] gap-12 items-start">
        <div className="space-y-4">
          {faqs.map((item) => (
            <Disclosure key={item.question}>
              {({ open }) => (
                <div className="bg-white border border-gov-gray-200 rounded-xl shadow-sm overflow-hidden transition-all hover:border-gold-400">
                  <Disclosure.Button className="w-full p-5 text-left group">
                    <div className="flex items-center justify-between gap-4">
                      <span className={`font-bold transition-colors ${open ? 'text-brand-800' : 'text-gov-gray-700 group-hover:text-brand-800'}`}>{item.question}</span>
                      <span className={`p-1 rounded-full transition-colors ${open ? 'bg-brand-600 text-white' : 'bg-gov-gray-100 text-gov-gray-400'}`}>
                        <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                      </span>
                    </div>
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="transform -translate-y-2 opacity-0"
                    enterTo="transform translate-y-0 opacity-100"
                    leave="transition duration-150 ease-in"
                    leaveFrom="transform translate-y-0 opacity-100"
                    leaveTo="transform -translate-y-1 opacity-0"
                  >
                    <Disclosure.Panel className="px-5 pb-5">
                      <div className="h-px bg-gov-gray-100 mb-4" />
                      <p className="text-sm leading-relaxed text-gov-gray-600 max-w-3xl">{item.answer}</p>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 space-y-6">
          <div className="rounded-2xl bg-gov-navy-900 p-7 text-white space-y-4">
            <ChatBubbleLeftRightIcon className="w-9 h-9 text-gov-cyan-400" aria-hidden="true" />
            <h2 className="text-lg font-bold">Still have a question?</h2>
            {SITE.email && (
              <a href={`mailto:${SITE.email}`} className="block text-sm font-bold text-gov-cyan-300 hover:underline underline-offset-4 break-all">{SITE.email}</a>
            )}
            <Link to="/complaints" className="btn btn-primary btn-md w-full">Submit a complaint</Link>
          </div>
        </aside>
      </div>
    </section>
  </div>
);

export default Faq;
