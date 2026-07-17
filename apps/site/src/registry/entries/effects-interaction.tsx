import { ClickSpark, CursorSpotlight, Dock, Magnetic, Ripple, TiltCard, Tactile } from '@fj-effects';
import { Button, Card, Grid, Stack, Text } from '@fj';
import type { ComponentDoc } from '../types';
import { impl } from '../impl';

export const magneticDoc: ComponentDoc = {
  id: 'magnetic',
  name: 'Magnetic',
  category: 'effects-interaction',
  blurb: 'Eases its child toward the cursor when the pointer is near — a tactile pull for a CTA.',
  keywords: ['magnetic', 'cursor', 'hover', 'button', 'interaction'],
  importLine: "import { Magnetic } from '@fj-effects';",
  implementation: impl('magnetic', {
    stylingNeutral:
      'The pull is a transform computed from live cursor math every pointer-move — there is no stylesheet or utility set to switch. CSS and Tailwind show the same source.',
  }),
  controls: [
    { type: 'number', prop: 'strength', defaultValue: 0.3, min: 0.1, max: 0.6, step: 0.05 },
    { type: 'number', prop: 'radius', defaultValue: 120, min: 60, max: 240, step: 20 },
  ],
  render: (v) => (
    <Magnetic strength={Number(v.strength)} radius={Number(v.radius)}>
      <Button size="lg">Get started</Button>
    </Magnetic>
  ),
  code: (v) => `<Magnetic${v.strength !== 0.3 ? ` strength={${Number(v.strength)}}` : ''}${
    v.radius !== 120 ? ` radius={${Number(v.radius)}}` : ''
  }>
  <Button size="lg">Get started</Button>
</Magnetic>`,
  props: [
    { name: 'strength', type: 'number', defaultValue: '0.3', description: 'Pull strength 0–1 (fraction of cursor offset).' },
    { name: 'radius', type: 'number', defaultValue: '120', description: 'Activation radius in px.' },
    { name: 'restDuration', type: 'number', defaultValue: '400', description: 'ms to settle back to rest.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Children unchanged, no pull.' },
  ],
  a11y: [
    'Wraps, but never replaces, a real control — the button inside keeps all its semantics.',
    'Inert under reduced motion and on touch devices; the child still works as a normal button.',
    'The pull is small and springy — never enough to make the target hard to click.',
  ],
};

export const tiltCardDoc: ComponentDoc = {
  id: 'tilt-card',
  name: 'TiltCard',
  category: 'effects-interaction',
  blurb: 'A card that tilts in 3D toward the cursor, with an optional soft glare.',
  keywords: ['tilt', '3d', 'card', 'perspective', 'glare', 'interaction'],
  importLine: "import { TiltCard } from '@fj-effects';",
  implementation: impl('tilt-card', {
    stylingNeutral:
      'The tilt angles track the cursor and are recomputed each pointer-move in JavaScript — there is no stylesheet or utility set to switch. CSS and Tailwind show the same source.',
  }),
  controls: [
    { type: 'number', prop: 'maxTilt', label: 'Max tilt (deg)', defaultValue: 10, min: 4, max: 20, step: 1 },
    { type: 'boolean', prop: 'glare', defaultValue: true },
    { type: 'select', prop: 'performance', options: ['full', 'lite'], defaultValue: 'full' },
  ],
  render: (v) => (
    <TiltCard maxTilt={Number(v.maxTilt)} glare={Boolean(v.glare)} performance={v.performance as 'full' | 'lite'}>
      <Card style={{ width: 240 }}>
        <Stack gap={6}>
          <Text variant="h4" as="h3">
            Flagship
          </Text>
          <Text variant="small">Tilt me with your cursor.</Text>
        </Stack>
      </Card>
    </TiltCard>
  ),
  code: (v) => `<TiltCard${v.maxTilt !== 10 ? ` maxTilt={${Number(v.maxTilt)}}` : ''}${
    v.glare === false ? ' glare={false}' : ''
  }${v.performance !== 'full' ? ` performance="lite"` : ''}>
  <Card>…</Card>
</TiltCard>`,
  props: [
    { name: 'maxTilt', type: 'number', defaultValue: '10', description: 'Max tilt in degrees at the corners.' },
    { name: 'perspective', type: 'number', defaultValue: '800', description: 'CSS perspective in px.' },
    { name: 'glare', type: 'boolean', defaultValue: 'true', description: 'Soft glare that tracks the cursor.' },
    { name: 'scale', type: 'number', defaultValue: '1.02', description: 'Scale on hover.' },
    { name: 'performance', type: '"full" | "lite"', defaultValue: '"full"', description: '"lite" drops the glare layer.' },
  ],
  a11y: [
    'Flat and still under reduced motion or when disabled — no 3D transform at all.',
    'Decorative depth only; keep the card’s content and controls fully usable.',
    'Reserve for one or two flagship cards — a whole grid of tilting cards is noise.',
  ],
};

