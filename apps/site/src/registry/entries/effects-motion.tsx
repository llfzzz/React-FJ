import { useRef, useState } from 'react';
import { Collapse, FadeSwitch, ReorderList, ScrollProgress, StaggerList, ThemeTransition } from '@fj-effects';
import { Button, Card, Grid, Stack, Text } from '@fj';
import type { ComponentDoc, ControlValues } from '../types';
import { impl } from '../impl';

const replayKey = (values: ControlValues) => JSON.stringify(values);

export const staggerListDoc: ComponentDoc = {
  id: 'stagger-list',
  name: 'StaggerList',
  category: 'anim-entrance',
  addedAt: '2026-07-04',
  blurb: 'Reveals its children one after another as the list scrolls into view.',
  keywords: ['stagger', 'list', 'grid', 'scroll', 'entrance', 'motion'],
  importLine: "import { StaggerList } from '@fj-effects';",
  implementation: impl('stagger-list'),
  replayable: true,
  controls: [
    { type: 'number', prop: 'stagger', label: 'ms / item', defaultValue: 60, min: 20, max: 180, step: 20 },
    { type: 'select', prop: 'from', options: ['up', 'fade', 'scale'], defaultValue: 'up' },
  ],
  render: (v) => (
    <span key={replayKey(v)} style={{ width: '100%' }}>
      <StaggerList stagger={Number(v.stagger)} from={v.from as 'up' | 'fade' | 'scale'}>
        <Grid min={120} gap={12}>
          {['Sketches', 'Notes', 'Circles', 'Sets', 'Drafts', 'Archive'].map((t) => (
            <Card key={t} style={{ textAlign: 'center' }}>
              <Text variant="small">{t}</Text>
            </Card>
          ))}
        </Grid>
      </StaggerList>
    </span>
  ),
  code: (v) => `<StaggerList${v.stagger !== 60 ? ` stagger={${Number(v.stagger)}}` : ''}${
    v.from !== 'up' ? ` from="${String(v.from)}"` : ''
  }>
  {items.map((item) => <Card key={item}>{item}</Card>)}
</StaggerList>`,
  props: [
    { name: 'stagger', type: 'number', defaultValue: '60', description: 'Per-child delay in ms.' },
    { name: 'duration', type: 'number', defaultValue: '480', description: 'Per-child duration in ms.' },
    { name: 'from', type: '"up" | "fade" | "scale"', defaultValue: '"up"', description: 'Entry style.' },
    { name: 'initialDelay', type: 'number', defaultValue: '0', description: 'Delay before the first child in ms.' },
    { name: 'as', type: 'ElementType', defaultValue: '"div"', description: 'Container tag/element.' },
  ],
  a11y: [
    'Only transform/opacity animate, so there’s no layout shift as items appear.',
    'Under reduced motion (or disabled) every child appears at once.',
    'Content is present in the DOM from the start — the effect only delays its reveal.',
  ],
};

