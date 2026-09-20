import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getNewsById, saveNewsDraft, submitNewsForApproval } from '../services/newsService';
import {
  EMPTY_ARTICLE,
  pickEditable,
  readBackup,
  writeBackup,
  clearBackup
} from '../lib/article';

const AUTOSAVE_MS = 2500;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const friendlyError = (err) => {
  const status = err?.response?.status;
  if (!err?.response) return 'We couldn’t reach the server. Your work is safe on this computer — we’ll keep trying.';
  if (status === 403) return 'You don’t have permission to change this article.';
  if (status === 404) return 'That article could not be found.';
  return err.response?.data?.message || 'Something went wrong while saving. Please try again.';
};

/**
 * Everything the article editor needs behind the scenes:
 *  - loads an existing article (or starts a blank one),
 *  - autosaves a moment after the writer stops typing (never two saves at once),
 *  - keeps a copy in local storage so a crashed tab or dropped connection loses nothing,
 *  - saves-then-submits safely when the writer sends it for review.
 */
export default function useArticleEditor({ newsId, user }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(EMPTY_ARTICLE);
  const [articleId, setArticleId] = useState(newsId || null);
  const [meta, setMeta] = useState({ status: 'draft', rejectionNotes: null, authorName: null, updatedAt: null });
  const [saveState, setSaveState] = useState('idle'); // idle | dirty | saving | saved | error
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [backup, setBackup] = useState(null);
  const [contentVersion, setContentVersion] = useState(0); // bump = tell the editor to reload `form.content`

  const formRef = useRef(form);
  const idRef = useRef(articleId);
  const loadedIdRef = useRef(null); // the article id whose data is currently in `form`
  const dirtyRef = useRef(false);
  const savingRef = useRef(false);
  const queuedRef = useRef(false);
  formRef.current = form;
  idRef.current = articleId;

  // ---- load an existing article ----
  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['news', 'editor', newsId],
    queryFn: () => getNewsById(newsId),
    // Don't fetch an article this editor just created — its data is already in `form`.
    // (Fetching it would swap the page to a skeleton and remount the editor mid-sentence.)
    enabled: Boolean(newsId) && loadedIdRef.current !== newsId,
    staleTime: 0,
    gcTime: 0,
    retry: 1
  });

  useEffect(() => {
    if (!article || article.id === loadedIdRef.current) return;
    loadedIdRef.current = article.id;
    const server = pickEditable(article);
    setForm(server);
    setArticleId(article.id);
    setMeta({ status: article.status, rejectionNotes: article.rejectionNotes, authorName: article.authorName, updatedAt: article.updatedAt });
    dirtyRef.current = false;
    setSaveState('idle');
    setContentVersion((v) => v + 1);

    const b = readBackup(article.id);
    if (b && JSON.stringify(b.form) !== JSON.stringify(server) && b.savedAt > new Date(article.updatedAt).getTime()) setBackup(b);
    else clearBackup(article.id);
  }, [article]);

  // Opening a blank article: offer to restore any unsent work from last time.
  useEffect(() => {
    if (newsId) return;
    // Navigated from an existing article to "new": start clean.
    if (loadedIdRef.current) {
      loadedIdRef.current = null;
      setForm(EMPTY_ARTICLE);
      setArticleId(null);
      setMeta({ status: 'draft', rejectionNotes: null, authorName: null, updatedAt: null });
      dirtyRef.current = false;
      setSaveState('idle');
      setContentVersion((v) => v + 1);
    }
    if (!idRef.current) {
      const b = readBackup(null);
      if (b && (b.form.title || b.form.content)) setBackup(b);
    }
  }, [newsId]);

  // ---- editing ----
  const setField = useCallback((patch) => {
    // Ignore no-op updates (e.g. the editor re-reporting content it already has).
    const cur = formRef.current;
    if (Object.keys(patch).every((k) => JSON.stringify(cur[k]) === JSON.stringify(patch[k]))) return;
    dirtyRef.current = true;
    setForm((prev) => ({ ...prev, ...patch }));
    setSaveState((s) => (s === 'saving' ? s : 'dirty'));
  }, []);

  const locked = useMemo(
    () => user?.role === 'MEDIA_ADMIN' && Boolean(articleId) && meta.status !== 'draft',
    [user?.role, articleId, meta.status]
  );

  // ---- saving ----
  const save = useCallback(async ({ silent = false } = {}) => {
    const current = formRef.current;
    if (!current.title.trim()) {
      if (!silent) toast.info('Give your article a headline first — then we can save it.');
      return null;
    }
    if (savingRef.current) {
      queuedRef.current = true;
      return null;
    }

    savingRef.current = true;
    setSaveState('saving');
    const snapshot = JSON.stringify(pickEditable(current));
    let saved = null;
    try {
      saved = await saveNewsDraft({ id: idRef.current || undefined, ...pickEditable(current) });
      const wasNew = !idRef.current;
      idRef.current = saved.id;
      loadedIdRef.current = saved.id;
      setArticleId(saved.id);
      setMeta((m) => ({ ...m, status: saved.status || m.status, updatedAt: saved.updatedAt }));
      setLastSavedAt(Date.now());

      dirtyRef.current = JSON.stringify(pickEditable(formRef.current)) !== snapshot;
      setSaveState(dirtyRef.current ? 'dirty' : 'saved');
      if (!dirtyRef.current) {
        clearBackup(saved.id);
        clearBackup(null);
      }
      queryClient.invalidateQueries({ queryKey: ['news'], predicate: (q) => q.queryKey[1] !== 'editor' });
      if (wasNew) navigate(`/dashboard/news-editor/${saved.id}`, { replace: true });
    } catch (err) {
      setSaveState('error');
      if (!silent) toast.error(friendlyError(err));
    } finally {
      savingRef.current = false;
      if (queuedRef.current) {
        queuedRef.current = false;
        setTimeout(() => save({ silent: true }), 0);
      }
    }
    return saved;
  }, [navigate, queryClient]);

  // Local backup on every change; server save shortly after the writer pauses.
  useEffect(() => {
    if (!dirtyRef.current || locked) return undefined;
    writeBackup(idRef.current, form);
    const t = setTimeout(() => save({ silent: true }), AUTOSAVE_MS);
    return () => clearTimeout(t);
  }, [form, locked, save]);

  // If a save failed (e.g. offline), try again when the connection returns.
  useEffect(() => {
    const retry = () => { if (dirtyRef.current) save({ silent: true }); };
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, [save]);

  /** Wait for any in-flight save, then save whatever is left. Resolves with the article id. */
  const ensureSaved = useCallback(async () => {
    while (savingRef.current) await sleep(80);
    if (dirtyRef.current || !idRef.current) await save({ silent: false });
    while (savingRef.current) await sleep(80);
    return idRef.current;
  }, [save]);

  const submit = useCallback(async () => {
    try {
      const id = await ensureSaved();
      if (!id) return false;
      await submitNewsForApproval(id, {});
      clearBackup(id);
      clearBackup(null);
      dirtyRef.current = false;
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['auditQueue'] });
      queryClient.invalidateQueries({ queryKey: ['activityLog'] });
      return true;
    } catch (err) {
      toast.error(friendlyError(err));
      return false;
    }
  }, [ensureSaved, queryClient]);

  // ---- crash recovery ----
  const restoreBackup = useCallback(() => {
    if (!backup) return;
    setForm(backup.form);
    dirtyRef.current = true;
    setSaveState('dirty');
    setContentVersion((v) => v + 1);
    setBackup(null);
  }, [backup]);

  const discardBackup = useCallback(() => {
    clearBackup(idRef.current);
    clearBackup(null);
    setBackup(null);
  }, []);

  return {
    form,
    formRef,
    setField,
    articleId,
    meta,
    isLoading: Boolean(newsId) && loadedIdRef.current !== newsId && isLoading && !article,
    loadFailed: Boolean(newsId) && isError,
    saveState,
    lastSavedAt,
    isDirty: saveState === 'dirty' || saveState === 'saving' || saveState === 'error',
    locked,
    backup,
    contentVersion,
    save,
    submit,
    ensureSaved,
    restoreBackup,
    discardBackup
  };
}
