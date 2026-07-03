import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { CodeStyleProvider, useCodeStyle } from './codeStyle';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CodeStyleProvider>{children}</CodeStyleProvider>
);

describe('code style store', () => {
  it('defaults to TypeScript', () => {
    const { result } = renderHook(() => useCodeStyle(), { wrapper });
    expect(result.current.style).toBe('ts');
  });

  it('persists the selection to localStorage', () => {
    const { result } = renderHook(() => useCodeStyle(), { wrapper });
    act(() => result.current.setStyle('tailwind'));
    expect(result.current.style).toBe('tailwind');
    expect(localStorage.getItem('fj-code-style')).toBe('tailwind');
  });

  it('restores a stored selection on mount', () => {
    localStorage.setItem('fj-code-style', 'css');
    const { result } = renderHook(() => useCodeStyle(), { wrapper });
    expect(result.current.style).toBe('css');
  });

  it('ignores an invalid stored value', () => {
    localStorage.setItem('fj-code-style', 'ruby');
    const { result } = renderHook(() => useCodeStyle(), { wrapper });
    expect(result.current.style).toBe('ts');
  });
});
