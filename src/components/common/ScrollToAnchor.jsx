import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that handles smooth scrolling to anchor tags (#id) 
 * when the URL hash changes.
 */
const ScrollToAnchor = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      // Find the element by ID
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      
      if (element) {
        // Small delay to ensure any dynamic content or layout shift has settled
        const timer = setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      // If no hash, scroll to top on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash, pathname]);

  return null;
};

export default ScrollToAnchor;
