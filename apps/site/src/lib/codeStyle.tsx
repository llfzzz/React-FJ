import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ImplFormat } from '../registry/types';

const STORAGE_KEY = 'fj-code-style';

function readStoredStyle(): ImplFormat {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === 'js' || raw === 'ts' || raw === 'css' || raw === 'tailwind' ? raw : 'ts';
  } catch {
    return 'ts';
  }
}

interface CodeStyleContextValue {
  style: ImplFormat;
  setStyle: (style: ImplFormat) => void;
}

const CodeStyleContext = createContext<CodeStyleContextValue | null>(null);

/**
 * Site-wide code style (JavaScript / TypeScript / CSS / Tailwind) for the
 * Implementation sections. Global so a reader who works in, say, Tailwind
 * doesn't re-pick it on all 50+ component pages.
 */
export function CodeStyleProvider({ children }: { children: ReactNode }) {
  const [style, setStyleState] = useState<ImplFormat>(readStoredStyle);

  const setStyle = useCallback((next: ImplFormat) => {
    setStyleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — the choice still applies for this session */
    }
  }, []);

  const value = useMemo(() => ({ style, setStyle }), [style, setStyle]);

  return <CodeStyleContext.Provider value={value}>{children}</CodeStyleContext.Provider>;
}

export function useCodeStyle(): CodeStyleContextValue {
  const ctx = useContext(CodeStyleContext);
  if (!ctx) throw new Error('useCodeStyle must be used inside <CodeStyleProvider>');
  return ctx;
}
