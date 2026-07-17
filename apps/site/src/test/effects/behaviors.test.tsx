import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { CardStack } from '@fj-effects/components/CardStack';
import { ClickSpark } from '@fj-effects/components/ClickSpark';
import { Collapse } from '@fj-effects/components/Collapse';
import { Dock } from '@fj-effects/components/Dock';
import { FadeSwitch } from '@fj-effects/components/FadeSwitch';
import { FlipCard } from '@fj-effects/components/FlipCard';
import { NumberTicker } from '@fj-effects/components/NumberTicker';
import { ReorderList } from '@fj-effects/components/ReorderList';
import { WaveText } from '@fj-effects/components/WaveText';
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

describe('FlipCard', () => {
  it('click trigger toggles aria-pressed and swaps which face is aria-hidden', () => {
    render(<FlipCard trigger="click" front={<span>front face</span>} back={<span>back face</span>} />);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('front face').closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'false');
    expect(screen.getByText('back face').closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'true');
    fireEvent.click(card);
    expect(card).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('front face').closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('back face').closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'false');
  });

  it('swaps faces with no transition under reduced motion', () => {
    mockReducedMotion(true);
    render(<FlipCard front={<span>front face</span>} back={<span>back face</span>} />);
    const inner = screen.getByText('front face').closest('[aria-hidden]')!.parentElement as HTMLElement;
    expect(inner.style.transition).toBe('none');
  });

  it('renders only the front face when disabled', () => {
    render(<FlipCard disabled front={<span>front face</span>} back={<span>back face</span>} />);
    expect(screen.getByText('front face')).toBeInTheDocument();
    expect(screen.queryByText('back face')).toBeNull();
  });
});

describe('WaveText', () => {
  it('keeps the full string as aria-label over aria-hidden per-character spans', () => {
    const { container } = render(<WaveText text="joy!" />);
    const root = container.querySelector('[aria-label="joy!"]');
    expect(root).toBeTruthy();
    const wrapper = root!.querySelector('span[aria-hidden="true"]') as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.children.length).toBe(4);
  });

  it('renders the plain string with no character spans under reduced motion', () => {
    mockReducedMotion(true);
    const { container } = render(<WaveText text="joy!" />);
    expect(screen.getByText('joy!')).toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBe(0);
  });
});

describe('ClickSpark', () => {
  it('spawns an aria-hidden burst from pointer down, sparks capped at 12', () => {
    const { container } = render(
      <ClickSpark count={20}>
        <button type="button">go</button>
      </ClickSpark>,
    );
    fireEvent.pointerDown(screen.getByText('go'), { clientX: 5, clientY: 5 });
    const bursts = container.querySelectorAll('span[aria-hidden="true"]');
    expect(bursts.length).toBe(1);
    expect(bursts[0].children.length).toBe(12);
  });

  it('spawns nothing under reduced motion', () => {
    mockReducedMotion(true);
    const { container } = render(
      <ClickSpark>
        <button type="button">go</button>
      </ClickSpark>,
    );
    fireEvent.pointerDown(screen.getByText('go'), { clientX: 5, clientY: 5 });
    expect(container.querySelectorAll('span[aria-hidden="true"]').length).toBe(0);
  });
});

describe('Dock', () => {
  it('keeps item semantics — no child is aria-hidden', () => {
    const { container } = render(
      <Dock>
        <button type="button">a</button>
        <button type="button">b</button>
        <button type="button">c</button>
      </Dock>,
    );
    expect(screen.getAllByRole('button').length).toBe(3);
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBe(0);
  });

  it('caps magnification at 1.6 even when asked for more', () => {
    const { container } = render(
      <Dock magnification={3}>
        <button type="button">a</button>
      </Dock>,
    );
    // jsdom rects are all zeros, so the item center sits under the pointer — peak scale.
    fireEvent.mouseMove(container.firstChild as HTMLElement, { clientX: 0 });
    const wrapper = screen.getByText('a').parentElement as HTMLElement;
    expect(wrapper.style.transform).toBe('scale(1.6)');
  });

  it('never magnifies under reduced motion', () => {
    mockReducedMotion(true);
    const { container } = render(
      <Dock>
        <button type="button">a</button>
      </Dock>,
    );
    fireEvent.mouseMove(container.firstChild as HTMLElement, { clientX: 0 });
    const wrapper = screen.getByText('a').parentElement as HTMLElement;
    expect(wrapper.style.transform).toBe('scale(1)');
  });
});

