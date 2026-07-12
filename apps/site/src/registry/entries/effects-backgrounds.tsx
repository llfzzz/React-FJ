import type { CSSProperties } from 'react';
import { Aurora, ConfettiBurst, GridPattern, NoiseOverlay, Orbs, Sparkles, Waves } from '@fj-effects';
import { Button, Text } from '@fj';
import type { ComponentDoc, ControlValues } from '../types';
import { impl } from '../impl';

const replayKey = (values: ControlValues) => JSON.stringify(values);

const heroBox: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  minHeight: 180,
  width: '100%',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-6)',
};

export const auroraDoc: ComponentDoc = {
  id: 'aurora',
  name: 'Aurora',
  category: 'effects-backgrounds',
  blurb: 'Slow, soft aurora ribbons behind hero content — heroes and section headers only.',
  keywords: ['aurora', 'background', 'gradient', 'hero', 'ambient'],
  importLine: "import { Aurora } from '@fj-effects';",
  implementation: impl('aurora'),
  replayable: true,
  controls: [
    { type: 'select', prop: 'variant', options: ['warm', 'cool', 'joy'], defaultValue: 'warm' },
    { type: 'number', prop: 'speed', defaultValue: 1, min: 0.5, max: 2, step: 0.1 },
    { type: 'select', prop: 'performance', options: ['full', 'lite'], defaultValue: 'full' },
  ],
  render: (v) => (
    <span key={replayKey(v)} style={{ width: '100%' }}>
      <Aurora
        variant={v.variant as 'warm' | 'cool' | 'joy'}
        speed={Number(v.speed)}
        performance={v.performance as 'full' | 'lite'}
        style={heroBox}
      >
        <Text variant="h3" as="p">
          Made with joy
        </Text>
      </Aurora>
    </span>
  ),
  code: (v) => `<Aurora${v.variant !== 'warm' ? ` variant="${String(v.variant)}"` : ''}${
    v.speed !== 1 ? ` speed={${Number(v.speed)}}` : ''
  }${v.performance !== 'full' ? ` performance="lite"` : ''}>
  <h1>Made with joy</h1>
</Aurora>`,
  props: [
    { name: 'variant', type: '"warm" | "cool" | "joy"', defaultValue: '"warm"', description: 'Ribbon palette.' },
    { name: 'speed', type: 'number', defaultValue: '1', description: 'Speed multiplier.' },
    { name: 'opacity', type: 'number', defaultValue: '0.5', description: 'Ribbon opacity 0–1.' },
    { name: 'blur', type: 'number', defaultValue: '60', description: 'Blur radius in px (capped in "lite").' },
    { name: 'performance', type: '"full" | "lite"', defaultValue: '"full"', description: '"lite" lowers blur + simplifies motion.' },
  ],
  a11y: [
    'Ribbons are aria-hidden and pointer-transparent; content sits above them.',
    'Static under reduced motion — the wash remains, the drift stops.',
    'Heroes and section headers only; keep text contrast AA over the wash.',
  ],
};

export const gridPatternDoc: ComponentDoc = {
  id: 'grid-pattern',
  name: 'GridPattern',
  category: 'effects-backgrounds',
  blurb: 'A subtle dot or line grid with a radial fade — a quiet, static background texture.',
  keywords: ['grid', 'dots', 'pattern', 'background', 'texture'],
  importLine: "import { GridPattern } from '@fj-effects';",
  implementation: impl('grid-pattern'),
  controls: [
    { type: 'select', prop: 'type', options: ['dot', 'line'], defaultValue: 'dot' },
    { type: 'number', prop: 'size', defaultValue: 24, min: 12, max: 48, step: 4 },
    { type: 'boolean', prop: 'fade', defaultValue: true },
  ],
  render: (v) => (
    <GridPattern
      type={v.type as 'dot' | 'line'}
      size={Number(v.size)}
      fade={Boolean(v.fade)}
      style={{ ...heroBox, border: '1px solid var(--border)' }}
    >
      <Text variant="h4" as="p">
        Section background
      </Text>
    </GridPattern>
  ),
  code: (v) => `<GridPattern${v.type !== 'dot' ? ` type="line"` : ''}${
    v.size !== 24 ? ` size={${Number(v.size)}}` : ''
  }${v.fade === false ? ' fade={false}' : ''}>
  <section>…</section>
</GridPattern>`,
  props: [
    { name: 'type', type: '"dot" | "line"', defaultValue: '"dot"', description: 'Dot grid or line grid.' },
    { name: 'size', type: 'number', defaultValue: '24', description: 'Cell size in px.' },
    { name: 'opacity', type: 'number', defaultValue: '0.5', description: 'Pattern opacity 0–1.' },
    { name: 'fade', type: 'boolean', defaultValue: 'true', description: 'Radial fade mask so edges dissolve.' },
    { name: 'color', type: 'string', defaultValue: 'var(--border)', description: 'Line/dot color.' },
  ],
  a11y: [
    'Fully static and decorative — no motion, no reduced-motion concern.',
    'The pattern is aria-hidden and pointer-transparent.',
    'Keep opacity low so foreground text stays crisp.',
  ],
};

