import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { MegaphoneIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../../components/portal/PageHeader';
import ConfirmDialog from '../../../components/portal/ConfirmDialog';
import AutoTextarea from '../../../components/dashboard/news/editor/AutoTextarea';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { getAnnouncements, createAnnouncement } from '../../../services/announcementService';
import { timeAgo, formatDateTime } from '../../../lib/utils';
import { EASE } from '../../../components/portal/motionVariants';

const TITLE_MAX = 100;
const BODY_MAX = 600;

const AnnouncementCard = ({ title, content, when, preview }) => (
  <article className={`relative overflow-hidden rounded-2xl bg-white p-5 ring-1 ${preview ? 'ring-brand-200 shadow-lg shadow-brand-900/5' : 'ring-ink-100 shadow-sm'}`}>
    <span className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-gold-300 to-gold-500" aria-hidden="true" />
    <div className="flex items-start gap-3 pl-2">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-600">
        <MegaphoneIcon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h3 className="break-words font-extrabold text-ink-900">{title || <span className="text-ink-300">Your headline appears here</span>}</h3>
        <p className="mt-1 whitespace-pre-line break-words text-[0.93rem] leading-relaxed text-ink-600">
          {content || <span className="text-ink-300">Your message appears here</span>}
        </p>
        {when && <p className="mt-2 text-xs font-semibold text-ink-400" title={formatDateTime(when)}>{timeAgo(when)}</p>}
      </div>
    </div>
  </article>
);

const Announcements = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);

  const { data: list = [], isLoading } = useQuery({ queryKey: ['announcements'], queryFn: getAnnouncements });

  const post = useMutation({
    mutationFn: () => createAnnouncement({ title: title.trim(), content: content.trim() }),
    onSuccess: () => {
      toast.success('Announcement posted');
      setTitle('');
      setContent('');
      setTriedSubmit(false);
      setConfirmOpen(false);
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['activityLog'] });
    },
    onError: (err) => {
      setConfirmOpen(false);
      toast.error(err?.response?.data?.message || 'We couldn’t post that. Please try again.');
    }
  });

  const titleOk = title.trim().length >= 5;
  const bodyOk = content.trim().length >= 10;

  const requestPost = () => {
    setTriedSubmit(true);
    if (titleOk && bodyOk) setConfirmOpen(true);
  };

  return (
    <div>
      <PageHeader
        icon={MegaphoneIcon}
        title="Announcements"
        description="Short notices for the public — a deadline, an event, a change of schedule. For longer stories, write an article instead."
      />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        {/* Composer */}
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-100 sm:p-8" aria-labelledby="compose-heading">
          <h2 id="compose-heading" className="text-lg font-extrabold text-ink-900">Write an announcement</h2>

          <div className="mt-5">
            <label htmlFor="ann-title" className="mb-1.5 block text-sm font-bold text-ink-700">Headline</label>
            <div className={`rounded-xl border px-3.5 py-2.5 transition focus-within:border-brand-500 focus-within:shadow-[0_0_0_4px_rgb(31_163_90/0.16)] ${triedSubmit && !titleOk ? 'border-red-400' : 'border-ink-200'}`}>
              <AutoTextarea
                id="ann-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                max={TITLE_MAX}
                warnAt={80}
                placeholder="e.g. Recruitment portal opens on Monday"
                className="text-[1.05rem] font-bold text-ink-900"
              />
            </div>
            {triedSubmit && !titleOk && <p className="mt-1.5 text-sm font-semibold text-red-600" role="alert">Please write a headline (at least 5 characters).</p>}
          </div>

          <div className="mt-5">
            <label htmlFor="ann-body" className="mb-1.5 block text-sm font-bold text-ink-700">Message</label>
            <div className={`rounded-xl border px-3.5 py-2.5 transition focus-within:border-brand-500 focus-within:shadow-[0_0_0_4px_rgb(31_163_90/0.16)] ${triedSubmit && !bodyOk ? 'border-red-400' : 'border-ink-200'}`}>
              <AutoTextarea
                id="ann-body"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                max={BODY_MAX}
                warnAt={500}
                placeholder="What do people need to know?"
                className="min-h-[7rem] text-[0.97rem] leading-relaxed text-ink-700"
              />
            </div>
            {triedSubmit && !bodyOk && <p className="mt-1.5 text-sm font-semibold text-red-600" role="alert">Please add a short message (at least 10 characters).</p>}
          </div>

          <button type="button" onClick={requestPost} className="btn btn-primary btn-lg mt-6 w-full sm:w-auto">
            <PaperAirplaneIcon className="mr-2 h-5 w-5" aria-hidden="true" /> Post announcement
          </button>
          <p className="mt-3 text-xs text-ink-400">Announcements appear on the public website as soon as you post them.</p>
        </section>

        {/* Live preview + history */}
        <div className="space-y-6">
          <section aria-labelledby="preview-heading">
            <h2 id="preview-heading" className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-ink-500">
              <SparklesIcon className="h-4 w-4 text-gold-500" aria-hidden="true" /> How it will look
            </h2>
            <AnnouncementCard title={title.trim()} content={content.trim()} preview />
          </section>

          <section aria-labelledby="recent-heading">
            <h2 id="recent-heading" className="mb-3 text-sm font-extrabold uppercase tracking-wide text-ink-500">Recently posted</h2>
            {isLoading ? (
              <div className="space-y-3"><Skeleton className="h-24 rounded-2xl" /><Skeleton className="h-24 rounded-2xl" /></div>
            ) : list.length === 0 ? (
              <EmptyState icon={MegaphoneIcon} title="Nothing posted yet" description="Your first announcement will show up here once it’s posted." />
            ) : (
              <ul className="space-y-3">
                <AnimatePresence initial={false}>
                  {list.slice(0, 8).map((a) => (
                    <motion.li key={a.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                      <AnnouncementCard title={a.title} content={a.content} when={a.createdAt} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </section>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => post.mutate()}
        loading={post.isPending}
        title="Post this announcement?"
        message="It will be visible to the public straight away."
        confirmLabel="Yes, post it"
      />
    </div>
  );
};

export default Announcements;
