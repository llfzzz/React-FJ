import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ImplLanguage, ImplStyling } from '../registry/types';

const LANGUAGE_KEY = 'fj-code-lang';
const STYLING_KEY = 'fj-code-styling';
/** Pre-2D key ('js' | 'ts' | 'css' | 'tailwind') — migrated on first read. */
const LEGACY_KEY = 'fj-code-style';

function isLanguage(value: string | null): value is ImplLanguage {
  return value === 'js' || value === 'ts';
}

function isStyling(value: string | null): value is ImplStyling {
  return value === 'css' || value === 'tailwind';
}

function readStoredLanguage(): ImplLanguage {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (isLanguage(stored)) return stored;
    const legacy = localStorage.getItem(LEGACY_KEY);
    return isLanguage(legacy) ? legacy : 'ts';
  } catch {
    return 'ts';
  }
}

function readStoredStyling(): ImplStyling {
  try {
    const stored = localStorage.getItem(STYLING_KEY);
    if (isStyling(stored)) return stored;
    const legacy = localStorage.getItem(LEGACY_KEY);
    return isStyling(legacy) ? legacy : 'css';
  } catch {
    return 'css';
  }
}

interface CodeStyleContextValue {
  language: ImplLanguage;
  styling: ImplStyling;
  setLanguage: (language: ImplLanguage) => void;
  setStyling: (styling: ImplStyling) => void;
}

const CodeStyleContext = createContext<CodeStyleContextValue | null>(null);

/**
 * Site-wide code preferences for the Implementation sections: a language
 * (JavaScript / TypeScript) and a styling method (CSS / Tailwind), combined
 * into one implementation per component. Global so a reader who works in,
 * say, TypeScript + Tailwind doesn't re-pick it on all 50+ component pages.
 */
export function CodeStyleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<ImplLanguage>(readStoredLanguage);
  const [styling, setStylingState] = useState<ImplStyling>(readStoredStyling);

  const setLanguage = useCallback((next: ImplLanguage) => {
    setLanguageState(next);
    try {
      localStorage.setItem(LANGUAGE_KEY, next);
    } catch {
      /* storage unavailable — the choice still applies for this session */
    }
  }, []);

  const setStyling = useCallback((next: ImplStyling) => {
    setStylingState(next);
    try {
      localStorage.setItem(STYLING_KEY, next);
    } catch {
      /* storage unavailable — the choice still applies for this session */
    }
  }, []);

  const value = useMemo(
    () => ({ language, styling, setLanguage, setStyling }),
    [language, styling, setLanguage, setStyling],
  );

  return <CodeStyleContext.Provider value={value}>{children}</CodeStyleContext.Provider>;
}

export function useCodeStyle(): CodeStyleContextValue {
  const ctx = useContext(CodeStyleContext);
  if (!ctx) throw new Error('useCodeStyle must be used inside <CodeStyleProvider>');
  return ctx;
}
