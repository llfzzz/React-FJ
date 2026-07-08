import {
  AmbientBackground,
  AnimatedBorder,
  Badge,
  Button,
  CountUp,
  Glow,
  Reveal,
  SpotlightCard,
  Stack,
  Text,
  TextReveal,
  type AmbientBackgroundProps,
  type TextRevealProps,
} from '@fj';
import type { ComponentDoc, ControlValues } from '../types';
import { impl } from '../impl';

/** Remount on knob change so entrance effects replay. */
const replayKey = (values: ControlValues) => JSON.stringify(values);

export const textRevealDoc: ComponentDoc = {
  id: 'text-reveal',
  name: 'TextReveal',
  category: 'effects-text',
  blurb: 'Words rise in with a gentle stagger — for heroes and section openers only.',
  keywords: ['animation', 'headline', 'stagger', 'motion'],
  importLine: "import { TextReveal } from '@fj';",
  implementation: impl('text-reveal'),
  replayable: true,
  controls: [
    { type: 'text', prop: 'text', defaultValue: 'Built for the making.' },
    { type: 'select', prop: 'by', options: ['word', 'char'], defaultValue: 'word' },
    { type: 'number', prop: 'stagger', defaultValue: 45, min: 15, max: 120, step: 15 },
    { type: 'number', prop: 'duration', defaultValue: 640, min: 240, max: 1200, step: 80 },
  ],
  render: (v) => (
    <h2 key={replayKey(v)} style={{ fontSize: 'var(--text-2xl)', textAlign: 'center' }}>
      <TextReveal
        text={String(v.text)}
        by={v.by as TextRevealProps['by']}
        stagger={Number(v.stagger)}
        duration={Number(v.duration)}
      />
    </h2>
  ),
  code: (v) => `<h2>
  <TextReveal text="${String(v.text)}"${v.by !== 'word' ? ` by="char"` : ''}${
    v.stagger !== 45 ? `\n    stagger={${Number(v.stagger)}}` : ''
  }${v.duration !== 640 ? `\n    duration={${Number(v.duration)}}` : ''} />
</h2>`,
  props: [
    { name: 'text', type: 'string', description: 'The headline to reveal.' },
    { name: 'by', type: '"word" | "char"', defaultValue: '"word"', description: 'Split unit.' },
    { name: 'stagger', type: 'number', defaultValue: '45', description: 'Per-unit delay in ms.' },
    { name: 'duration', type: 'number', defaultValue: '640', description: 'Per-unit duration in ms.' },
    { name: 'once', type: 'boolean', defaultValue: 'true', description: 'Animate only on first entry.' },
  ],
  a11y: [
    'The full sentence is exposed via aria-label; the animated fragments are aria-hidden.',
    'Under prefers-reduced-motion it renders plain text — no movement at all.',
    'Showcase surfaces only: heroes, section titles, empty states.',
  ],
};

export const revealDoc: ComponentDoc = {
  id: 'reveal',
  name: 'Reveal',
  category: 'effects-motion',
  blurb: 'A section fades and rises as it enters the viewport — cascade staggers its children.',
  keywords: ['animation', 'scroll', 'entrance', 'motion'],
  importLine: "import { Reveal } from '@fj';",
  implementation: impl('reveal'),
  replayable: true,
  controls: [
    { type: 'number', prop: 'y', defaultValue: 14, min: 0, max: 40, step: 2 },
    { type: 'number', prop: 'duration', defaultValue: 640, min: 240, max: 1200, step: 80 },
    { type: 'boolean', prop: 'cascade', defaultValue: true },
  ],
  render: (v) => (
    <Reveal key={replayKey(v)} y={Number(v.y)} duration={Number(v.duration)} cascade={Boolean(v.cascade)} stagger={90}>
      <Badge tone="accent">One</Badge>
      <Text variant="h4" as="p" style={{ margin: '8px 0' }}>
        Two — a heading rises
      </Text>
      <Text variant="small">Three — the details follow, a beat later.</Text>
    </Reveal>
  ),
  code: (v) => `<Reveal${v.cascade ? ' cascade stagger={90}' : ''}${v.y !== 14 ? ` y={${Number(v.y)}}` : ''}${
    v.duration !== 640 ? ` duration={${Number(v.duration)}}` : ''
  }>
  <Badge tone="accent">One</Badge>
  <h4>Two — a heading rises</h4>
  <p>Three — the details follow, a beat later.</p>
</Reveal>`,
  props: [
    { name: 'y', type: 'number', defaultValue: '14', description: 'Rise distance in px.' },
    { name: 'duration', type: 'number', defaultValue: '640', description: 'Duration in ms.' },
    { name: 'cascade', type: 'boolean', defaultValue: 'false', description: 'Stagger direct children.' },
    { name: 'stagger', type: 'number', defaultValue: '60', description: 'Per-child delay with cascade.' },
    { name: 'once', type: 'boolean', defaultValue: 'true', description: 'Animate only on first entry.' },
    { name: 'threshold', type: 'number', defaultValue: '0.15', description: 'IntersectionObserver threshold.' },
  ],
  a11y: [
    'Only transform and opacity animate — zero layout shift.',
    'Reduced motion shows content immediately, fully visible.',
    'Use once per section, not on every card in a dense grid.',
  ],
};

