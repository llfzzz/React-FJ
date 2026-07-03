import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReducedMotion } from '@fj-effects/motion/useReducedMotion';
import { useTrigger } from '@fj-effects/motion/useTrigger';
import { ensureKeyframes } from '@fj-effects/motion/keyframes';
import { easeVar } from '@fj-effects/motion/types';

/** Re-mock matchMedia for a single test (setup defaults matches: false). */
function mockReducedMotion(matches: boolean) {
  const listeners = new Set<() => void>();
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: (_: string, cb: () => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
    addListener: (cb: () => void) => listeners.add(cb),
    removeListener: (cb: () => void) => listeners.delete(cb),
    dispatchEvent: vi.fn(),
  }));
}

describe('useReducedMotion', () => {
  afterEach(() => {
    // Restore the setup default.
    mockReducedMotion(false);
  });

  it('reflects the matchMedia result', () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('is false when reduced motion is not requested', () => {
    mockReducedMotion(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});

describe('useTrigger', () => {
  it('mount mode is active immediately', () => {
    const { result } = renderHook(() => useTrigger('mount'));
    expect(result.current.active).toBe(true);
  });

  it('hover mode toggles active via bound handlers', () => {
    const { result } = renderHook(() => useTrigger('hover'));
    expect(result.current.active).toBe(false);
    act(() => result.current.bind.onMouseEnter?.({} as never));
    expect(result.current.active).toBe(true);
    act(() => result.current.bind.onMouseLeave?.({} as never));
    expect(result.current.active).toBe(false);
  });

  it('manual mode follows the controlled active prop', () => {
    const { result, rerender } = renderHook(({ active }) => useTrigger('manual', { active }), {
      initialProps: { active: false },
    });
    expect(result.current.active).toBe(false);
    rerender({ active: true });
    expect(result.current.active).toBe(true);
  });

  it('disabled keeps the effect inactive', () => {
    const { result } = renderHook(() => useTrigger('mount', { disabled: true }));
    expect(result.current.active).toBe(false);
  });
});

describe('ensureKeyframes', () => {
  it('injects a named block once, into a single shared style tag', () => {
    ensureKeyframes('fj-test-kf', '@keyframes fj-test-kf { to { opacity: 1; } }');
    ensureKeyframes('fj-test-kf', '@keyframes fj-test-kf { to { opacity: 1; } }');
    const tags = document.head.querySelectorAll('style[data-fj-effects]');
    expect(tags.length).toBe(1);
    expect(tags[0].textContent).toContain('fj-test-kf');
    // A second injection of the same name must not duplicate the rule.
    const occurrences = (tags[0].textContent ?? '').split('@keyframes fj-test-kf').length - 1;
    expect(occurrences).toBe(1);
  });
});

describe('easeVar', () => {
  it('maps easing tokens to CSS variables', () => {
    expect(easeVar('emphasized')).toBe('var(--ease-emphasized)');
    expect(easeVar('out')).toBe('var(--ease-out)');
  });
});
