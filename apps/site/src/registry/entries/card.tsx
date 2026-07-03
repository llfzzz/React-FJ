import { Badge, Card, Stack, Text, type CardProps } from '@fj';
import type { ComponentDoc } from '../types';
import { impl } from '../impl';

function SampleContent() {
  return (
    <Stack gap={10}>
      <Badge tone="accent">New</Badge>
      <Text variant="h4" as="h3">
        Morning pages
      </Text>
      <Text variant="small">Three loose sketches and a note about the light.</Text>
    </Stack>
  );
}

export const cardDoc: ComponentDoc = {
  id: 'card',
  name: 'Card',
  category: 'core',
  blurb: "The system's signature container — hairline border, 18px radius, generous padding.",
  keywords: ['surface', 'panel', 'container', 'glass'],
  importLine: "import { Card } from '@fj';",
  implementation: impl('card'),
  controls: [
    { type: 'boolean', prop: 'interactive', defaultValue: false },
    { type: 'boolean', prop: 'glass', defaultValue: false },
    {
      type: 'select',
      prop: 'padding',
      options: ['var(--space-4)', 'var(--space-5)', 'var(--space-6)'],
      defaultValue: 'var(--space-5)',
    },
  ],
  render: (v) => (
    <Card
      interactive={Boolean(v.interactive)}
      glass={Boolean(v.glass)}
      padding={String(v.padding) as CardProps['padding']}
      style={{ width: 'min(340px, 100%)' }}
    >
      <SampleContent />
    </Card>
  ),
  examples: [
    {
      title: 'Frosted glass',
      description: 'Use glass on bars and floating panels — flat surfaces stay the default.',
      render: () => (
        <div
          style={{
            padding: 'var(--space-5)',
            borderRadius: 'var(--radius-lg)',
            background:
              'linear-gradient(120deg, var(--joy-100), var(--bloom-100), var(--sun-100))',
          }}
        >
          <Card glass style={{ width: 'min(320px, 100%)' }}>
            <Text variant="small">A quiet translucent panel with a hairline highlight.</Text>
          </Card>
        </div>
      ),
      code: `<Card glass>
  A quiet translucent panel with a hairline highlight.
</Card>`,
    },
  ],
  props: [
    { name: 'interactive', type: 'boolean', defaultValue: 'false', description: 'Lift 2px + soft shadow on hover, pointer cursor.' },
    { name: 'glass', type: 'boolean', defaultValue: 'false', description: 'Frosted translucent panel instead of solid surface.' },
    { name: 'padding', type: 'string', defaultValue: 'var(--space-5)', description: 'Any CSS padding value — stay on the spacing scale.' },
  ],
  a11y: [
    'Card is a plain container; give clickable cards a real link or button inside rather than a click handler on the div.',
    'Glass surfaces keep text on --text: contrast stays AA in both themes.',
  ],
};