export const noiseOverlayDoc: ComponentDoc = {
  id: 'noise-overlay',
  name: 'NoiseOverlay',
  category: 'effects-backgrounds',
  blurb: 'A fine, static film-grain overlay that adds tactile texture to flat surfaces.',
  keywords: ['noise', 'grain', 'texture', 'film', 'background'],
  importLine: "import { NoiseOverlay } from '@fj-effects';",
  implementation: impl('noise-overlay'),
  controls: [
    { type: 'number', prop: 'opacity', defaultValue: 0.04, min: 0.01, max: 0.15, step: 0.01 },
    { type: 'select', prop: 'blend', options: ['overlay', 'soft-light', 'normal'], defaultValue: 'overlay' },
  ],
  render: (v) => (
    <NoiseOverlay
      opacity={Number(v.opacity)}
      blend={v.blend as CSSProperties['mixBlendMode']}
      style={{ ...heroBox, background: 'linear-gradient(120deg, var(--joy-100), var(--bloom-100))' }}
    >
      <Text variant="h4" as="p">
        Textured surface
      </Text>
    </NoiseOverlay>
  ),
  code: (v) => `<NoiseOverlay${v.opacity !== 0.04 ? ` opacity={${Number(v.opacity)}}` : ''}${
    v.blend !== 'overlay' ? ` blend="${String(v.blend)}"` : ''
  }>
  <section>…</section>
</NoiseOverlay>`,
  props: [
    { name: 'opacity', type: 'number', defaultValue: '0.04', description: 'Grain opacity 0–1.' },
    { name: 'blend', type: 'MixBlendMode', defaultValue: '"overlay"', description: 'Blend mode for the grain.' },
    { name: 'scale', type: 'number', defaultValue: '120', description: 'Grain tile scale in px.' },
  ],
  a11y: [
    'Static, decorative, aria-hidden — no motion at all.',
    'The grain is an inline SVG data URI, so there’s no network request.',
    'Keep opacity ≤ ~0.06 so it never harms text legibility.',
  ],
};

export const sparklesDoc: ComponentDoc = {
  id: 'sparkles',
  name: 'Sparkles',
  category: 'effects-backgrounds',
  blurb: 'A capped scatter of gently twinkling particles behind hero content (≤ 24 nodes).',
  keywords: ['sparkles', 'particles', 'twinkle', 'hero', 'background'],
  importLine: "import { Sparkles } from '@fj-effects';",
  implementation: impl('sparkles', {
    stylingNeutral:
      'Particles are scattered at random positions computed in JavaScript — there is no stylesheet or utility set to switch. CSS and Tailwind show the same source.',
  }),
  replayable: true,
  controls: [
    { type: 'number', prop: 'count', defaultValue: 14, min: 4, max: 24, step: 2 },
    { type: 'number', prop: 'speed', defaultValue: 1, min: 0.5, max: 2, step: 0.1 },
    { type: 'select', prop: 'performance', options: ['full', 'lite'], defaultValue: 'full' },
  ],
  render: (v) => (
    <span key={replayKey(v)} style={{ width: '100%' }}>
      <Sparkles
        count={Number(v.count)}
        speed={Number(v.speed)}
        performance={v.performance as 'full' | 'lite'}
        style={{ ...heroBox, background: 'var(--paper-2)' }}
      >
        <Text variant="h3" as="p">
          ✦ Featured ✦
        </Text>
      </Sparkles>
    </span>
  ),
  code: (v) => `<Sparkles${v.count !== 14 ? ` count={${Number(v.count)}}` : ''}${
    v.speed !== 1 ? ` speed={${Number(v.speed)}}` : ''
  }${v.performance !== 'full' ? ` performance="lite"` : ''}>
  <h2>Featured</h2>
</Sparkles>`,
  props: [
    { name: 'count', type: 'number', defaultValue: '14', description: 'Particle count (capped at 24; "lite" halves it).' },
    { name: 'sizeRange', type: '[number, number]', defaultValue: '[2, 5]', description: 'Min/max particle size in px.' },
    { name: 'colors', type: 'string[]', defaultValue: 'sun/coral/bloom', description: 'Particle colors.' },
    { name: 'speed', type: 'number', defaultValue: '1', description: 'Speed multiplier.' },
    { name: 'performance', type: '"full" | "lite"', defaultValue: '"full"', description: '"lite" halves the count.' },
  ],
  a11y: [
    'DOM nodes are hard-capped at 24 so the effect stays cheap; particles are aria-hidden.',
    'Renders nothing under reduced motion or when disabled.',
    'Atmospheric only — reserve for hero/feature surfaces, never dense UI.',
  ],
};

