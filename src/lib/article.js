// Small helpers shared by the article editor and its preview.

export const CATEGORIES = [
  { value: 'news', label: 'News update', hint: 'General news and stories' },
  { value: 'press-releases', label: 'Press release', hint: 'Official statements to the media' },
  { value: 'announcements', label: 'Announcement', hint: 'Notices about programmes and events' },
  { value: 'speeches', label: 'Official speech', hint: 'Speeches and addresses' },
  { value: 'notices', label: 'Public notice', hint: 'Formal notices to the public' }
];

export const categoryLabel = (value) => CATEGORIES.find((c) => c.value === value)?.label || value || 'News';

export const stripHtml = (html = '') => html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

export const countWords = (html = '') => {
  const text = stripHtml(html);
  return text ? text.split(' ').length : 0;
};

export const readingMinutes = (words) => Math.max(1, Math.round(words / 200));

export const normalizeTags = (tags) => {
  if (!tags) return [];
  const list = Array.isArray(tags) ? tags : String(tags).split(',');
  return [...new Set(list.map((t) => String(t).trim()).filter(Boolean))];
};

export const EMPTY_ARTICLE = {
  title: '',
  summary: '',
  content: '',
  category: 'news',
  tags: [],
  imageUrl: ''
};

/** Editable fields only — what we send to the API and keep in local backup. */
export const pickEditable = (a = {}) => ({
  title: a.title || '',
  summary: a.summary || '',
  content: a.content || '',
  category: a.category || 'news',
  tags: normalizeTags(a.tags),
  imageUrl: a.imageUrl || ''
});

export const sameArticle = (a, b) => JSON.stringify(pickEditable(a)) === JSON.stringify(pickEditable(b));

/**
 * What must be true before an article can be sent for review, and what we
 * merely recommend. `required` items block submission.
 */
export const buildChecklist = (form) => {
  const words = countWords(form.content);
  return [
    { id: 'title', label: 'A clear headline', detail: 'At least 10 characters', ok: form.title.trim().length >= 10, required: true },
    { id: 'summary', label: 'A short summary', detail: 'One or two sentences (at least 40 characters)', ok: form.summary.trim().length >= 40, required: true },
    { id: 'body', label: 'The article text', detail: 'At least 30 words', ok: words >= 30, required: true },
    { id: 'image', label: 'A cover picture', detail: 'Recommended — it appears on the website cards', ok: Boolean(form.imageUrl), required: false }
  ];
};

// ---- local backup (survives a crashed tab or a dropped connection) ----
const backupKey = (id) => `eslgsc:article-backup:${id || 'new'}`;

export const readBackup = (id) => {
  try {
    const raw = localStorage.getItem(backupKey(id));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const writeBackup = (id, form) => {
  try {
    localStorage.setItem(backupKey(id), JSON.stringify({ form: pickEditable(form), savedAt: Date.now() }));
  } catch { /* storage full or unavailable — autosave to the server still works */ }
};

export const clearBackup = (id) => {
  try { localStorage.removeItem(backupKey(id)); } catch { /* ignore */ }
};
