import { useEffect } from 'react';

const SUFFIX = 'ESLGSC Portal';

/** Sets the browser tab title for the current page, restoring it on unmount. */
export default function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · ${SUFFIX}` : SUFFIX;
    return () => { document.title = previous; };
  }, [title]);
}
