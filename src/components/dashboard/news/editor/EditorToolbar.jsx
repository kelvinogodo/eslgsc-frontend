import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  LinkIcon,
  PhotoIcon,
  ListBulletIcon,
  NumberedListIcon,
  MinusIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const Btn = ({ label, shortcut, active, disabled, onClick, children, className }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()} // keep the text selection while clicking
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    aria-pressed={active}
    title={shortcut ? `${label} (${shortcut})` : label}
    className={clsx(
      'inline-flex h-9 min-w-[2.1rem] items-center justify-center rounded-lg px-1.5 text-sm transition-colors',
      'disabled:cursor-not-allowed disabled:opacity-35',
      active ? 'bg-brand-600 text-white shadow-sm' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
      className
    )}
  >
    {children}
  </button>
);

const Divider = () => <span className="mx-0.5 hidden h-6 w-px bg-ink-100 2xl:block" aria-hidden="true" />;

const QuoteIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M7.2 17c-1.9 0-3.2-1.4-3.2-3.3 0-2.9 1.7-5.4 4.4-6.7l.9 1.3c-1.5.9-2.4 2-2.5 3.3.2-.1.4-.1.6-.1 1.5 0 2.6 1.1 2.6 2.6S9.5 17 7.2 17Zm8.6 0c-1.9 0-3.2-1.4-3.2-3.3 0-2.9 1.7-5.4 4.4-6.7l.9 1.3c-1.5.9-2.4 2-2.5 3.3.2-.1.4-.1.6-.1 1.5 0 2.6 1.1 2.6 2.6S18.1 17 15.8 17Z" /></svg>
);
const AlignCenterIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M4 6h16M7 10h10M4 14h16M7 18h10" /></svg>
);

const BLOCKS = [
  { value: 'p', label: 'Normal text' },
  { value: 'h2', label: 'Big heading' },
  { value: 'h3', label: 'Small heading' }
];

const normalizeUrl = (raw) => {
  const v = raw.trim();
  if (!v) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(v)) return v;
  return `https://${v}`;
};

/**
 * Formatting bar with plain-language labels, shortcuts in the tooltips and an
 * inline link editor (no browser pop-ups). Sticks under the action bar.
 */
const EditorToolbar = ({ editor, disabled, onPickImage, uploading }) => {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const linkInput = useRef(null);

  useEffect(() => {
    if (linkOpen) setTimeout(() => linkInput.current?.focus(), 30);
  }, [linkOpen]);

  if (!editor) return <div className="h-14" />;

  const off = disabled;
  const currentBlock = editor.isActive('heading', { level: 2 }) ? 'h2' : editor.isActive('heading', { level: 3 }) ? 'h3' : 'p';

  const setBlock = (v) => {
    const chain = editor.chain().focus();
    if (v === 'p') chain.setParagraph().run();
    else chain.toggleHeading({ level: v === 'h2' ? 2 : 3 }).run();
  };

  const openLink = () => {
    setLinkValue(editor.getAttributes('link').href || '');
    setLinkOpen(true);
  };

  const applyLink = () => {
    const url = normalizeUrl(linkValue);
    if (!url) editor.chain().focus().extendMarkRange('link').unsetLink().run();
    else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setLinkOpen(false);
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkOpen(false);
  };

  return (
    <div className="relative">
      <div
        role="toolbar"
        aria-label="Text formatting"
        className="flex flex-wrap items-center gap-0.5 rounded-2xl border border-ink-100 bg-white/95 p-1 shadow-sm backdrop-blur"
      >
        <Btn label="Undo" shortcut="Ctrl+Z" disabled={off || !editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          <ArrowUturnLeftIcon className="h-[1.1rem] w-[1.1rem]" />
        </Btn>
        <Btn label="Redo" shortcut="Ctrl+Y" disabled={off || !editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          <ArrowUturnRightIcon className="h-[1.1rem] w-[1.1rem]" />
        </Btn>

        <Divider />

        <select
          aria-label="Text style"
          value={currentBlock}
          disabled={off}
          onChange={(e) => setBlock(e.target.value)}
          className="h-9 rounded-lg border-0 bg-ink-50 px-2.5 pr-7 text-sm font-semibold text-ink-700 outline-none ring-1 ring-ink-100 transition hover:bg-ink-100 focus:ring-2 focus:ring-brand-400 disabled:opacity-40"
        >
          {BLOCKS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
        </select>

        <Divider />

        <Btn label="Bold" shortcut="Ctrl+B" disabled={off} active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <span className="font-extrabold">B</span>
        </Btn>
        <Btn label="Italic" shortcut="Ctrl+I" disabled={off} active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <span className="font-serif italic">I</span>
        </Btn>
        <Btn label="Underline" shortcut="Ctrl+U" disabled={off} active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline underline-offset-2">U</span>
        </Btn>

        <Divider />

        <Btn label="Bulleted list" disabled={off} active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <ListBulletIcon className="h-[1.1rem] w-[1.1rem]" />
        </Btn>
        <Btn label="Numbered list" disabled={off} active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <NumberedListIcon className="h-[1.1rem] w-[1.1rem]" />
        </Btn>
        <Btn label="Quote" disabled={off} active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <QuoteIcon className="h-[1.1rem] w-[1.1rem]" />
        </Btn>

        <Divider />

        <Btn
          label="Center the text"
          disabled={off}
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign(editor.isActive({ textAlign: 'center' }) ? 'left' : 'center').run()}
        >
          <AlignCenterIcon className="h-[1.1rem] w-[1.1rem]" />
        </Btn>

        <Divider />

        <Btn label="Add or edit a link" disabled={off} active={editor.isActive('link') || linkOpen} onClick={openLink}>
          <LinkIcon className="h-[1.1rem] w-[1.1rem]" />
        </Btn>
        <Btn label="Insert a picture" disabled={off || uploading} onClick={onPickImage}>
          <PhotoIcon className="h-[1.1rem] w-[1.1rem]" />
          {uploading && <span className="ml-1.5 text-[0.82rem] font-semibold">Uploading…</span>}
        </Btn>
        <Btn label="Insert a dividing line" disabled={off} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <MinusIcon className="h-[1.1rem] w-[1.1rem]" />
        </Btn>
      </div>

      <AnimatePresence>
        {linkOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-2 right-2 top-full z-30 mt-2 max-w-lg rounded-2xl border border-ink-100 bg-white p-3 shadow-xl shadow-ink-900/10"
          >
            <label htmlFor="link-url" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500">Where should this link go?</label>
            <div className="flex gap-2">
              <input
                id="link-url"
                ref={linkInput}
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
                  if (e.key === 'Escape') setLinkOpen(false);
                }}
                placeholder="e.g. www.ebonyistate.gov.ng"
                className="input flex-1"
              />
              <button type="button" onClick={applyLink} className="btn btn-primary btn-md" aria-label="Apply link"><CheckIcon className="h-5 w-5" /></button>
              <button type="button" onClick={() => setLinkOpen(false)} className="btn btn-ghost btn-md" aria-label="Cancel"><XMarkIcon className="h-5 w-5" /></button>
            </div>
            {editor.isActive('link') && (
              <button type="button" onClick={removeLink} className="mt-2 text-sm font-bold text-red-600 hover:text-red-700">Remove this link</button>
            )}
            <p className="mt-2 text-xs text-ink-400">Tip: select some words first, then add the link.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditorToolbar;