export const scrollProgressDoc: ComponentDoc = {
  id: 'scroll-progress',
  name: 'ScrollProgress',
  category: 'anim-entrance',
  addedAt: '2026-07-04',
  blurb: 'A thin reading-progress bar that fills as the page (or a container) scrolls.',
  keywords: ['scroll', 'progress', 'reading', 'bar', 'indicator'],
  importLine: "import { ScrollProgress } from '@fj-effects';",
  implementation: impl('scroll-progress'),
  controls: [
    { type: 'number', prop: 'height', defaultValue: 3, min: 2, max: 8, step: 1 },
    { type: 'select', prop: 'position', options: ['top', 'bottom'], defaultValue: 'top' },
  ],
  render: (v) => <ScrollProgressDemo height={Number(v.height)} position={v.position as 'top' | 'bottom'} />,
  code: (v) => `// Pin to the viewport (default) — mount once near your app root:
<ScrollProgress${v.height !== 3 ? ` height={${Number(v.height)}}` : ''}${
    v.position !== 'top' ? ` position="bottom"` : ''
  } />

// Or track a scrollable container via a ref:
<ScrollProgress target={scrollRef} />`,
  props: [
    { name: 'height', type: 'number', defaultValue: '3', description: 'Bar thickness in px.' },
    { name: 'color', type: 'string', defaultValue: 'var(--accent)', description: 'Bar color.' },
    { name: 'position', type: '"top" | "bottom"', defaultValue: '"top"', description: 'Edge to pin the bar to.' },
    { name: 'target', type: 'RefObject<HTMLElement>', description: 'Track a container instead of the window.' },
    { name: 'zIndex', type: 'number | string', defaultValue: 'var(--z-sticky)', description: 'Stacking order.' },
  ],
  a11y: [
    'Exposes role="progressbar" with aria-valuenow so the position is announced.',
    'It reflects scroll position rather than being a decorative loop, so it stays on under reduced motion.',
    'Scales only on the X axis — no layout or reflow as it fills.',
  ],
};

export const fadeSwitchDoc: ComponentDoc = {
  id: 'fade-switch',
  name: 'FadeSwitch',
  category: 'anim-transition',
  addedAt: '2026-07-04',
  blurb: 'Crossfades between content when a key changes — tab panels, steps, rotating quotes.',
  keywords: ['fade', 'switch', 'crossfade', 'transition', 'tabs'],
  importLine: "import { FadeSwitch } from '@fj-effects';",
  implementation: impl('fade-switch', {
    stylingNeutral:
      'Crossfading keyed children is React state and the fade is animated inline — there is no stylesheet or utility set to switch. CSS and Tailwind show the same source.',
  }),
  controls: [
    { type: 'select', prop: 'mode', options: ['fade', 'slide-up', 'scale'], defaultValue: 'fade' },
    { type: 'number', prop: 'duration', defaultValue: 300, min: 120, max: 600, step: 40 },
  ],
  render: (v) => <FadeSwitchDemo mode={v.mode as 'fade' | 'slide-up' | 'scale'} duration={Number(v.duration)} />,
  code: (v) => `const [tab, setTab] = useState('sketches');

<FadeSwitch switchKey={tab}${v.mode !== 'fade' ? ` mode="${String(v.mode)}"` : ''}>
  {panelFor(tab)}
</FadeSwitch>`,
  props: [
    { name: 'switchKey', type: 'string | number', description: 'Changing this crossfades to the new children.' },
    { name: 'mode', type: '"fade" | "slide-up" | "scale"', defaultValue: '"fade"', description: 'Transition style.' },
    { name: 'duration', type: 'number', defaultValue: '300', description: 'Transition duration in ms.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Swap instantly, no crossfade.' },
  ],
  a11y: [
    'Keeps a stable footprint so swapping content doesn’t jump the layout.',
    'Instant swap under reduced motion or when disabled.',
    'Drive it from real state (the selected tab/step); the effect is purely visual.',
  ],
};

