import type { CSSProperties } from 'react';
import {
  CardStack,
  FlipCard,
  Float,
  ImageZoom,
  Marquee,
  Shimmer,
  type FlipCardProps,
  type ImageZoomProps,
  type MarqueeProps,
  type ShimmerProps,
} from '@fj-effects';
import { Badge, Card, Tag, Text } from '@fj';
import type { ComponentDoc, ControlValues } from '../types';
import { impl } from '../impl';

const replayKey = (values: ControlValues) => JSON.stringify(values);

export const shimmerDoc: ComponentDoc = {
  id: 'shimmer',
  name: 'Shimmer',
  category: 'animation',
  blurb: 'A soft light sheen sweeps across a surface — badges, chips, freshly loaded cards.',
  keywords: ['shimmer', 'sheen', 'shine', 'loading', 'animation'],
  importLine: "import { Shimmer } from '@fj-effects';",
  implementation: impl('shimmer'),
  replayable: true,
  controls: [
    { type: 'select', prop: 'trigger', options: ['loop', 'hover', 'mount'], defaultValue: 'loop' },
    { type: 'number', prop: 'duration', label: 'ms / sweep', defaultValue: 1400, min: 600, max: 3000, step: 100 },
    { type: 'number', prop: 'intensity', defaultValue: 0.35, min: 0.1, max: 0.8, step: 0.05 },
  ],
  render: (v) => (
    <span key={replayKey(v)}>
      <Shimmer
        trigger={v.trigger as ShimmerProps['trigger']}
        duration={Number(v.duration)}
        intensity={Number(v.intensity)}
        style={{ borderRadius: 'var(--radius-pill)' }}
      >
        <Badge tone="accent" solid>
          New
        </Badge>
      </Shimmer>
    </span>
  ),
  code: (v) => `<Shimmer${v.trigger !== 'loop' ? ` trigger="${String(v.trigger)}"` : ''}${
    v.duration !== 1400 ? ` duration={${Number(v.duration)}}` : ''
  }>
  <Badge tone="accent" solid>New</Badge>
</Shimmer>`,
  props: [
    { name: 'trigger', type: '"loop" | "hover" | "mount"', defaultValue: '"loop"', description: 'When the sheen plays.' },
    { name: 'duration', type: 'number', defaultValue: '1400', description: 'Sheen travel duration in ms.' },
    { name: 'angle', type: 'number', defaultValue: '20', description: 'Sweep angle in degrees.' },
    { name: 'intensity', type: 'number', defaultValue: '0.35', description: 'Sheen opacity 0–1.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Children unchanged, no sheen.' },
  ],
  a11y: [
    'The sheen is an aria-hidden, pointer-transparent overlay — content underneath is untouched.',
    'Reduced motion suppresses the sweep entirely.',
    'For loading placeholders prefer Skeleton; Shimmer is a finishing touch, not a loader.',
  ],
};

export const floatDoc: ComponentDoc = {
  id: 'float',
  name: 'Float',
  category: 'animation',
  blurb: 'A gentle levitation loop for illustrations, empty-state art, and hero props.',
  keywords: ['float', 'levitate', 'hover', 'bob', 'animation'],
  importLine: "import { Float } from '@fj-effects';",
  implementation: impl('float'),
  replayable: true,
  controls: [
    { type: 'number', prop: 'distance', label: 'Travel (px)', defaultValue: 8, min: 2, max: 16, step: 1 },
    { type: 'number', prop: 'duration', label: 'Seconds / loop', defaultValue: 4, min: 2, max: 10, step: 1 },
    { type: 'number', prop: 'rotate', label: 'Rotate (deg)', defaultValue: 0, min: 0, max: 8, step: 1 },
  ],
  render: (v) => (
    <span key={replayKey(v)}>
      <Float distance={Number(v.distance)} duration={Number(v.duration)} rotate={Number(v.rotate)}>
        <Card style={{ width: 120, textAlign: 'center' }}>
          <Text variant="h3" as="div">
            ☁︎
          </Text>
        </Card>
      </Float>
    </span>
  ),
  code: (v) => `<Float${v.distance !== 8 ? ` distance={${Number(v.distance)}}` : ''}${
    v.duration !== 4 ? ` duration={${Number(v.duration)}}` : ''
  }${v.rotate !== 0 ? ` rotate={${Number(v.rotate)}}` : ''}>
  <Card>…</Card>
</Float>`,
  props: [
    { name: 'distance', type: 'number', defaultValue: '8', description: 'Vertical travel in px (kept small).' },
    { name: 'duration', type: 'number', defaultValue: '4', description: 'Seconds per loop.' },
    { name: 'delay', type: 'number', defaultValue: '0', description: 'Lead-in delay in seconds.' },
    { name: 'rotate', type: 'number', defaultValue: '0', description: 'Degrees of gentle rotation at the extremes.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Static, no float.' },
  ],
  a11y: [
    'Purely decorative — wrap ornaments, never interactive controls or reading content.',
    'Reduced motion holds the element still.',
    'Travel is capped small so it never causes overlap or reading distraction.',
  ],
};

