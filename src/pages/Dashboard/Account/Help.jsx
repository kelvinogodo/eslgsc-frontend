import { useMemo, useState } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { QuestionMarkCircleIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import useAuth from '../../../context/useAuth';
import PageHeader from '../../../components/portal/PageHeader';
import EmptyState from '../../../components/ui/EmptyState';

const EDITORS = ['SUPER_ADMIN', 'ADMIN', 'MEDIA_ADMIN'];
const REVIEWERS = ['SUPER_ADMIN', 'ADMIN', 'AUDIT'];
const ALL = ['SUPER_ADMIN', 'ADMIN', 'MEDIA_ADMIN', 'AUDIT', 'LGA'];

// Plain-language answers to the questions new operators actually ask.
const GUIDES = [
  {
    section: 'Getting started',
    roles: ALL,
    items: [
      { q: 'How do I get around the portal?', a: 'Use the menu on the left (or the ☰ button on a phone). “Home” always brings you back to your overview. The top bar shows where you are, and your name at the top right gives you your profile and the Sign out button.' },
      { q: 'I forgot my password. What do I do?', a: 'On the sign-in page choose “Forgot your password?”, type your email and we’ll email you a link to choose a new one. If no email arrives, check your spam folder or ask your administrator to send you a new link.' },
      { q: 'How do I change my password or my name?', a: 'Open “My Profile” from the menu. Click the pencil next to your name to change it, or use the “Change your password” box below.' },
      { q: 'Why was I signed out?', a: 'For your safety the portal signs you out if your sign-in has expired. Just sign in again — you’ll be taken back to where you were.' }
    ]
  },
  {
    section: 'Writing articles',
    roles: EDITORS,
    items: [
      { q: 'How do I write and save an article?', a: 'Choose “Write an Article”. Type a headline, a short summary and the story. Your work saves itself a couple of seconds after you stop typing — look for “All changes saved” at the top. You can also press Ctrl + S at any time.' },
      { q: 'What if my internet drops while I’m writing?', a: 'Keep writing. A copy is kept on your computer. When you come back to the editor, it will offer to restore anything that hadn’t been saved.' },
      { q: 'How do I add a picture?', a: 'For the cover picture, use the “Cover picture” box on the right — drag a picture onto it or click it. To put a picture inside the story, click the picture button in the toolbar, or simply paste or drag a picture into the text.' },
      { q: 'What does “Send for review” do?', a: 'It sends your article to a reviewer. They’ll read it and either publish it or send it back with feedback. While it’s being reviewed you can’t edit it. Anything they ask you to change appears in a red note when you open the article again.', roles: ['MEDIA_ADMIN'] },
      { q: 'What does “Publish” do?', a: 'Because of your role, publishing puts the article on the website straight away — no review step. Double-check the preview first (use the “Preview” button).', roles: ['SUPER_ADMIN', 'ADMIN'] },
      { q: 'What’s the difference between an article and an announcement?', a: 'Articles are full stories with pictures and formatting. Announcements are short notices (a headline and a few lines) that appear as soon as you post them.' }
    ]
  },
  {
    section: 'Reviewing and approvals',
    roles: REVIEWERS,
    items: [
      { q: 'Where do I see what needs reviewing?', a: 'Open “Approvals”. A gold number next to it in the menu shows how many items are waiting.' },
      { q: 'How do I approve or send something back?', a: 'Open the item, read it, then choose Approve or Reject. If you reject, please add a short note explaining what to fix — the writer will see it.', roles: ['SUPER_ADMIN', 'ADMIN'] },
      { q: 'Can I approve items?', a: 'Auditors can look at everything but cannot approve or reject. That keeps the review independent. Ask an Administrator to act on anything you flag.', roles: ['AUDIT'] },
      { q: 'What is “Activity History”?', a: 'A record of who did what and when in the portal — like publishing an article or inviting a user. It can’t be edited.' },
      { q: 'What is the “Enrollment Records Log”?', a: 'The history from the separate staff enrollment system (sign-ins, enrolments, verifications). It’s read-only here.' }
    ]
  },
  {
    section: 'Staff records',
    roles: ['SUPER_ADMIN', 'ADMIN', 'LGA'],
    items: [
      { q: 'How do I find a staff member?', a: 'Open “Staff Records” and type a name or file number in the search box. You can also narrow the list by department. Click a name to see the full record.' },
      { q: 'Can I change a staff record?', a: 'No — records are view-only here. They are maintained in the staff enrollment system.' },
      { q: 'Why don’t I see everyone?', a: 'Local government officials only see staff posted to their own local government. If someone seems to be missing, tell an administrator.', roles: ['LGA'] }
    ]
  },
  {
    section: 'Managing people',
    roles: ['SUPER_ADMIN'],
    items: [
      { q: 'How do I give someone access?', a: 'Open “Invite Someone”, enter their email and choose their role. They’ll get an email with a link to set up their account and choose a password. The link works for 24 hours.' },
      { q: 'How do I stop someone signing in?', a: 'Open “Portal Users”, find them and switch their status to disabled. You can turn it back on any time.' }
    ]
  }
];

const Question = ({ q, a }) => (
  <Disclosure>
    {({ open }) => (
      <div className={`overflow-hidden rounded-2xl bg-white ring-1 transition-shadow ${open ? 'shadow-md ring-brand-200' : 'shadow-sm ring-ink-100 hover:ring-ink-200'}`}>
        <Disclosure.Button className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
          <span className="text-[0.97rem] font-bold text-ink-900">{q}</span>
          <ChevronDownIcon className={`h-5 w-5 shrink-0 text-ink-400 transition-transform duration-300 ${open ? 'rotate-180 text-brand-600' : ''}`} aria-hidden="true" />
        </Disclosure.Button>
        <Transition
          enter="transition-all duration-200 ease-out"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition-all duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Disclosure.Panel className="px-5 pb-5 text-[0.95rem] leading-relaxed text-ink-600">{a}</Disclosure.Panel>
        </Transition>
      </div>
    )}
  </Disclosure>
);

const Help = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const sections = useMemo(() => {
    const q = search.trim().toLowerCase();
    return GUIDES
      .filter((g) => g.roles.includes(user?.role))
      .map((g) => ({
        ...g,
        items: g.items
          .filter((i) => !i.roles || i.roles.includes(user?.role))
          .filter((i) => !q || `${i.q} ${i.a}`.toLowerCase().includes(q))
      }))
      .filter((g) => g.items.length > 0);
  }, [user?.role, search]);

  return (
    <div>
      <PageHeader icon={QuestionMarkCircleIcon} title="Help & Guides" description="Quick answers in plain language. Can’t find what you need? Ask your administrator." />

      <div className="relative mb-8 max-w-xl">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-300" aria-hidden="true" />
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for a question, e.g. “picture” or “password”" aria-label="Search help" className="input !min-h-12 pl-12" />
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {sections.length === 0 ? (
          <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState icon={QuestionMarkCircleIcon} title="No answers found" description="Try a different word, or ask your administrator for help." action={<button type="button" className="btn btn-outline btn-md" onClick={() => setSearch('')}>Clear search</button>} />
          </motion.div>
        ) : (
          <div className="grid gap-x-8 gap-y-10 lg:grid-cols-2">
            {sections.map((g) => (
              <motion.section key={g.section} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-labelledby={`h-${g.section}`}>
                <h2 id={`h-${g.section}`} className="mb-3 text-sm font-extrabold uppercase tracking-[0.12em] text-brand-700">{g.section}</h2>
                <div className="space-y-3">{g.items.map((i) => <Question key={i.q} q={i.q} a={i.a} />)}</div>
              </motion.section>
            ))}
          </div>
        )}
      </AnimatePresence>

      <p className="mt-12 text-center text-sm text-ink-400">
        Still stuck? Your administrator can help — or visit the <Link to="/contact" className="font-bold text-brand-700">contact page</Link>.
      </p>
    </div>
  );
};

export default Help;
