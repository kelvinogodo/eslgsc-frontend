import { sanitizeHtml } from '../../../lib/sanitize';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircleIcon, ArrowUturnLeftIcon, EyeIcon } from '@heroicons/react/24/outline';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Skeleton from '../../ui/Skeleton';
import Badge from '../../ui/Badge';
import Avatar from '../../portal/Avatar';
import { getNewsById } from '../../../services/newsService';
import { categoryLabel } from '../../../lib/article';
import { formatDateTime, timeAgo } from '../../../lib/utils';

/**
 * Review dialog for anything waiting for approval. Deciders can approve (which
 * publishes) or send it back — and sending back requires a reason, because the
 * writer can only fix what they can read. Read-only roles just see the details.
 */
const AuditDetailModal = ({ item, isOpen, onClose, onApprove, onReject, isApproving, isRejecting, canDecide = true }) => {
  const [notes, setNotes] = useState('');
  const [needNote, setNeedNote] = useState(false);

  useEffect(() => {
    if (!isOpen) { setNotes(''); setNeedNote(false); }
  }, [isOpen]);

  const isNews = item?.entityType === 'news';
  const embedded = item?.payload?.article;
  const { data: fetched, isLoading: loadingArticle } = useQuery({
    queryKey: ['news', 'review', item?.entityId || item?.id],
    queryFn: () => getNewsById(item.entityId || item.id),
    enabled: Boolean(isOpen && isNews && !embedded && canDecide),
    retry: 0
  });
  const article = embedded || fetched;
  const busy = isApproving || isRejecting;

  if (!item) return null;

  const sendBack = () => {
    if (!notes.trim()) { setNeedNote(true); return; }
    onReject?.(notes.trim());
  };

  return (
    <Modal isOpen={isOpen} onClose={busy ? () => {} : onClose} size="xl" title={canDecide ? 'Review this submission' : 'Submission details'}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-400">{isNews ? 'News article' : item.entityType === 'announcement' ? 'Announcement' : 'Submission'}</p>
            <h2 className="text-xl font-extrabold text-ink-900">{item.entityName || article?.title || 'Untitled'}</h2>
          </div>
          <Badge variant="yellow">Waiting for review</Badge>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-ink-50/70 p-4">
          <Avatar name={item.submittedByName} />
          <div className="text-sm">
            <p className="font-bold text-ink-900">{item.submittedByName || 'Someone'} <span className="font-medium text-ink-500">sent this for review</span></p>
            <p className="text-ink-400" title={formatDateTime(item.submittedAt)}>{timeAgo(item.submittedAt)}</p>
          </div>
        </div>

        {isNews && canDecide && (
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-400"><EyeIcon className="h-4 w-4" aria-hidden="true" /> What readers would see</p>
            {loadingArticle ? (
              <Skeleton rows={6} />
            ) : article ? (
              <article className="max-h-[26rem] overflow-y-auto rounded-2xl border border-ink-100 bg-white">
                {article.imageUrl && <img src={article.imageUrl} alt="" className="aspect-[16/7] w-full object-cover" />}
                <div className="p-5 sm:p-6">
                  {article.category && <Badge variant="green">{categoryLabel(article.category)}</Badge>}
                  <h3 className="mt-2 text-2xl font-extrabold leading-tight text-ink-900">{article.title}</h3>
                  {article.summary && <p className="mt-3 border-l-4 border-gold-400 pl-3 font-medium text-ink-600">{article.summary}</p>}
                  <div className="article-prose mt-4" dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content || '') }} />
                </div>
              </article>
            ) : (
              <p className="rounded-xl bg-gold-50 p-4 text-sm text-ink-600 ring-1 ring-gold-200">We couldn’t load a preview of this article.</p>
            )}
          </div>
        )}

        {canDecide ? (
          <>
            <div>
              <label htmlFor="decision-notes" className="mb-1.5 block text-sm font-bold text-ink-700">
                Your feedback <span className="font-medium text-ink-400">(needed if you send it back)</span>
              </label>
              <textarea
                id="decision-notes"
                rows={3}
                value={notes}
                onChange={(e) => { setNotes(e.target.value); setNeedNote(false); }}
                placeholder="e.g. Please add the date of the event and check the spelling of the names."
                className={`textarea ${needNote ? 'border-red-400' : ''}`}
              />
              {needNote && <p className="mt-1.5 text-sm font-semibold text-red-600" role="alert">Please tell the writer what to change — they can only fix what they can read.</p>}
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={onClose} disabled={busy}>Close</Button>
              <Button variant="outline" onClick={sendBack} disabled={busy}>
                <ArrowUturnLeftIcon className="mr-2 h-5 w-5" aria-hidden="true" /> {isRejecting ? 'Sending back…' : 'Send back with feedback'}
              </Button>
              <Button onClick={() => onApprove?.(notes.trim() || undefined)} disabled={busy}>
                <CheckCircleIcon className="mr-2 h-5 w-5" aria-hidden="true" /> {isApproving ? 'Approving…' : isNews ? 'Approve & publish' : 'Approve'}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-ink-50/70 p-4">
            <p className="text-sm text-ink-500">Auditors can look at submissions but can’t approve or send them back. An Administrator will decide.</p>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AuditDetailModal;
