import { CalendarDaysIcon, UserCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Badge from '../../../ui/Badge';
import { categoryLabel, countWords, readingMinutes } from '../../../../lib/article';
import { EASE } from '../../../portal/motionVariants';

/** Approximation of how the story will look to readers on the public website. */
const ArticlePreview = ({ form, authorName }) => {
  const words = countWords(form.content);
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-ink-900/5 ring-1 ring-ink-100"
    >
      {form.imageUrl ? (
        <img src={form.imageUrl} alt="" className="aspect-[16/8] w-full object-cover" />
      ) : (
        <div className="flex aspect-[16/6] items-center justify-center bg-gradient-to-br from-brand-50 to-gold-50 text-sm font-semibold text-ink-300">
          No cover picture yet
        </div>
      )}
      <div className="px-6 pb-12 pt-8 sm:px-12">
        <Badge variant="green">{categoryLabel(form.category)}</Badge>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl">
          {form.title || <span className="text-ink-300">Your headline will appear here</span>}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-500">
          <span className="inline-flex items-center gap-1.5"><UserCircleIcon className="h-4 w-4" /> {authorName || 'EBSLGSC'}</span>
          <span className="inline-flex items-center gap-1.5"><CalendarDaysIcon className="h-4 w-4" /> {today}</span>
          <span className="inline-flex items-center gap-1.5"><ClockIcon className="h-4 w-4" /> {readingMinutes(words)} min read</span>
        </div>
        {form.summary && <p className="mt-6 border-l-4 border-gold-400 pl-4 text-lg font-medium leading-relaxed text-ink-600">{form.summary}</p>}
        <div className="article-prose mt-6" dangerouslySetInnerHTML={{ __html: form.content || '<p style="color:#93b0a5">The article text will appear here.</p>' }} />
        {form.tags?.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-ink-100 pt-6">
            {form.tags.map((t) => <Badge key={t} variant="gray">#{t}</Badge>)}
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default ArticlePreview;