describe('NumberTicker', () => {
  it('exposes the value as one aria-label over aria-hidden digit columns', () => {
    const { container } = render(<NumberTicker value={42} />);
    const root = container.querySelector('[aria-label="42"]');
    expect(root).toBeTruthy();
    expect(root!.querySelector('span[aria-hidden="true"]')).toBeTruthy();
  });

  it('snaps columns to the target digits with no transition under reduced motion', () => {
    mockReducedMotion(true);
    const { container } = render(<NumberTicker value={42} />);
    const wrapper = container.querySelector('span[aria-hidden="true"]') as HTMLElement;
    const strips = Array.from(wrapper.children).map((cell) => cell.firstChild as HTMLElement);
    expect(strips[0].style.transform).toBe('translateY(-4em)');
    expect(strips[1].style.transform).toBe('translateY(-2em)');
    expect(strips[0].style.transition).toBe('none');
  });

  it('updates the aria-label when the value changes', () => {
    const { container, rerender } = render(<NumberTicker value={7} />);
    rerender(<NumberTicker value={19} />);
    expect(container.querySelector('[aria-label="19"]')).toBeTruthy();
  });
});

describe('CardStack', () => {
  afterEach(() => vi.useRealTimers());

  it('exposes only the top card — the rest are aria-hidden', () => {
    render(
      <CardStack>
        <span>card a</span>
        <span>card b</span>
        <span>card c</span>
      </CardStack>,
    );
    expect(screen.getByText('card a').closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'false');
    expect(screen.getByText('card b').closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('card c').closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('sends the top card to the back on click', () => {
    vi.useFakeTimers();
    render(
      <CardStack duration={500}>
        <span>card a</span>
        <span>card b</span>
      </CardStack>,
    );
    fireEvent.click(screen.getByRole('button'));
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByText('card a').closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('card b').closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'false');
  });

  it('ignores clicks when disabled', () => {
    vi.useFakeTimers();
    render(
      <CardStack disabled>
        <span>card a</span>
        <span>card b</span>
      </CardStack>,
    );
    fireEvent.click(screen.getByText('card a'));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('card a').closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'false');
  });
});

describe('ReorderList', () => {
  it('reorders items in the real DOM order', () => {
    const { container, rerender } = render(
      <ReorderList>
        <span key="a">item a</span>
        <span key="b">item b</span>
      </ReorderList>,
    );
    const texts = () => Array.from((container.firstChild as HTMLElement).children).map((el) => el.textContent);
    expect(texts()).toEqual(['item a', 'item b']);
    rerender(
      <ReorderList>
        <span key="b">item b</span>
        <span key="a">item a</span>
      </ReorderList>,
    );
    expect(texts()).toEqual(['item b', 'item a']);
  });

  it('applies no transform under reduced motion', () => {
    mockReducedMotion(true);
    const { container, rerender } = render(
      <ReorderList>
        <span key="a">item a</span>
        <span key="b">item b</span>
      </ReorderList>,
    );
    rerender(
      <ReorderList>
        <span key="b">item b</span>
        <span key="a">item a</span>
      </ReorderList>,
    );
    const wrappers = Array.from((container.firstChild as HTMLElement).children) as HTMLElement[];
    for (const el of wrappers) {
      expect(el.style.transform).toBe('');
    }
  });
});
