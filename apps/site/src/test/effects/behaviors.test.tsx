import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Collapse } from '@fj-effects/components/Collapse';
import { FadeSwitch } from '@fj-effects/components/FadeSwitch';
import { Marquee } from '@fj-effects/components/Marquee';
import { ProgressRing } from '@fj-effects/components/ProgressRing';
import { Ripple } from '@fj-effects/components/Ripple';
import { ScrambleText } from '@fj-effects/components/ScrambleText';
import { SuccessCheck } from '@fj-effects/components/SuccessCheck';
import { Sparkles } from '@fj-effects/components/Sparkles';
import { Typewriter } from '@fj-effects/components/Typewriter';

function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

afterEach(() => mockReducedMotion(false));

describe('Collapse', () => {
  it('marks content hidden when closed and visible when open', () => {
    const { rerender } = render(
      <Collapse open={false}>
        <p>panel body</p>
      </Collapse>,
    );
    expect(screen.getByText('panel body').closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'true');
    rerender(
      <Collapse open>
        <p>panel body</p>
      </Collapse>,
    );
    expect(screen.getByText('panel body').closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'false');
  });
});

describe('FadeSwitch', () => {
  it('swaps the rendered children when switchKey changes', () => {
    const { rerender } = render(
      <FadeSwitch switchKey="a">
        <span>panel A</span>
      </FadeSwitch>,
    );
    expect(screen.getByText('panel A')).toBeInTheDocument();
    rerender(
      <FadeSwitch switchKey="b">
        <span>panel B</span>
      </FadeSwitch>,
    );
    expect(screen.getByText('panel B')).toBeInTheDocument();
  });
});

describe('SuccessCheck reduced-motion fallback', () => {
  it('renders a fully drawn check (dashoffset 0) under reduced motion', () => {
    mockReducedMotion(true);
    const { container } = render(<SuccessCheck />);
    const path = container.querySelector('path');
    expect(path).toBeTruthy();
    // Fully drawn: stroke-dashoffset collapses to 0.
    expect(path?.style.strokeDashoffset).toBe('0');
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Success');
  });
});

describe('Sparkles reduced-motion fallback', () => {
  it('renders zero particles under reduced motion but keeps its children', () => {
    mockReducedMotion(true);
    const { container } = render(
      <Sparkles count={20}>
        <span>hero content</span>
      </Sparkles>,
    );
    // The only child span should be the content wrapper — no particle spans.
    expect(screen.getByText('hero content')).toBeInTheDocument();
    const particles = container.querySelectorAll('span[aria-hidden="true"]');
    expect(particles.length).toBe(0);
  });

  it('caps particle count at 24 even when asked for more', () => {
    mockReducedMotion(false);
    const { container } = render(<Sparkles count={100} />);
    const particles = container.querySelectorAll('span[aria-hidden="true"]');
    expect(particles.length).toBeLessThanOrEqual(24);
  });
});

describe('Typewriter', () => {
  afterEach(() => vi.useRealTimers());

  it('advances one character per interval and exposes the full text as aria-label', () => {
    vi.useFakeTimers();
    const { container } = render(<Typewriter text="joy" interval={50} />);
    const root = container.querySelector('[aria-label="joy"]');
    expect(root).toBeTruthy();
    // Ghost (sizing) span first, typed overlay second.
    const overlay = root!.querySelectorAll('span[aria-hidden="true"]')[1] as HTMLElement;
    expect(overlay.textContent).toBe('');
    act(() => vi.advanceTimersByTime(100));
    expect(overlay.textContent).toBe('jo');
    act(() => vi.advanceTimersByTime(100));
    expect(overlay.textContent).toBe('joy');
  });

  it('renders the finished line instantly under reduced motion and still fires onDone', () => {
    mockReducedMotion(true);
    const onDone = vi.fn();
    render(<Typewriter text="made with joy" onDone={onDone} />);
    expect(screen.getByText('made with joy')).toBeInTheDocument();
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});

describe('ScrambleText', () => {
  it('keeps the real text as aria-label while the churn overlay is aria-hidden', () => {
    const { container } = render(<ScrambleText text="FREE JOY" />);
    const root = container.querySelector('[aria-label="FREE JOY"]');
    expect(root).toBeTruthy();
    // Ghost + overlay, both hidden from assistive tech.
    expect(root!.querySelectorAll('span[aria-hidden="true"]').length).toBe(2);
  });

  it('renders plain text with no overlay under reduced motion', () => {
    mockReducedMotion(true);
    const { container } = render(<ScrambleText text="FREE JOY" />);
    expect(screen.getByText('FREE JOY')).toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBe(0);
  });

  it('cancels its animation frame on unmount', () => {
    const spy = vi.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = render(<ScrambleText text="FREE JOY" />);
    unmount();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('Marquee', () => {
  it('renders the strip twice with an aria-hidden clone', () => {
    render(
      <Marquee>
        <span>Design tokens</span>
      </Marquee>,
    );
    const items = screen.getAllByText('Design tokens');
    expect(items.length).toBe(2);
    expect(items[0].closest('[aria-hidden="true"]')).toBeNull();
    expect(items[1].closest('[aria-hidden="true"]')).toBeTruthy();
  });

  it('renders a single static row with no clone under reduced motion', () => {
    mockReducedMotion(true);
    const { container } = render(
      <Marquee>
        <span>Design tokens</span>
      </Marquee>,
    );
    expect(screen.getAllByText('Design tokens').length).toBe(1);
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBe(0);
  });
});

describe('ProgressRing', () => {
  it('exposes progressbar semantics with the clamped value', () => {
    render(<ProgressRing value={72} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '72');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders the final sweep offset immediately under reduced motion', () => {
    mockReducedMotion(true);
    const { container } = render(<ProgressRing value={25} size={48} strokeWidth={4} />);
    const value = container.querySelectorAll('circle')[1] as SVGCircleElement;
    const circumference = 2 * Math.PI * 22;
    expect(parseFloat(value.style.strokeDashoffset)).toBeCloseTo(circumference * 0.75, 1);
    expect(value.style.transition).toBe('none');
  });
});

describe('Ripple', () => {
  it('spawns an aria-hidden ripple from pointer down', () => {
    const { container } = render(
      <Ripple>
        <button type="button">go</button>
      </Ripple>,
    );
    fireEvent.pointerDown(screen.getByText('go'), { clientX: 5, clientY: 5 });
    expect(container.querySelectorAll('span[aria-hidden="true"]').length).toBe(1);
  });

  it('spawns nothing under reduced motion', () => {
    mockReducedMotion(true);
    const { container } = render(
      <Ripple>
        <button type="button">go</button>
      </Ripple>,
    );
    fireEvent.pointerDown(screen.getByText('go'), { clientX: 5, clientY: 5 });
    expect(container.querySelectorAll('span[aria-hidden="true"]').length).toBe(0);
  });

  it('caps live ripples at 6 under rapid presses', () => {
    const { container } = render(
      <Ripple>
        <button type="button">go</button>
      </Ripple>,
    );
    for (let i = 0; i < 10; i += 1) {
      fireEvent.pointerDown(screen.getByText('go'), { clientX: 5, clientY: 5 });
    }
    expect(container.querySelectorAll('span[aria-hidden="true"]').length).toBe(6);
  });
});