export const collapseDoc: ComponentDoc = {
  id: 'collapse',
  name: 'Collapse',
  category: 'anim-transition',
  addedAt: '2026-07-04',
  blurb: 'Smoothly expands and collapses to its content’s natural height — accordions, panels.',
  keywords: ['collapse', 'accordion', 'expand', 'height', 'disclosure'],
  importLine: "import { Collapse } from '@fj-effects';",
  implementation: impl('collapse'),
  controls: [
    { type: 'number', prop: 'duration', defaultValue: 280, min: 120, max: 600, step: 40 },
    { type: 'select', prop: 'easing', options: ['out', 'in-out', 'emphasized'], defaultValue: 'out' },
  ],
  render: (v) => <CollapseDemo duration={Number(v.duration)} easing={v.easing as 'out' | 'in-out' | 'emphasized'} />,
  code: (v) => `const [open, setOpen] = useState(false);

<button onClick={() => setOpen(!open)}>Details</button>
<Collapse open={open}${v.duration !== 280 ? ` duration={${Number(v.duration)}}` : ''}>
  <p>Hidden until you expand it.</p>
</Collapse>`,
  props: [
    { name: 'open', type: 'boolean', description: 'Whether the content is expanded.' },
    { name: 'duration', type: 'number', defaultValue: '280', description: 'Transition duration in ms.' },
    { name: 'easing', type: 'EasingToken', defaultValue: '"out"', description: 'FJ easing token.' },
    { name: 'unmountOnExit', type: 'boolean', defaultValue: 'false', description: 'Remove children from the DOM when closed.' },
  ],
  a11y: [
    'Pair the trigger with aria-expanded and aria-controls pointing at the panel.',
    'Collapsed content is aria-hidden; under reduced motion it snaps with no travel.',
    'Height animates from a measured value, so there’s no jump to/from auto.',
  ],
};

export const themeTransitionDoc: ComponentDoc = {
  id: 'theme-transition',
  name: 'ThemeTransition',
  category: 'anim-transition',
  addedAt: '2026-07-04',
  blurb: 'A gentle crossfade when the theme flips — via the View Transitions API in production.',
  keywords: ['theme', 'transition', 'dark mode', 'crossfade', 'view-transition'],
  importLine: "import { ThemeTransition, runThemeTransition } from '@fj-effects';",
  implementation: impl('theme-transition'),
  controls: [{ type: 'number', prop: 'duration', defaultValue: 320, min: 120, max: 700, step: 40 }],
  render: (v) => (
    <ThemeTransition
      duration={Number(v.duration)}
      // The site is light-only; this class scopes a tiny ink/paper "dark" look
      // to the demo box (site.css) so the crossfade is actually visible.
      className="theme-transition-demo"
      style={{ padding: 'var(--space-6)', border: '1px solid var(--border)', minWidth: 240, textAlign: 'center' }}
    >
      <Stack gap={6} align="center">
        <Text variant="h4" as="p">
          Tap to flip theme
        </Text>
        <Text variant="small">This box crossfades light ⇄ dark.</Text>
      </Stack>
    </ThemeTransition>
  ),
  code: () => `// In production, wire the crossfade into your real theme toggle:
import { runThemeTransition } from '@fj-effects';

function toggleTheme() {
  runThemeTransition(() => {
    const el = document.documentElement;
    el.dataset.theme = el.dataset.theme === 'dark' ? 'light' : 'dark';
  });
}`,
  props: [
    { name: 'duration', type: 'number', defaultValue: '320', description: 'Crossfade duration in ms.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Instant swap, no crossfade.' },
    { name: 'runThemeTransition', type: '(update: () => void) => void', description: 'Helper: run a DOM update inside a View-Transitions crossfade (progressive enhancement).' },
  ],
  a11y: [
    'runThemeTransition always applies the update — the crossfade is progressive enhancement only.',
    'Falls back to an instant swap under reduced motion or where View Transitions are unsupported.',
    'The demo box is a real button (Enter/Space) with a visible label.',
  ],
};