const STRIP = ['Design tokens', 'Motion', 'A11y', 'Effects', 'Playground', 'Type scale'];

export const marqueeDoc: ComponentDoc = {
  id: 'marquee',
  name: 'Marquee',
  category: 'animation',
  blurb: 'An infinite, seamless ticker for decorative streams — logo walls, tag clouds.',
  keywords: ['marquee', 'ticker', 'scroll', 'loop', 'logos', 'animation'],
  importLine: "import { Marquee } from '@fj-effects';",
  implementation: impl('marquee'),
  replayable: true,
  controls: [
    { type: 'number', prop: 'duration', label: 'Seconds / loop', defaultValue: 24, min: 8, max: 40, step: 2 },
    { type: 'select', prop: 'direction', options: ['left', 'right'], defaultValue: 'left' },
    { type: 'boolean', prop: 'pauseOnHover', defaultValue: true },
    { type: 'boolean', prop: 'fade', defaultValue: true },
  ],
  render: (v) => (
    <div key={replayKey(v)} style={{ width: '100%', maxWidth: 480 }}>
      <Marquee
        duration={Number(v.duration)}
        direction={v.direction as MarqueeProps['direction']}
        pauseOnHover={Boolean(v.pauseOnHover)}
        fade={Boolean(v.fade)}
      >
        {STRIP.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </Marquee>
    </div>
  ),
  code: (v) => `<Marquee${v.duration !== 24 ? ` duration={${Number(v.duration)}}` : ''}${
    v.direction !== 'left' ? ` direction="right"` : ''
  }${v.pauseOnHover === false ? ' pauseOnHover={false}' : ''}${v.fade === false ? ' fade={false}' : ''}>
  {logos.map((logo) => <img key={logo.alt} {...logo} />)}
</Marquee>`,
  props: [
    { name: 'duration', type: 'number', defaultValue: '24', description: 'Seconds per loop.' },
    { name: 'direction', type: '"left" | "right"', defaultValue: '"left"', description: 'Scroll direction.' },
    { name: 'pauseOnHover', type: 'boolean', defaultValue: 'true', description: 'Pause while hovered.' },
    { name: 'gap', type: 'number', defaultValue: '24', description: 'Gap between items in px.' },
    { name: 'fade', type: 'boolean', defaultValue: 'true', description: 'Fade the strip out at both edges.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Static row, no scrolling.' },
  ],
  a11y: [
    'The duplicated strip is aria-hidden and inert — assistive tech and the tab order see each item once.',
    'Reduced motion renders a single static, readable row with no clone.',
    'Decorative streams only (logos, tags) — never content users must read to completion.',
  ],
};

export const imageZoomDoc: ComponentDoc = {
  id: 'image-zoom',
  name: 'ImageZoom',
  category: 'animation',
  blurb: 'A gentle zoom inside a cropped frame — hover zoom for gallery cards, slow drift for heroes.',
  keywords: ['image', 'zoom', 'ken burns', 'hover', 'photo', 'animation'],
  importLine: "import { ImageZoom } from '@fj-effects';",
  implementation: impl('image-zoom'),
  replayable: true,
  controls: [
    { type: 'select', prop: 'mode', options: ['hover', 'drift'], defaultValue: 'hover' },
    { type: 'number', prop: 'scale', defaultValue: 1.06, min: 1.02, max: 1.15, step: 0.01 },
    { type: 'number', prop: 'duration', defaultValue: 600, min: 200, max: 640, step: 40 },
  ],
  render: (v) => (
    <span key={replayKey(v)}>
      <ImageZoom
        mode={v.mode as ImageZoomProps['mode']}
        scale={Number(v.scale)}
        duration={Number(v.duration)}
        style={{ borderRadius: 'var(--radius-lg)', width: 280 }}
      >
        <div
          role="img"
          aria-label="A soft gradient landscape"
          style={{
            height: 170,
            background: [
              'radial-gradient(120px 70px at 30% 88%, var(--joy-300), transparent)',
              'radial-gradient(180px 90px at 78% 94%, var(--bloom-300), transparent)',
              'radial-gradient(44px 44px at 76% 24%, var(--sun-300), transparent)',
              'linear-gradient(180deg, var(--sun-100), var(--joy-100))',
            ].join(', '),
          }}
        />
      </ImageZoom>
    </span>
  ),
  code: (v) => `<ImageZoom${v.mode !== 'hover' ? ` mode="drift"` : ''}${
    v.scale !== 1.06 ? ` scale={${Number(v.scale)}}` : ''
  }${v.duration !== 600 ? ` duration={${Number(v.duration)}}` : ''}>
  <img src="/studio.jpg" alt="The studio at golden hour" />
</ImageZoom>`,
  props: [
    { name: 'mode', type: '"hover" | "drift"', defaultValue: '"hover"', description: 'Hover zoom or slow ken-burns loop.' },
    { name: 'scale', type: 'number', defaultValue: '1.06', description: 'Zoom scale (capped at 1.15).' },
    { name: 'duration', type: 'number', defaultValue: '600', description: 'Hover transition in ms.' },
    { name: 'speed', type: 'number', defaultValue: '1', description: 'Drift-loop speed multiplier.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Still image, no zoom.' },
  ],
  a11y: [
    'The child stays real content — keep the image’s alt text; the motion is purely decorative.',
    'Still under reduced motion: no hover response, no drift.',
    'The frame clips overflow, so the zoom never shifts surrounding layout.',
  ],
};

const flipFace: CSSProperties = { width: 200, height: 120, display: 'grid', placeItems: 'center' };

export const flipCardDoc: ComponentDoc = {
  id: 'flip-card',
  name: 'FlipCard',
  category: 'animation',
  blurb: 'A two-faced card that flips in 3D to reveal its back — feature reveals, playful tiles.',
  keywords: ['flip', 'card', '3d', 'rotate', 'reveal', 'animation'],
  importLine: "import { FlipCard } from '@fj-effects';",
  implementation: impl('flip-card'),
  replayable: true,
  controls: [
    { type: 'select', prop: 'trigger', options: ['hover', 'click'], defaultValue: 'hover' },
    { type: 'select', prop: 'direction', options: ['horizontal', 'vertical'], defaultValue: 'horizontal' },
    { type: 'number', prop: 'duration', defaultValue: 600, min: 300, max: 1200, step: 100 },
  ],
  render: (v) => (
    <span key={replayKey(v)}>
      <FlipCard
        trigger={v.trigger as FlipCardProps['trigger']}
        direction={v.direction as FlipCardProps['direction']}
        duration={Number(v.duration)}
        front={
          <Card style={flipFace}>
            <Text variant="body" as="div">
              {v.trigger === 'click' ? 'Click me' : 'Hover me'} ☺︎
            </Text>
          </Card>
        }
        back={
          <Card style={{ ...flipFace, background: 'var(--joy-100)' }}>
            <Text variant="body" as="div">
              Made with joy
            </Text>
          </Card>
        }
      />
    </span>
  ),
  code: (v) => `<FlipCard${v.trigger !== 'hover' ? ' trigger="click"' : ''}${
    v.direction !== 'horizontal' ? ' direction="vertical"' : ''
  }${v.duration !== 600 ? ` duration={${Number(v.duration)}}` : ''}
  front={<Card>Hover me ☺︎</Card>}
  back={<Card>Made with joy</Card>}
/>`,
  props: [
    { name: 'front', type: 'ReactNode', description: 'Face shown at rest.' },
    { name: 'back', type: 'ReactNode', description: 'Face revealed by the flip.' },
    { name: 'trigger', type: '"hover" | "click"', defaultValue: '"hover"', description: 'What flips the card.' },
    { name: 'direction', type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: 'Flip axis.' },
    { name: 'duration', type: 'number', defaultValue: '600', description: 'Flip duration in ms.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Show only the front face, no flip.' },
  ],
  a11y: [
    'Only one face is exposed at a time — the hidden face is aria-hidden and visibility: hidden, so assistive tech and the tab order never land inside it.',
    'trigger="click" renders a keyboard-operable button: Enter/Space flip, aria-pressed reflects the face; hover flips on focus too.',
    'Reduced motion swaps faces instantly — no 3D rotation plays.',
  ],
};

const STACK_TIPS = [
  { tag: 'Tip 1', text: 'Animate transform and opacity only — never layout.' },
  { tag: 'Tip 2', text: 'Every effect respects prefers-reduced-motion.' },
  { tag: 'Tip 3', text: 'Decorative layers stay aria-hidden.' },
];

export const cardStackDoc: ComponentDoc = {
  id: 'card-stack',
  name: 'CardStack',
  category: 'animation',
  blurb: 'A tappable deck of stacked cards — the top card flings aside and tucks in at the back.',
  keywords: ['stack', 'deck', 'cards', 'cycle', 'swipe', 'animation'],
  importLine: "import { CardStack } from '@fj-effects';",
  implementation: impl('card-stack', {
    stylingNeutral:
      'The stack transforms (depth offsets, the send-to-back fling) are computed per card in JavaScript — there is no stylesheet or utility set to switch. CSS and Tailwind show the same source.',
  }),
  replayable: true,
  controls: [
    { type: 'number', prop: 'interval', label: 'Auto ms (0 = click)', defaultValue: 0, min: 0, max: 5000, step: 500 },
    { type: 'number', prop: 'offset', defaultValue: 10, min: 6, max: 20, step: 1 },
    { type: 'number', prop: 'duration', defaultValue: 500, min: 200, max: 900, step: 50 },
  ],
  render: (v) => (
    <span key={replayKey(v)} style={{ paddingBottom: 2 * Math.min(Number(v.offset), 20) }}>
      <CardStack
        interval={Number(v.interval)}
        offset={Number(v.offset)}
        duration={Number(v.duration)}
        aria-label="Motion tips — activate to see the next card"
      >
        {STACK_TIPS.map((t) => (
          <Card key={t.tag} style={{ width: 240 }}>
            <Tag>{t.tag}</Tag>
            <Text variant="small" as="p" style={{ marginTop: 8 }}>
              {t.text}
            </Text>
          </Card>
        ))}
      </CardStack>
    </span>
  ),
  code: (v) => `<CardStack${Number(v.interval) !== 0 ? ` interval={${Number(v.interval)}}` : ''}${
    v.offset !== 10 ? ` offset={${Number(v.offset)}}` : ''
  }${v.duration !== 500 ? ` duration={${Number(v.duration)}}` : ''}>
  {tips.map((tip) => <Card key={tip.id}>{tip.text}</Card>)}
</CardStack>`,
  props: [
    { name: 'children', type: 'ReactNode', description: 'The cards, top of the deck first.' },
    { name: 'interval', type: 'number', defaultValue: '0', description: 'Auto-advance interval in ms; 0 = advance on click/Enter/Space only.' },
    { name: 'duration', type: 'number', defaultValue: '500', description: 'Send-to-back travel duration in ms.' },
    { name: 'offset', type: 'number', defaultValue: '10', description: 'Vertical offset per depth level in px.' },
    { name: 'scale', type: 'number', defaultValue: '0.05', description: 'Scale step per depth level.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Static stack — no advancing.' },
  ],
  a11y: [
    'Only the top card is exposed — cards behind it are aria-hidden, pointer-inert previews.',
    'The stack is keyboard-operable: Enter/Space sends the top card to the back.',
    'Reduced motion reorders instantly with no fling; auto-advance respects it too.',
  ],
};