export const countUpDoc: ComponentDoc = {
  id: 'count-up',
  name: 'CountUp',
  category: 'effects-status',
  blurb: 'A number that eases up to its value when it scrolls into view.',
  keywords: ['animation', 'number', 'stat', 'metric'],
  importLine: "import { CountUp } from '@fj';",
  implementation: impl('count-up', {
    notApplicable: {
      css: 'Counting numbers needs to run JavaScript on scroll — a CSS-only version can only show the final value, not the count-up. Use the JavaScript or TypeScript implementation.',
      tailwind: 'Counting numbers needs to run JavaScript on scroll — utility classes can style the number but cannot animate it. Use the JavaScript or TypeScript implementation.',
    },
  }),
  replayable: true,
  controls: [
    { type: 'number', prop: 'value', defaultValue: 1284, min: 0, max: 100000, step: 1 },
    { type: 'number', prop: 'duration', defaultValue: 1200, min: 400, max: 3000, step: 100 },
    { type: 'text', prop: 'suffix', defaultValue: '' },
  ],
  render: (v) => (
    <span
      key={replayKey(v)}
      style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 600 }}
    >
      <CountUp value={Number(v.value)} duration={Number(v.duration)} suffix={String(v.suffix)} />
    </span>
  ),
  // value is required, so the snippet must always carry it (the generic
  // serializer would drop it for sitting at the knob default).
  code: (v) =>
    `<CountUp value={${Number(v.value)}}${v.duration !== 1200 ? ` duration={${Number(v.duration)}}` : ''}${
      String(v.suffix) ? ` suffix="${String(v.suffix)}"` : ''
    } />`,
  props: [
    { name: 'value', type: 'number', description: 'Target value.' },
    { name: 'duration', type: 'number', defaultValue: '1200', description: 'Ease duration in ms.' },
    { name: 'decimals', type: 'number', defaultValue: '0', description: 'Fraction digits.' },
    { name: 'prefix / suffix', type: 'string', description: 'Text around the number.' },
    { name: 'separator', type: 'string', defaultValue: '","', description: 'Thousands separator.' },
  ],
  a11y: [
    'The final value is always in aria-label — screen readers never hear the ticking.',
    'Reduced motion shows the final value instantly.',
    'Tabular numerals prevent width wobble while counting.',
  ],
};

export const spotlightCardDoc: ComponentDoc = {
  id: 'spotlight-card',
  name: 'SpotlightCard',
  category: 'effects-interaction',
  blurb: 'A card whose surface warms under the cursor — for one flagship card per view.',
  keywords: ['hover', 'card', 'highlight', 'motion'],
  importLine: "import { SpotlightCard } from '@fj';",
  implementation: impl('spotlight-card'),
  controls: [{ type: 'number', prop: 'size', defaultValue: 320, min: 160, max: 560, step: 40 }],
  render: (v) => (
    <SpotlightCard size={Number(v.size)} style={{ width: 'min(340px, 100%)' }}>
      <Stack gap={10}>
        <Badge tone="accent">Featured</Badge>
        <Text variant="h4" as="h3">
          Move the cursor around
        </Text>
        <Text variant="small">A soft coral wash follows it. Pure paint — no layout shift.</Text>
      </Stack>
    </SpotlightCard>
  ),
  code: (v) => `<SpotlightCard${v.size !== 320 ? ` size={${Number(v.size)}}` : ''}>
  <Badge tone="accent">Featured</Badge>
  <h3>Move the cursor around</h3>
  <p>A soft coral wash follows it.</p>
</SpotlightCard>`,
  props: [
    { name: 'size', type: 'number', defaultValue: '320', description: 'Spotlight diameter in px.' },
    { name: 'interactive', type: 'boolean', defaultValue: 'true', description: 'Hover lift + shadow like Card.' },
    { name: 'padding / radius', type: 'number | string', description: 'Surface geometry, token-based.' },
  ],
  a11y: [
    'The spotlight layer is aria-hidden and pointer-transparent.',
    'Content contrast never depends on the hover wash.',
    'Touch devices simply see a Card — nothing is lost.',
  ],
};

