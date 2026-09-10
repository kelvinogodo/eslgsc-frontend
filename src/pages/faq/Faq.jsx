import { useMemo, useState } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PageHero from '../../components/common/PageHero';
import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const categories = [
  { value: 'general', label: 'General' },
  { value: 'services', label: 'Services & Programmes' },
  { value: 'complaints', label: 'Complaints & Ethics' },
  { value: 'careers', label: 'Careers & Recruitment' }
];

const faqData = {
  general: [
    {
      question: 'What is the mandate of the Ebonyi State Local Government Service Commission?',
      answer: 'ESLGSC oversees recruitment, promotion, discipline, training, and welfare of local government staff. We coordinate policy implementation, monitor service delivery outcomes, and support development centres across the 13 LGAs.'
    },
    {
      question: 'How can I contact the commission for official correspondence?',
      answer: 'You can reach us via ebonyistatelgsc@gmail.com, call +234 (0) 803 555 0100, or visit the ESLGSC Complex, Abakaliki. Our reception desk is open Monday to Friday, 8:00 AM – 5:00 PM.'
    }
  ],
  services: [
    {
      question: 'Do you provide training for local government staff?',
      answer: 'Yes. Through our 12 development centres we offer leadership, digital service, and community engagement programmes. Officers can register via their HR departments or through the intranet portal.'
    },
    {
      question: 'How do communities benefit from ESLGSC programmes?',
      answer: 'We coordinate community outreach, service clinics, and transparency forums that bring citizens together with service desk leads. Data gathered feeds into reforms, resource allocation, and improvement plans.'
    }
  ],
  complaints: [
    {
      question: 'How can I report misconduct or poor service delivery?',
      answer: 'Submit a report through the Complaints & Reports page, email ebonyistatelgsc@gmail.com, or call +234 (0) 803 555 0101. Anonymous tips are welcome and logged in our secure case management system.'
    },
    {
      question: 'What happens after I lodge a complaint?',
      answer: 'You receive a reference ID (if contact details are provided). Cases are triaged within 48 hours, assigned to an investigation officer, and monitored until resolution. Updates are shared through your preferred channel.'
    }
  ],
  careers: [
    {
      question: 'How do I apply for jobs within the local government service?',
      answer: 'Visit the Careers section on our portal or follow official announcements in national dailies. Applications are handled through a secure recruitment platform that supports merit-based selection and interview scheduling.'
    },
    {
      question: 'Does the commission run graduate trainee programmes?',
      answer: 'Yes. The Ebonyi Local Government Talent Pipeline (ELG-TP) opens annually. Shortlisted candidates receive training at our development centres before deployment to LGAs.'
    }
  ]
};

const Faq = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');

  const faqs = useMemo(() => faqData[selectedCategory] || [], [selectedCategory]);

  return (
    <div className="bg-gov-gray-50/30 min-h-screen pb-20">
      {/* Institutional Masthead */}
      <header className="bg-gov-navy-900 text-white pt-20 pb-16 border-b-4 border-gov-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/logo/logo.png')] bg-no-repeat bg-right-top opacity-5 grayscale pointer-events-none translate-x-1/4 -translate-y-1/4 scale-150" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 bg-gov-green-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
              Public Support
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Frequently Asked Questions</h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
              Official clarifications on Commission mandates, local government services, administrative protocols, and public petitions.
            </p>
          </div>
        </div>
      </header>

      {/* Categories & FAQ List */}
      <section className="container-custom py-16">
        <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-start">
          <div className="space-y-10">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 border-b border-gov-gray-200 pb-6">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                    selectedCategory === category.value
                      ? 'bg-gov-navy-900 text-white shadow-md'
                      : 'bg-white text-gov-gray-500 border border-gov-gray-200 hover:border-gov-navy-900 hover:text-gov-navy-900'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {faqs.map((item) => (
                <Disclosure key={item.question}>
                  {({ open }) => (
                    <div className="bg-white border border-gov-gray-200 shadow-sm overflow-hidden transition-all hover:border-gov-gray-300">
                      <Disclosure.Button className="w-full p-6 text-left group">
                        <div className="flex items-center justify-between gap-4">
                          <span className={`font-bold transition-colors ${open ? 'text-gov-navy-900' : 'text-gov-gray-700 group-hover:text-gov-navy-900'}`}>
                            {item.question}
                          </span>
                          <div className={`p-1 rounded-full transition-colors ${open ? 'bg-gov-navy-900 text-white' : 'bg-gov-gray-100 text-gov-gray-400 group-hover:bg-gov-navy-50'}`}>
                            <ChevronDownIcon
                              className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                            />
                          </div>
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
                        <Disclosure.Panel className="px-6 pb-6 pt-0">
                          <div className="h-px bg-gov-gray-100 mb-6" />
                          <p className="text-sm leading-relaxed text-gov-gray-600 max-w-3xl">
                            {item.answer}
                          </p>
                        </Disclosure.Panel>
                      </Transition>
                    </div>
                  )}
                </Disclosure>
              ))}
            </div>
          </div>

          {/* Sidebar / CTA */}
          <aside className="lg:sticky lg:top-8 space-y-8">
            <div className="bg-gov-navy-900 text-white p-8 space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/logo/logo.png')] bg-no-repeat bg-right-bottom opacity-10 grayscale scale-125" />
              <div className="relative z-10 space-y-4">
                <ChatBubbleLeftRightIcon className="w-10 h-10 text-gov-green-500" />
                <h3 className="text-xl font-bold">Still need clarity?</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  For specific administrative enquiries not covered in this directory, citizens may contact our central support desk or visit our Abakaliki headquarters.
                </p>
                <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                  <a href="mailto:ebonyistatelgsc@gmail.com" className="text-sm font-bold text-gov-green-400 hover:underline underline-offset-4">
                    ebonyistatelgsc@gmail.com
                  </a>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Response time: 48–72 working hours
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gov-gray-200 p-8 space-y-6">
              <ShieldCheckIcon className="w-10 h-10 text-gov-navy-900" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-gov-navy-900 border-b border-gov-gray-100 pb-2">
                Policy Library
              </h3>
              <p className="text-xs text-gov-gray-600 leading-relaxed">
                Access official circulars, administrative guidelines, and HR templates from the Commission's digital archive.
              </p>
              <Button as="a" href="#" variant="outline" size="sm" className="w-full rounded-none">
                Access Archive
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Faq;