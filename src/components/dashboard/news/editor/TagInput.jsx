import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const MAX_TAGS = 8;

/** Type a keyword, press Enter (or comma) to add it. Click × to remove. */
const TagInput = ({ value = [], onChange, disabled }) => {
  const [draft, setDraft] = useState('');

  const add = (raw) => {
    const t = raw.trim().replace(/,+$/, '');
    if (!t || value.some((v) => v.toLowerCase() === t.toLowerCase()) || value.length >= MAX_TAGS) {
      setDraft('');
      return;
    }
    onChange([...value, t]);
    setDraft('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(draft);
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div>
      <div
        className={`flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-ink-200 bg-white px-2.5 py-2 transition focus-within:border-brand-500 focus-within:shadow-[0_0_0_4px_rgb(31_163_90/0.16)] ${disabled ? 'opacity-60' : ''}`}
      >
        <AnimatePresence initial={false}>
          {value.map((tag) => (
            <motion.span
              key={tag}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pl-3 pr-1.5 text-sm font-semibold text-brand-800 ring-1 ring-brand-100"
            >
              {tag}
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(value.filter((v) => v !== tag))}
                aria-label={`Remove tag ${tag}`}
                className="flex h-5 w-5 items-center justify-center rounded-full text-brand-600 hover:bg-brand-200"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          value={draft}
          disabled={disabled || value.length >= MAX_TAGS}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => draft.trim() && add(draft)}
          placeholder={value.length ? '' : 'Type a keyword and press Enter'}
          aria-label="Add a tag"
          className="min-w-[8rem] flex-1 bg-transparent py-0.5 text-[0.93rem] outline-none placeholder:text-ink-300"
        />
      </div>
      <p className="mt-1.5 text-xs text-ink-400">
        Tags help readers find related stories. {value.length}/{MAX_TAGS} used.
      </p>
    </div>
  );
};

export default TagInput;
