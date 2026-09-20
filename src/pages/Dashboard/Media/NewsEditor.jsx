import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import LinkExt from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  ArrowLeftIcon,
  EyeIcon,
  PencilSquareIcon,
  PaperAirplaneIcon,
  LockClosedIcon,
  ArrowUturnLeftIcon,
  CheckIcon,
  BookmarkSquareIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import useAuth from '../../../context/useAuth';
import useArticleEditor from '../../../hooks/useArticleEditor';
import EditorToolbar from '../../../components/dashboard/news/editor/EditorToolbar';
import AutoTextarea from '../../../components/dashboard/news/editor/AutoTextarea';
import SaveIndicator from '../../../components/dashboard/news/editor/SaveIndicator';
import TagInput from '../../../components/dashboard/news/editor/TagInput';
import CoverImage from '../../../components/dashboard/news/editor/CoverImage';
import Readiness from '../../../components/dashboard/news/editor/Readiness';
import ArticlePreview from '../../../components/dashboard/news/editor/ArticlePreview';
import SubmitDialog from '../../../components/dashboard/news/editor/SubmitDialog';
import NewsStatusBadge from '../../../components/dashboard/news/NewsStatusBadge';
import SegmentedControl from '../../../components/portal/SegmentedControl';
import Skeleton from '../../../components/ui/Skeleton';
import { uploadImage } from '../../../lib/cloudinary';
import { CATEGORIES, buildChecklist, countWords, readingMinutes } from '../../../lib/article';
import { timeAgo } from '../../../lib/utils';
import { EASE } from '../../../components/portal/motionVariants';

const Section = ({ title, hint, children }) => (
  <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink-100">
    <h2 className="text-[0.95rem] font-extrabold text-ink-900">{title}</h2>
    {hint && <p className="mb-3 mt-0.5 text-xs text-ink-400">{hint}</p>}
    {!hint && <div className="mb-3" />}
    {children}
  </section>
);

const Banner = ({ tone = 'gold', icon: Icon, children, actions }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
    className={clsx(
      'mb-5 flex flex-wrap items-center gap-3 rounded-2xl p-4 ring-1',
      tone === 'red' ? 'bg-red-50 ring-red-100' : tone === 'green' ? 'bg-brand-50 ring-brand-100' : 'bg-gold-50 ring-gold-200'
    )}
  >
    <Icon className={clsx('h-6 w-6 shrink-0', tone === 'red' ? 'text-red-500' : tone === 'green' ? 'text-brand-600' : 'text-gold-600')} aria-hidden="true" />
    <div className="min-w-0 flex-1 text-sm text-ink-700">{children}</div>
    {actions && <div className="flex gap-2">{actions}</div>}
  </motion.div>
);

