import { Badge, Stack, type BadgeProps } from '@fj';
import type { ComponentDoc } from '../types';
import { impl } from '../impl';

export const badgeDoc: ComponentDoc = {
  id: 'badge',
  name: 'Badge',
  category: 'content',
  addedAt: '2026-07-02',
  blurb: 'A small status pill. Soft tints by default; solid fills when it must carry more weight.',
  keywords: ['status', 'pill', 'count', 'label'],
  importLine: "import { Badge } from '@fj';",
  implementation: impl('badge'),
  controls: [
    { type: 'text', prop: 'children', label: 'Label', defaultValue: 'Published' },
    {
      type: 'select',
      prop: 'tone',
      options: ['neutral', 'accent', 'success', 'warn', 'danger', 'sun', 'bloom'],
      defaultValue: 'neutral',
    },
    { type: 'boolean', prop: 'solid', defaultValue: false },
  ],
  render: (v) => (
    <Badge tone={v.tone as BadgeProps['tone']} solid={Boolean(v.solid)}>
      {String(v.children)}
    </Badge>
  ),
  examples: [
    {
      title: 'All tones',
      render: () => (
        <Stack direction="row" gap={10} wrap align="center">
          <Badge>Neutral</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warn">Warn</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="sun">Sun</Badge>
          <Badge tone="bloom">Bloom</Badge>
        </Stack>
      ),
      code: `<Badge>Neutral</Badge>
<Badge tone="accent">Accent</Badge>
<Badge tone="success">Success</Badge>
<Badge tone="warn">Warn</Badge>
<Badge tone="danger">Danger</Badge>
<Badge tone="sun">Sun</Badge>
<Badge tone="bloom">Bloom</Badge>`,
    },
  ],
  props: [
    { name: 'tone', type: '"neutral" | "accent" | "success" | "warn" | "danger" | "sun" | "bloom"', defaultValue: '"neutral"', description: 'Color tone.' },
    { name: 'solid', type: 'boolean', defaultValue: 'false', description: 'Solid fill instead of the soft tint.' },
  ],
  a11y: [
    'Color is never the only signal — the badge text carries the meaning.',
    'Soft tints use the 700-step foreground on the 100-step tint for AA contrast.',
  ],
};