export const tactileDoc: ComponentDoc = {
  id: 'tactile',
  name: 'Tactile',
  category: 'effects-interaction',
  blurb: 'Adds a satisfying press-down (scale + settle) to any child — buttons, cards, tiles.',
  keywords: ['press', 'tactile', 'active', 'squish', 'interaction'],
  importLine: "import { Tactile } from '@fj-effects';",
  implementation: impl('tactile'),
  controls: [
    { type: 'number', prop: 'scale', defaultValue: 0.96, min: 0.9, max: 0.99, step: 0.01 },
    { type: 'number', prop: 'duration', defaultValue: 120, min: 60, max: 300, step: 20 },
  ],
  render: (v) => (
    <Tactile scale={Number(v.scale)} duration={Number(v.duration)}>
      <Card interactive style={{ width: 200, textAlign: 'center', cursor: 'pointer' }}>
        <Text variant="small">Press me</Text>
      </Card>
    </Tactile>
  ),
  code: (v) => `<Tactile${v.scale !== 0.96 ? ` scale={${Number(v.scale)}}` : ''}>
  <Card interactive>Press me</Card>
</Tactile>`,
  props: [
    { name: 'scale', type: 'number', defaultValue: '0.96', description: 'Scale while pressed.' },
    { name: 'duration', type: 'number', defaultValue: '120', description: 'Press transition in ms.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Children unchanged.' },
  ],
  a11y: [
    'Wraps existing controls; the child keeps its role, focus, and keyboard behavior.',
    'Reduced motion makes the press instant with no scaling.',
    'Works with mouse and touch (pointer up/leave both release).',
  ],
};

export const cursorSpotlightDoc: ComponentDoc = {
  id: 'cursor-spotlight',
  name: 'CursorSpotlight',
  category: 'effects-interaction',
  blurb: 'A soft light that follows the cursor across a container — great behind a grid of cards.',
  keywords: ['cursor', 'spotlight', 'light', 'grid', 'interaction'],
  importLine: "import { CursorSpotlight } from '@fj-effects';",
  implementation: impl('cursor-spotlight'),
  controls: [
    { type: 'number', prop: 'size', defaultValue: 400, min: 160, max: 700, step: 40 },
    { type: 'select', prop: 'performance', options: ['full', 'lite'], defaultValue: 'full' },
  ],
  render: (v) => (
    <CursorSpotlight
      size={Number(v.size)}
      performance={v.performance as 'full' | 'lite'}
      style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}
    >
      <Grid min={120} gap={12}>
        {['Sketches', 'Notes', 'Circles', 'Sets'].map((t) => (
          <Card key={t} style={{ textAlign: 'center' }}>
            <Text variant="small">{t}</Text>
          </Card>
        ))}
      </Grid>
    </CursorSpotlight>
  ),
  code: (v) => `<CursorSpotlight${v.size !== 400 ? ` size={${Number(v.size)}}` : ''}${
    v.performance !== 'full' ? ` performance="lite"` : ''
  }>
  <Grid min={120} gap={12}>{cards}</Grid>
</CursorSpotlight>`,
  props: [
    { name: 'size', type: 'number', defaultValue: '400', description: 'Spotlight diameter in px.' },
    { name: 'color', type: 'string', defaultValue: 'var(--accent-soft)', description: 'Light color.' },
    { name: 'intensity', type: 'number', defaultValue: '1', description: 'Center opacity 0–1.' },
    { name: 'performance', type: '"full" | "lite"', defaultValue: '"full"', description: '"lite" shrinks the light.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'No light.' },
  ],
  a11y: [
    'The light is a single aria-hidden, pointer-transparent layer — content stays fully interactive.',
    'No light under reduced motion or when disabled.',
    'Purely atmospheric; never encode meaning in the spotlight alone.',
  ],
};

