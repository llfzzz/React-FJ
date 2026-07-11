import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { CodeStyleProvider, useCodeStyle } from './codeStyle';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CodeStyleProvider>{children}</CodeStyleProvider>
);

describe('code style store', () => {
  it('defaults to TypeScript + CSS', () => {
    const { result } = renderHook(() => useCodeStyle(), { wrapper });
    expect(result.current.language).toBe('ts');
    expect(result.current.styling).toBe('css');
  });

  it('persists both axes to localStorage independently', () => {
    const { result } = renderHook(() => useCodeStyle(), { wrapper });
    act(() => result.current.setLanguage('js'));
    act(() => result.current.setStyling('tailwind'));
    expect(result.current.language).toBe('js');
    expect(result.current.styling).toBe('tailwind');
    expect(localStorage.getItem('fj-code-lang')).toBe('js');
    expect(localStorage.getItem('fj-code-styling')).toBe('tailwind');
  });

  it('restores stored selections on mount', () => {
    localStorage.setItem('fj-code-lang', 'js');
    localStorage.setItem('fj-code-styling', 'tailwind');
    const { result } = renderHook(() => useCodeStyle(), { wrapper });
    expect(result.current.language).toBe('js');
    expect(result.current.styling).toBe('tailwind');
  });

  it('migrates the pre-2D single key onto the matching axis', () => {
    // A stored language keeps the default styling…
    localStorage.setItem('fj-code-style', 'js');
    const { result } = renderHook(() => useCodeStyle(), { wrapper });
    expect(result.current.language).toBe('js');
    expect(result.current.styling).toBe('css');
    // …and a stored styling keeps the default language.
    localStorage.clear();
    localStorage.setItem('fj-code-style', 'tailwind');
    const { result: second } = renderHook(() => useCodeStyle(), { wrapper });
    expect(second.current.language).toBe('ts');
    expect(second.current.styling).toBe('tailwind');
  });

  it('ignores invalid stored values', () => {
    localStorage.setItem('fj-code-lang', 'ruby');
    localStorage.setItem('fj-code-styling', 'sass');
    localStorage.setItem('fj-code-style', 'ruby');
    const { result } = renderHook(() => useCodeStyle(), { wrapper });
    expect(result.current.language).toBe('ts');
    expect(result.current.styling).toBe('css');
  });
});