export const confettiBurstDoc: ComponentDoc = {
  id: 'confetti-burst',
  name: 'ConfettiBurst',
  category: 'effects-backgrounds',
  blurb: 'A one-shot celebration burst for success moments — pieces are capped and auto-clean.',
  keywords: ['confetti', 'celebration', 'success', 'burst', 'particles'],
  importLine: "import { ConfettiBurst } from '@fj-effects';",
  implementation: impl('confetti-burst', {
    stylingNeutral:
      'Each burst generates pieces with randomized trajectories in JavaScript, then removes them — there is no stylesheet or utility set to switch. CSS and Tailwind show the same source.',
  }),
  controls: [
    { type: 'number', prop: 'count', defaultValue: 28, min: 8, max: 40, step: 4 },
    { type: 'number', prop: 'spread', defaultValue: 90, min: 40, max: 160, step: 10 },
  ],
  render: (v) => (
    <ConfettiBurst trigger="click" count={Number(v.count)} spread={Number(v.spread)}>
      <Button>Tap to celebrate 🎉</Button>
    </ConfettiBurst>
  ),
  code: (v) => `<ConfettiBurst trigger="click"${v.count !== 28 ? ` count={${Number(v.count)}}` : ''}${
    v.spread !== 90 ? ` spread={${Number(v.spread)}}` : ''
  }>
  <Button>Celebrate</Button>
</ConfettiBurst>`,
  props: [
    { name: 'trigger', type: '"click" | "mount" | "manual"', defaultValue: '"click"', description: 'How the burst fires.' },
    { name: 'active', type: 'boolean', description: 'Controlled fire (false→true) for trigger="manual".' },
    { name: 'count', type: 'number', defaultValue: '28', description: 'Piece count (capped at 40; "lite" at 20).' },
    { name: 'spread', type: 'number', defaultValue: '90', description: 'Spread radius in px.' },
    { name: 'onDone', type: '() => void', description: 'Called when the burst finishes.' },
  ],
  a11y: [
    'Purely celebratory — never the sole signal of success; pair with a message.',
    'Suppressed entirely under reduced motion (children still render, onDone still fires).',
    'Pieces are capped and removed after the fall, so nothing accumulates.',
  ],
};