export const rippleDoc: ComponentDoc = {
  id: 'ripple',
  name: 'Ripple',
  category: 'effects-interaction',
  blurb: 'A soft ripple expands from the pointer-down point — tactile press feedback for controls.',
  keywords: ['ripple', 'press', 'click', 'feedback', 'interaction'],
  importLine: "import { Ripple } from '@fj-effects';",
  implementation: impl('ripple', {
    stylingNeutral:
      'The ripple expands from the pointer-down coordinates, computed in JavaScript — there is no stylesheet or utility set to switch. CSS and Tailwind show the same source.',
  }),
  controls: [
    { type: 'number', prop: 'duration', defaultValue: 500, min: 300, max: 800, step: 50 },
    { type: 'number', prop: 'intensity', defaultValue: 0.25, min: 0.1, max: 0.5, step: 0.05 },
  ],
  render: (v) => (
    <Ripple duration={Number(v.duration)} intensity={Number(v.intensity)} style={{ borderRadius: 'var(--radius-md)' }}>
      <Button size="lg">Click me</Button>
    </Ripple>
  ),
  code: (v) => `<Ripple${v.duration !== 500 ? ` duration={${Number(v.duration)}}` : ''}${
    v.intensity !== 0.25 ? ` intensity={${Number(v.intensity)}}` : ''
  }>
  <Button size="lg">Click me</Button>
</Ripple>`,
  props: [
    { name: 'color', type: 'string', defaultValue: '"currentColor"', description: 'Ripple color.' },
    { name: 'intensity', type: 'number', defaultValue: '0.25', description: 'Peak ripple opacity 0–1.' },
    { name: 'duration', type: 'number', defaultValue: '500', description: 'Expand-and-fade duration in ms.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Children unchanged, no ripple.' },
  ],
  a11y: [
    'Wraps a real control without touching its semantics — every ripple node is aria-hidden and pointer-transparent.',
    'No ripple ever spawns under reduced motion; the child’s own press state carries the feedback.',
    'Match the wrapper’s borderRadius to the control (via style) so the ripple clips to its shape.',
  ],
};