export const animatedBorderDoc: ComponentDoc = {
  id: 'animated-border',
  name: 'AnimatedBorder',
  category: 'effects-surfaces',
  blurb: 'A hairline gradient that sweeps slowly around one flagship panel.',
  keywords: ['border', 'gradient', 'loop', 'motion'],
  importLine: "import { AnimatedBorder } from '@fj';",
  implementation: impl('animated-border'),
  controls: [
    { type: 'number', prop: 'speed', defaultValue: 8, min: 3, max: 20, step: 1 },
    { type: 'number', prop: 'width', defaultValue: 1, min: 1, max: 3, step: 1 },
  ],
  render: (v) => (
    <AnimatedBorder speed={Number(v.speed)} width={Number(v.width)} style={{ width: 'min(340px, 100%)' }}>
      <Stack gap={8}>
        <Text variant="h4" as="h3">
          The one highlighted thing
        </Text>
        <Text variant="small">A quiet coral–lilac–sun sweep, {String(v.speed)}s per lap.</Text>
      </Stack>
    </AnimatedBorder>
  ),
  code: (v) => `<AnimatedBorder${v.speed !== 8 ? ` speed={${Number(v.speed)}}` : ''}${
    v.width !== 1 ? ` width={${Number(v.width)}}` : ''
  }>
  <h3>The one highlighted thing</h3>
</AnimatedBorder>`,
  props: [
    { name: 'speed', type: 'number', defaultValue: '8', description: 'Seconds per revolution.' },
    { name: 'width', type: 'number', defaultValue: '1', description: 'Border thickness in px.' },
    { name: 'colors', type: 'string[]', defaultValue: 'coral → lilac → sun', description: 'Gradient stops.' },
    { name: 'radius / padding', type: 'number | string', description: 'Panel geometry.' },
  ],
  a11y: [
    'Purely decorative; reduced motion freezes the sweep into a static gradient.',
    'One per view, maximum — it marks the flagship, not the furniture.',
  ],
};

export const glowDoc: ComponentDoc = {
  id: 'glow',
  name: 'Glow',
  category: 'effects-surfaces',
  blurb: 'A static warm halo that lifts a hero element off the paper. No animation at all.',
  keywords: ['halo', 'gradient', 'hero'],
  importLine: "import { Glow } from '@fj';",
  implementation: impl('glow'),
  controls: [
    { type: 'number', prop: 'intensity', defaultValue: 0.35, min: 0.1, max: 0.7, step: 0.05 },
    { type: 'number', prop: 'blur', defaultValue: 48, min: 16, max: 96, step: 8 },
  ],
  render: (v) => (
    <Glow intensity={Number(v.intensity)} blur={Number(v.blur)}>
      <Button size="lg">Start your studio</Button>
    </Glow>
  ),
  code: (v) => `<Glow${v.intensity !== 0.35 ? ` intensity={${Number(v.intensity)}}` : ''}${
    v.blur !== 48 ? ` blur={${Number(v.blur)}}` : ''
  }>
  <Button size="lg">Start your studio</Button>
</Glow>`,
  props: [
    { name: 'colors', type: 'string[]', defaultValue: 'coral → lilac', description: 'Gradient colors.' },
    { name: 'intensity', type: 'number', defaultValue: '0.35', description: 'Halo opacity 0–1.' },
    { name: 'blur', type: 'number', defaultValue: '48', description: 'Blur radius in px.' },
    { name: 'spread', type: 'number', defaultValue: '8', description: 'Halo overhang in px.' },
  ],
  a11y: [
    'Static and aria-hidden — nothing moves, nothing announces.',
    'Keep intensity restrained so text on the child stays comfortably readable.',
  ],
};

export const ambientBackgroundDoc: ComponentDoc = {
  id: 'ambient-background',
  name: 'AmbientBackground',
  category: 'effects-backgrounds',
  blurb: 'Huge, slow color washes behind hero content — never behind dense product UI.',
  keywords: ['background', 'gradient', 'hero', 'motion'],
  importLine: "import { AmbientBackground } from '@fj';",
  implementation: impl('ambient-background'),
  controls: [
    { type: 'select', prop: 'variant', options: ['warm', 'cool', 'joy'], defaultValue: 'warm' },
    { type: 'number', prop: 'opacity', defaultValue: 0.14, min: 0.06, max: 0.3, step: 0.02 },
    { type: 'boolean', prop: 'animate', defaultValue: true },
  ],
  render: (v) => (
    <AmbientBackground
      variant={v.variant as AmbientBackgroundProps['variant']}
      opacity={Number(v.opacity)}
      animate={Boolean(v.animate)}
      style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}
    >
      <div style={{ padding: 'var(--space-7) var(--space-5)', textAlign: 'center' }}>
        <Text variant="eyebrow">Hero zone</Text>
        <Text variant="h3" as="p" style={{ marginTop: 8 }}>
          Calm color, drifting slowly.
        </Text>
      </div>
    </AmbientBackground>
  ),
  code: (v) => `<AmbientBackground${v.variant !== 'warm' ? ` variant="${String(v.variant)}"` : ''}${
    Number(v.opacity) !== 0.14 ? ` opacity={${Number(v.opacity)}}` : ''
  }${!v.animate ? ' animate={false}' : ''}>
  <Hero />
</AmbientBackground>`,
  props: [
    { name: 'variant', type: '"warm" | "cool" | "joy"', defaultValue: '"warm"', description: 'Wash palette.' },
    { name: 'opacity', type: 'number', defaultValue: '0.14', description: 'Wash strength 0–1.' },
    { name: 'animate', type: 'boolean', defaultValue: 'true', description: 'Drift on/off (reduced motion freezes it regardless).' },
  ],
  a11y: [
    'Washes are aria-hidden background paint; content sits on a relative layer above.',
    'Drift is 26–32s per cycle — ambient, not attention-seeking — and freezes under reduced motion.',
    'Reserve for heroes, onboarding, empty and success states.',
  ],
};