export const orbsDoc: ComponentDoc = {
  id: 'orbs',
  name: 'Orbs',
  category: 'effects-backgrounds',
  blurb: 'Soft gradient blobs drifting slowly behind hero content — a rounder, calmer Aurora.',
  keywords: ['orbs', 'blobs', 'gradient', 'background', 'ambient', 'hero'],
  importLine: "import { Orbs } from '@fj-effects';",
  implementation: impl('orbs'),
  replayable: true,
  controls: [
    { type: 'number', prop: 'count', defaultValue: 3, min: 1, max: 6, step: 1 },
    { type: 'number', prop: 'speed', defaultValue: 1, min: 0.5, max: 2, step: 0.1 },
    { type: 'select', prop: 'performance', options: ['full', 'lite'], defaultValue: 'full' },
  ],
  render: (v) => (
    <span key={replayKey(v)} style={{ width: '100%' }}>
      <Orbs
        count={Number(v.count)}
        speed={Number(v.speed)}
        performance={v.performance as 'full' | 'lite'}
        style={heroBox}
      >
        <Text variant="h3" as="p">
          Ambient by default
        </Text>
      </Orbs>
    </span>
  ),
  code: (v) => `<Orbs${v.count !== 3 ? ` count={${Number(v.count)}}` : ''}${
    v.speed !== 1 ? ` speed={${Number(v.speed)}}` : ''
  }${v.performance !== 'full' ? ` performance="lite"` : ''}>
  <h1>Ambient by default</h1>
</Orbs>`,
  props: [
    { name: 'count', type: 'number', defaultValue: '3', description: 'Orb count (capped at 6; "lite" caps at 3).' },
    { name: 'colors', type: 'string[]', defaultValue: 'joy/bloom/sun', description: 'Orb colors (FJ tokens or CSS colors).' },
    { name: 'size', type: 'number', defaultValue: '240', description: 'Base orb diameter in px (±30% variance).' },
    { name: 'speed', type: 'number', defaultValue: '1', description: 'Speed multiplier.' },
    { name: 'opacity', type: 'number', defaultValue: '0.5', description: 'Orb opacity 0–1.' },
    { name: 'performance', type: '"full" | "lite"', defaultValue: '"full"', description: '"lite" caps count at 3 and blur at 24.' },
  ],
  a11y: [
    'Orbs are aria-hidden and pointer-transparent; content sits above the wash.',
    'Static under reduced motion — the wash remains, the drift stops (unlike Sparkles, nothing disappears).',
    'Heroes and section headers only; keep text contrast AA over the wash.',
  ],
};

export const wavesDoc: ComponentDoc = {
  id: 'waves',
  name: 'Waves',
  category: 'effects-backgrounds',
  blurb: 'Slow wave lines drifting across the container’s bottom edge — heroes and footers.',
  keywords: ['waves', 'lines', 'water', 'background', 'ambient', 'footer'],
  importLine: "import { Waves } from '@fj-effects';",
  implementation: impl('waves'),
  replayable: true,
  controls: [
    { type: 'number', prop: 'layers', defaultValue: 3, min: 1, max: 4, step: 1 },
    { type: 'number', prop: 'amplitude', defaultValue: 14, min: 6, max: 24, step: 2 },
    { type: 'number', prop: 'speed', defaultValue: 1, min: 0.5, max: 2, step: 0.1 },
    { type: 'select', prop: 'performance', options: ['full', 'lite'], defaultValue: 'full' },
  ],
  render: (v) => (
    <span key={replayKey(v)} style={{ width: '100%' }}>
      <Waves
        layers={Number(v.layers)}
        amplitude={Number(v.amplitude)}
        speed={Number(v.speed)}
        performance={v.performance as 'full' | 'lite'}
        style={{ ...heroBox, alignItems: 'start', paddingBottom: 'var(--space-10)' }}
      >
        <Text variant="h4" as="p">
          Calm under the surface
        </Text>
      </Waves>
    </span>
  ),
  code: (v) => `<Waves${v.layers !== 3 ? ` layers={${Number(v.layers)}}` : ''}${
    v.amplitude !== 14 ? ` amplitude={${Number(v.amplitude)}}` : ''
  }${v.performance !== 'full' ? ` performance="lite"` : ''}>
  <footer>…</footer>
</Waves>`,
  props: [
    { name: 'layers', type: 'number', defaultValue: '3', description: 'Wave-line count (capped at 4; "lite" caps at 2).' },
    { name: 'color', type: 'string', defaultValue: 'var(--joy-300)', description: 'Line color.' },
    { name: 'amplitude', type: 'number', defaultValue: '14', description: 'Wave height (capped at 24).' },
    { name: 'height', type: 'number', defaultValue: '120', description: 'Band height in px, anchored to the bottom.' },
    { name: 'speed', type: 'number', defaultValue: '1', description: 'Speed multiplier.' },
    { name: 'performance', type: '"full" | "lite"', defaultValue: '"full"', description: '"lite" caps the layer count at 2.' },
  ],
  a11y: [
    'The whole SVG band is aria-hidden and pointer-transparent — pure texture.',
    'Static under reduced motion; the lines stay, the drift stops.',
    'The geometry is drawn once and only transform animates — the path itself never morphs.',
  ],
};
