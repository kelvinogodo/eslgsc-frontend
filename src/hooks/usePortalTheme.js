import { useEffect } from 'react';

/**
 * Turns on the portal theme (emerald/gold, larger controls) for as long as the
 * calling component is mounted. The class lives on <html> rather than a wrapper
 * div because dialogs and toasts render outside the app root.
 */
export default function usePortalTheme() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('portal');
    return () => root.classList.remove('portal');
  }, []);
}