export const clickSparkDoc: ComponentDoc = {
  id: 'click-spark',
  name: 'ClickSpark',
  category: 'effects-interaction',
  blurb: 'Tiny spark lines radiate from the pointer on click — a wink of delight for buttons and likes.',
  keywords: ['click', 'spark', 'burst', 'celebrate', 'press', 'interaction'],
  importLine: "import { ClickSpark } from '@fj-effects';",
  implementation: impl('click-spark', {
    stylingNeutral:
      'Spark geometry is computed from the pointer position in JavaScript — there is no stylesheet or utility set to switch. CSS and Tailwind show the same source.',
  }),
  controls: [
    { type: 'number', prop: 'count', defaultValue: 8, min: 4, max: 12, step: 1 },
    { type: 'number', prop: 'radius', defaultValue: 24, min: 12, max: 48, step: 4 },
    { type: 'number', prop: 'duration', defaultValue: 500, min: 300, max: 900, step: 50 },
  ],
  render: (v) => (
    <ClickSpark count={Number(v.count)} radius={Number(v.radius)} duration={Number(v.duration)}>
      <Button>Click me</Button>
    </ClickSpark>
  ),
  code: (v) => `<ClickSpark${v.count !== 8 ? ` count={${Number(v.count)}}` : ''}${
    v.radius !== 24 ? ` radius={${Number(v.radius)}}` : ''
  }${v.duration !== 500 ? ` duration={${Number(v.duration)}}` : ''}>
  <Button>Click me</Button>
</ClickSpark>`,
  props: [
    { name: 'count', type: 'number', defaultValue: '8', description: 'Spark lines per burst (capped at 12).' },
    { name: 'color', type: 'string', defaultValue: 'var(--joy-500)', description: 'Spark color (FJ token or CSS color).' },
    { name: 'radius', type: 'number', defaultValue: '24', description: 'Travel radius in px.' },
    { name: 'duration', type: 'number', defaultValue: '500', description: 'Spark lifetime in ms.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'No sparks, children unchanged.' },
  ],
  a11y: [
    'Sparks live in an aria-hidden, pointer-transparent overlay — the wrapped control keeps its own semantics and focus.',
    'Reduced motion spawns nothing; the click still lands on the child.',
    'Bursts are capped and self-clean when the animation ends, so rapid clicking never accumulates DOM.',
  ],
};

const DOCK_ITEMS = [
  { icon: '✏️', label: 'Sketch' },
  { icon: '🎨', label: 'Paint' },
  { icon: '📷', label: 'Photos' },
  { icon: '🎧', label: 'Sounds' },
  { icon: '🌱', label: 'Garden' },
];

export const dockDoc: ComponentDoc = {
  id: 'dock',
  name: 'Dock',
  category: 'effects-interaction',
  blurb: 'A row of items that swell as the pointer sweeps near — dock magnification for launchers.',
  keywords: ['dock', 'magnify', 'hover', 'toolbar', 'launcher', 'interaction'],
  importLine: "import { Dock } from '@fj-effects';",
  implementation: impl('dock', {
    stylingNeutral:
      'Per-item scale is computed from pointer proximity in JavaScript — there is no stylesheet or utility set to switch. CSS and Tailwind show the same source.',
  }),
  controls: [
    { type: 'number', prop: 'magnification', defaultValue: 1.35, min: 1.1, max: 1.6, step: 0.05 },
    { type: 'number', prop: 'radius', defaultValue: 80, min: 40, max: 140, step: 10 },
    { type: 'number', prop: 'gap', defaultValue: 8, min: 4, max: 16, step: 2 },
  ],
  render: (v) => (
    <Dock magnification={Number(v.magnification)} radius={Number(v.radius)} gap={Number(v.gap)}>
      {DOCK_ITEMS.map((item) => (
        <Button key={item.label} variant="ghost" aria-label={item.label} style={{ fontSize: 22 }}>
          {item.icon}
        </Button>
      ))}
    </Dock>
  ),
  code: (v) => `<Dock${v.magnification !== 1.35 ? ` magnification={${Number(v.magnification)}}` : ''}${
    v.radius !== 80 ? ` radius={${Number(v.radius)}}` : ''
  }${v.gap !== 8 ? ` gap={${Number(v.gap)}}` : ''}>
  {apps.map((app) => (
    <Button key={app.id} variant="ghost" aria-label={app.name}>{app.icon}</Button>
  ))}
</Dock>`,
  props: [
    { name: 'children', type: 'ReactNode', description: 'Dock items — each child gets proximity scaling.' },
    { name: 'magnification', type: 'number', defaultValue: '1.35', description: 'Peak scale for the item under the pointer (capped at 1.6).' },
    { name: 'radius', type: 'number', defaultValue: '80', description: 'Pointer influence radius in px.' },
    { name: 'restDuration', type: 'number', defaultValue: '300', description: 'ms for items to settle when the pointer leaves.' },
    { name: 'gap', type: 'number', defaultValue: '8', description: 'Gap between items in px.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Static row, no magnification.' },
  ],
  a11y: [
    'Items keep their own semantics, focus, and tab order — magnification is a transform-only wrapper.',
    'Keyboard focus never triggers magnification, so nothing moves under a keyboard user.',
    'Reduced motion renders a plain static row; pointer proximity does nothing.',
  ],
};
