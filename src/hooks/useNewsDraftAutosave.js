// src/hooks/useNewsDraftAutosave.js
// Debounced autosave hook for news drafts.
import { useEffect, useRef, useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveNewsDraft } from '../services/newsService';

/**
 * useNewsDraftAutosave
 * @param {Object} initialData - starting draft data (may include id)
 * @param {number} delay - debounce delay ms (default 1000)
 */
export function useNewsDraftAutosave(initialData = {}, delay = 1000) {
  const [draft, setDraft] = useState(initialData);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [error, setError] = useState(null);
  const dirtyRef = useRef(false);
  const timerRef = useRef(null);
  const qc = useQueryClient();

  const mutation = useMutation(saveNewsDraft, {
    onSuccess: (saved) => {
      setLastSavedAt(Date.now());
      setError(null);
      setDraft(saved);
      qc.setQueryData(['news', 'draft', saved.id], saved);
      dirtyRef.current = false;
    },
    onError: (e) => {
      setError(e?.response?.data?.message || 'Autosave failed');
    }
  });

  const schedule = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (dirtyRef.current) {
        mutation.mutate(draft);
      }
    }, delay);
  }, [draft, delay, mutation]);

  const update = useCallback((partial) => {
    setDraft(prev => {
      const next = { ...prev, ...partial };
      return next;
    });
    dirtyRef.current = true;
  }, []);

  // Reschedule when draft changes and marked dirty
  useEffect(() => {
    if (dirtyRef.current) schedule();
  }, [draft, schedule]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const manualSave = useCallback(() => mutation.mutate(draft), [draft, mutation]);

  return {
    draft,
    update,
    saving: mutation.isLoading,
    error,
    lastSavedAt,
    manualSave,
    dirty: dirtyRef.current
  };
}

export default useNewsDraftAutosave;
