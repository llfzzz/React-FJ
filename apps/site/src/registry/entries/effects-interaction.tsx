import { CursorSpotlight, Magnetic, TiltCard, Tactile } from '@fj-effects';
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
