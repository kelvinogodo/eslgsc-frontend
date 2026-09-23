/** One article in a list: cover thumbnail, a meta line, title, summary, and action buttons. */
const ArticleRow = ({ article, meta, summary, footer, children }) => (
  <li className="flex flex-col gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink-100 sm:flex-row sm:items-center">
    <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-ink-50 sm:h-20 sm:w-32">
      {article.imageUrl && <img src={article.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />}
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-ink-400">{meta}</div>
      <h2 className="mt-1 truncate text-lg font-bold text-ink-900">{article.title || 'Untitled article'}</h2>
      <p className="line-clamp-1 text-sm text-ink-500">{summary ?? (article.summary || 'No summary')}</p>
      {footer}
    </div>
    <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>
  </li>
);

export default ArticleRow;
