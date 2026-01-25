/**
 * React hook for translations with reactivity
 * 
 * This hook provides reactive translations that update when locale changes.
 */
import { useState, useEffect } from 'react';
import { getTranslations, subscribeToLocaleChanges, type Translations } from './index';

/**
 * React hook for translations
 * 
 * @example
 * ```tsx
 * const t = useTranslation();
 * <div>{t.menu.title}</div>
 * ```
 */
export function useTranslation(): Translations {
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    const unsubscribe = subscribeToLocaleChanges(() => {
      forceUpdate({});
    });
    
    return unsubscribe;
  }, []);
  
  return getTranslations();
}