export const reorderListDoc: ComponentDoc = {
  id: 'reorder-list',
  name: 'ReorderList',
  category: 'anim-transition',
  addedAt: '2026-07-17',
  status: 'new',
  blurb: 'Glides items from their old spot to the new one when the order changes — sorting, ranking, filters.',
  keywords: ['reorder', 'flip', 'sort', 'list', 'move', 'motion'],
  importLine: "import { ReorderList } from '@fj-effects';",
  implementation: impl('reorder-list', {
    stylingNeutral:
      'The move is measured and inverted per item in JavaScript (the FLIP technique) — there is no stylesheet or utility set to switch. CSS and Tailwind show the same source.',
  }),
  controls: [{ type: 'number', prop: 'duration', defaultValue: 400, min: 200, max: 800, step: 50 }],
  render: (v) => <ReorderListDemo duration={Number(v.duration)} />,
  code: (v) => `const [items, setItems] = useState(loaded);

<ReorderList${v.duration !== 400 ? ` duration={${Number(v.duration)}}` : ''}>
  {items.map((item) => <Card key={item.id}>{item.title}</Card>)}
</ReorderList>`,
  props: [
    { name: 'children', type: 'ReactNode', description: 'The items; each child needs a stable key for FLIP tracking.' },
    { name: 'duration', type: 'number', defaultValue: '400', description: 'ms per position transition.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Reorder instantly, no travel.' },
  ],
  a11y: [
    'The DOM order is always the real order — transforms only bridge old → new visually, so screen readers and the tab order are never stale.',
    'Reduced motion (or disabled) snaps items to their new positions instantly.',
    'Transform-only motion: items glide without reflow, and surrounding layout never shifts.',
  ],
};

// ---- Local interactive demos ----

function ScrollProgressDemo({ height, position }: { height: number; position: 'top' | 'bottom' }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={scrollRef}
      style={{ position: 'relative', width: '100%', maxHeight: 200, overflow: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
    >
      <ScrollProgress height={height} position={position} target={scrollRef} />
      <div style={{ padding: 'var(--space-4)' }}>
        <Text variant="small">Scroll this box — the bar tracks its progress.</Text>
        <div style={{ height: 400, display: 'grid', placeItems: 'center', color: 'var(--text-subtle)' }}>↓ keep scrolling ↓</div>
        <Text variant="small">You reached the end.</Text>
      </div>
    </div>
  );
}

function FadeSwitchDemo({ mode, duration }: { mode: 'fade' | 'slide-up' | 'scale'; duration: number }) {
  const panels: Record<string, string> = {
    sketches: 'Loose ideas, captured fast.',
    notes: 'Words to go with the work.',
    circles: 'The people you share with.',
  };
  const [tab, setTab] = useState('sketches');
  return (
    <Stack gap={12} align="center">
      <Stack direction="row" gap={8}>
        {Object.keys(panels).map((k) => (
          <Button key={k} variant={k === tab ? 'primary' : 'ghost'} size="sm" onClick={() => setTab(k)}>
            {k}
          </Button>
        ))}
      </Stack>
      <FadeSwitch switchKey={tab} mode={mode} duration={duration} style={{ minHeight: 40 }}>
        <Text variant="body" as="p">
          {panels[tab]}
        </Text>
      </FadeSwitch>
    </Stack>
  );
}

function ReorderListDemo({ duration }: { duration: number }) {
  const [items, setItems] = useState(['Sketches', 'Notes', 'Circles', 'Sets']);
  const shuffle = () =>
    setItems((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      // A no-op shuffle would look broken — rotate instead so something moves.
      return next.every((t, i) => t === prev[i]) ? [...prev.slice(1), prev[0]] : next;
    });
  return (
    <Stack gap={12} align="center">
      <Button variant="secondary" size="sm" onClick={shuffle}>
        Shuffle
      </Button>
      <ReorderList duration={duration} style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200 }}>
        {items.map((t) => (
          <Card key={t}>
            <Text variant="small">{t}</Text>
          </Card>
        ))}
      </ReorderList>
    </Stack>
  );
}

function CollapseDemo({ duration, easing }: { duration: number; easing: 'out' | 'in-out' | 'emphasized' }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ width: 320 }}>
      <Button variant="secondary" full onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? 'Hide details' : 'Show details'}
      </Button>
      <Collapse open={open} duration={duration} easing={easing}>
        <Card style={{ marginTop: 10 }}>
          <Text variant="small">
            Free Joy keeps disclosure gentle — the panel eases to its natural height so nothing jumps.
          </Text>
        </Card>
      </Collapse>
    </div>
  );
}
