import { Float, Shimmer, type ShimmerProps } from '@fj-effects';
import { Badge, Card, Text } from '@fj';
import type { ComponentDoc, ControlValues } from '../types';
import { impl } from '../impl';

const replayKey = (values: ControlValues) => JSON.stringify(values);

export const shimmerDoc: ComponentDoc = {
  id: 'shimmer',
  name: 'Shimmer',
  category: 'effects-surfaces',
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
  category: 'effects-surfaces',
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
