import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Collapse } from '@fj-effects/components/Collapse';
import { FadeSwitch } from '@fj-effects/components/FadeSwitch';
import { SuccessCheck } from '@fj-effects/components/SuccessCheck';
import { Sparkles } from '@fj-effects/components/Sparkles';

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
