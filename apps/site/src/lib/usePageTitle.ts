import { useEffect } from 'react';

const BASE = 'Free Joy';

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `${BASE} — design system`;
    return () => {
      document.title = `${BASE} — design system`;
    };
  }, [title]);
}
