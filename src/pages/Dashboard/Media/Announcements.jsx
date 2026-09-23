import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/portal/PageHeader';
import ConfirmDialog from '../../../components/portal/ConfirmDialog';
import AutoTextarea from '../../../components/dashboard/news/editor/AutoTextarea';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { getAnnouncements, createAnnouncement } from '../../../services/announcementService';
import { timeAgo, formatDateTime } from '../../../lib/utils';

const TITLE_MAX = 100;
const BODY_MAX = 600;

const AnnouncementCard = ({ title, content, when }) => (
  <article className="rounded-2xl border-l-4 border-gold-400 bg-white p-5 ring-1 ring-ink-100">
    <h3 className="break-words font-bold text-ink-900">{title || <span className="text-ink-300">Headline</span>}</h3>
    <p className="mt-1 whitespace-pre-line break-words text-[0.93rem] leading-relaxed text-ink-600">
      {content || <span className="text-ink-300">Message</span>}
    </p>
    {when && <p className="mt-2 text-xs font-semibold text-ink-400" title={formatDateTime(when)}>{timeAgo(when)}</p>}
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
        title="Announcements"
        description="Short public notices such as deadlines, events or schedule changes. Use an article for anything longer."
      />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section className="card p-6 sm:p-8" aria-labelledby="compose-heading">
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

          <button type="button" onClick={requestPost} className="btn btn-primary btn-md mt-6 w-full sm:w-auto">Post announcement</button>
          <p className="mt-3 text-xs text-ink-400">Announcements go live on the public website as soon as they’re posted.</p>
        </section>

        <div className="space-y-6">
          <section aria-labelledby="preview-heading">
            <h2 id="preview-heading" className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-500">Preview</h2>
            <AnnouncementCard title={title.trim()} content={content.trim()} />
          </section>

          <section aria-labelledby="recent-heading">
            <h2 id="recent-heading" className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-500">Recently posted</h2>
            {isLoading ? (
              <div className="space-y-3"><Skeleton className="h-24 rounded-2xl" /><Skeleton className="h-24 rounded-2xl" /></div>
            ) : list.length === 0 ? (
              <EmptyState title="No announcements yet" />
            ) : (
              <ul className="space-y-3">
                {list.slice(0, 8).map((a) => (
                  <li key={a.id}><AnnouncementCard title={a.title} content={a.content} when={a.createdAt} /></li>
                ))}
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
        message="It will be visible on the public website straight away."
        confirmLabel="Post"
      />
    </div>
  );
};

export default Announcements;