const NewsEditor = () => {
  const { newsId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const ed = useArticleEditor({ newsId, user });
  const { form, setField, locked } = ed;

  const [view, setView] = useState('edit');
  const [uploadingImg, setUploadingImg] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [offline, setOffline] = useState(typeof navigator !== 'undefined' && navigator.onLine === false);
  const fileInput = useRef(null);
  const editorRef = useRef(null);
  const insertImageRef = useRef(null);

  const publishes = ['SUPER_ADMIN', 'ADMIN'].includes(user?.role);

  // ---- rich text editor ----
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      LinkExt.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' } }),
      Image.configure({ allowBase64: false }),
      Placeholder.configure({ placeholder: 'Start writing here… You can also paste or drag pictures straight into the page.' })
    ],
    content: '',
    onUpdate: ({ editor: e }) => setField({ content: e.isEmpty ? '' : e.getHTML() }),
    editorProps: {
      attributes: { 'aria-label': 'Article text', class: 'focus:outline-none' },
      handlePaste: (_view, event) => {
        const file = Array.from(event.clipboardData?.files || []).find((f) => f.type.startsWith('image/'));
        if (!file) return false;
        event.preventDefault();
        insertImageRef.current?.(file);
        return true;
      },
      handleDrop: (view, event) => {
        const file = Array.from(event.dataTransfer?.files || []).find((f) => f.type.startsWith('image/'));
        if (!file) return false;
        event.preventDefault();
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        insertImageRef.current?.(file, pos);
        return true;
      }
    }
  });
  editorRef.current = editor;

  const insertImage = useCallback(async (file, pos) => {
    setUploadingImg(true);
    const id = toast.loading('Uploading picture…');
    try {
      const url = await uploadImage(file);
      const chain = editorRef.current?.chain().focus();
      if (pos != null) chain?.insertContentAt(pos, { type: 'image', attrs: { src: url, alt: '' } }).run();
      else chain?.setImage({ src: url, alt: '' }).run();
      toast.update(id, { render: 'Picture added', type: 'success', isLoading: false, autoClose: 1800 });
    } catch (err) {
      toast.update(id, { render: err.message, type: 'error', isLoading: false, autoClose: 4000 });
    } finally {
      setUploadingImg(false);
    }
  }, []);
  insertImageRef.current = insertImage;

  // Load content into the editor when an article opens / a backup is restored.
  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(ed.formRef.current.content || '', false);
  }, [ed.contentVersion, editor]); // eslint-disable-line react-hooks/exhaustive-deps

  // `false` = don't emit an "update" event: setEditable() reports a phantom edit by default,
  // which used to mark a freshly opened article as changed and write an empty backup.
  useEffect(() => { editor?.setEditable(!locked, false); }, [locked, editor]);

  // ---- safety nets ----
  useEffect(() => {
    const warn = (e) => { if (ed.isDirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [ed.isDirty]);

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const saveNow = useCallback(async () => {
    if (locked) return;
    const saved = await ed.save({ silent: false });
    if (saved) toast.success('Draft saved');
  }, [ed, locked]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveNow();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [saveNow]);

  const goBack = async () => {
    if (ed.isDirty && form.title.trim() && !locked) await ed.ensureSaved();
    navigate('/dashboard/drafts');
  };

  const confirmSubmit = async () => {
    setSubmitting(true);
    const ok = await ed.submit();
    setSubmitting(false);
    if (ok) {
      setConfirmOpen(false);
      toast.success(publishes ? 'Your article is now live on the website' : 'Sent for review — you’ll see the result under My Articles');
      navigate('/dashboard/drafts');
    }
  };

  const words = countWords(form.content);
  const checklist = buildChecklist(form);

  if (ed.isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-14 rounded-2xl" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <Skeleton className="h-[34rem] rounded-3xl" />
          <Skeleton className="h-[34rem] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (ed.loadFailed) {
    return (
      <div className="mx-auto max-w-md card p-8 text-center">
        <h1 className="text-xl font-extrabold text-ink-900">We couldn’t open that article</h1>
        <p className="mt-2 text-sm text-ink-500">It may have been removed, or it may belong to someone else.</p>
        <Link to="/dashboard/drafts" className="btn btn-primary btn-md mt-6">Back to my articles</Link>
      </div>
    );
  }

  return (
    <div>
      {/* ---------- Sticky action bar ---------- */}
      <div className="sticky top-16 z-20 -mx-4 -mt-8 mb-6 border-b border-ink-100 bg-white/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <button type="button" onClick={goBack} className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-bold text-ink-600 hover:bg-ink-50 hover:text-ink-900">
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">My articles</span>
          </button>
          <NewsStatusBadge status={ed.articleId ? ed.meta.status : 'draft'} />
          <SaveIndicator
            state={ed.saveState}
            lastSavedAt={ed.lastSavedAt}
            hasTitle={Boolean(form.title.trim())}
            offline={offline}
            locked={locked}
            onRetry={() => ed.save({ silent: false })}
          />

          <div className="ml-auto flex flex-wrap items-center gap-2 sm:gap-3">
            <SegmentedControl
              size="sm"
              label="View"
              value={view}
              onChange={setView}
              options={[
                { value: 'edit', label: 'Write', icon: PencilSquareIcon },
                { value: 'preview', label: 'Preview', icon: EyeIcon }
              ]}
            />
            {!locked && (
              <>
                <button type="button" onClick={saveNow} className="btn btn-outline btn-md" title="Save draft (Ctrl+S)">
                  <BookmarkSquareIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  <span className="hidden sm:inline">Save draft</span><span className="sm:hidden">Save</span>
                </button>
                <button type="button" onClick={() => setConfirmOpen(true)} className="btn btn-primary btn-md">
                  <PaperAirplaneIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  {publishes ? 'Publish' : 'Send for review'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Banners ---------- */}
      <AnimatePresence initial={false}>
        {ed.backup && !locked && (
          <Banner
            key="backup"
            tone="gold"
            icon={ArrowUturnLeftIcon}
            actions={(
              <>
                <button type="button" onClick={ed.restoreBackup} className="btn btn-primary btn-sm">Restore it</button>
                <button type="button" onClick={ed.discardBackup} className="btn btn-outline btn-sm">Start fresh</button>
              </>
            )}
          >
            <strong>We found work that wasn’t saved</strong> from {timeAgo(ed.backup.savedAt)}
            {ed.backup.form.title ? <> — “{ed.backup.form.title}”</> : null}. Would you like it back?
          </Banner>
        )}
        {locked && (
          <Banner
            key="locked"
            tone="green"
            icon={LockClosedIcon}
            actions={<Link to="/dashboard/drafts" className="btn btn-outline btn-sm">Back to my articles</Link>}
          >
            <strong>This article is {ed.meta.status === 'published' ? 'published' : 'with the reviewers'}.</strong> Editing is paused so nothing changes underneath them.
            If they send it back with feedback, you’ll be able to edit it again.
          </Banner>
        )}
        {!locked && ed.meta.status === 'draft' && ed.meta.rejectionNotes && (
          <Banner key="feedback" tone="red" icon={ArrowUturnLeftIcon}>
            <strong>A reviewer asked for changes:</strong> “{ed.meta.rejectionNotes}”
          </Banner>
        )}
        {!locked && publishes && ed.articleId && ed.meta.status === 'published' && (
          <Banner key="live" tone="gold" icon={CheckIcon}>
            <strong>This article is live.</strong> Saving changes updates the website straight away.
          </Banner>
        )}
      </AnimatePresence>

      {/* ---------- Workspace ---------- */}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            {view === 'preview' ? (
              <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: EASE }}>
                <p className="mb-4 text-center text-sm font-semibold text-ink-400">This is roughly how readers will see your article</p>
                <ArticlePreview form={form} authorName={ed.meta.authorName || user?.name} />
              </motion.div>
            ) : (
              <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: EASE }}>
                <div className="rounded-3xl bg-white shadow-sm ring-1 ring-ink-100">
                  <div className="space-y-4 px-6 pb-2 pt-8 sm:px-10">
                    <AutoTextarea
                      aria-label="Headline"
                      placeholder="Write a headline that tells the story"
                      value={form.title}
                      onChange={(e) => setField({ title: e.target.value })}
                      max={150}
                      warnAt={110}
                      disabled={locked}
                      className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2.1rem]"
                    />
                    <AutoTextarea
                      aria-label="Summary"
                      placeholder="Add a short summary — one or two sentences shown on the news cards"
                      value={form.summary}
                      onChange={(e) => setField({ summary: e.target.value })}
                      max={300}
                      warnAt={240}
                      disabled={locked}
                      className="text-lg leading-relaxed text-ink-600"
                    />
                  </div>

                  <div className="sticky top-[8.4rem] z-10 px-4 pb-3 pt-2 sm:px-8">
                    <EditorToolbar editor={editor} disabled={locked} uploading={uploadingImg} onPickImage={() => fileInput.current?.click()} />
                  </div>
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) insertImage(f);
                      e.target.value = '';
                    }}
                  />

                  <div className="article-prose min-h-[26rem] px-6 pb-8 sm:px-10 [&_.ProseMirror]:min-h-[24rem] [&_.ProseMirror]:outline-none">
                    <EditorContent editor={editor} />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink-100 px-6 py-3 text-xs font-semibold text-ink-400 sm:px-10">
                    <span>{words} word{words === 1 ? '' : 's'} · about {readingMinutes(words)} min read</span>
                    <span className="hidden sm:inline">Tip: press Ctrl + S to save at any time</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ---------- Side panel ---------- */}
        <aside className="space-y-4 xl:sticky xl:top-[8.4rem]">
          <Section title="Is it ready?">
            <Readiness items={checklist} words={words} minutes={readingMinutes(words)} />
          </Section>

          <Section title="What kind of article is it?" hint="This decides where it appears on the website.">
            <div className="space-y-2" role="radiogroup" aria-label="Category">
              {CATEGORIES.map((c) => {
                const active = form.category === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    disabled={locked}
                    onClick={() => setField({ category: c.value })}
                    className={clsx(
                      'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left ring-1 transition-all',
                      active ? 'bg-brand-50 ring-2 ring-brand-500' : 'bg-white ring-ink-100 hover:bg-ink-50/60 hover:ring-ink-200'
                    )}
                  >
                    <span className={clsx('flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors', active ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-200')}>
                      {active && <CheckIcon className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink-900">{c.label}</span>
                      <span className="block text-xs text-ink-400">{c.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Cover picture" hint="Shown on the news cards and at the top of the article.">
            <CoverImage value={form.imageUrl} onChange={(url) => setField({ imageUrl: url })} disabled={locked} />
          </Section>

          <Section title="Tags (optional)">
            <TagInput value={form.tags} onChange={(tags) => setField({ tags })} disabled={locked} />
          </Section>
        </aside>
      </div>

      <SubmitDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmSubmit}
        checklist={checklist}
        publishes={publishes}
        loading={submitting}
      />
    </div>
  );
};

export default NewsEditor;
