// Accessibility helperid - parem ligipääsetavus
import { useEffect } from 'react';

// Keyboard navigation helper
// eslint-disable-next-line react-refresh/only-export-components
export const useKeyboardNavigation = (onEscape, onEnter) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
      }
      if (e.key === 'Enter' && onEnter && !e.shiftKey) {
        onEnter();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onEnter]);
};

// Focus trap komponent
import React from 'react';

const FocusTrap = ({ children, active = true }) => {
  const containerRef = React.useRef(null);
  
  useEffect(() => {
    if (!active || !containerRef.current) return;
    
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleTab);
    firstElement?.focus();
    
    return () => {
      document.removeEventListener('keydown', handleTab);
    };
  }, [active]);
  
  return <div ref={containerRef}>{children}</div>;
};

// Screen reader friendly message
const ScreenReaderMessage = ({ message, priority = 'polite' }) => {
  return (
    <div
      className="sr-only"
      role="status"
      aria-live={priority}
      aria-atomic="true"
    >
      {message}
    </div>
  );
};

// Skip to content link
const SkipToContent = ({ targetId = 'main-content' }) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-500 focus:text-white focus:rounded-lg focus:font-bold"
    >
      Jäta vahele navigatsioonile
    </a>
  );
};

export { FocusTrap, ScreenReaderMessage, SkipToContent };
