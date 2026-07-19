import { useState } from 'react';
import { SegmentedControl, Tabs, type SegmentedControlProps } from '@fj';
import type { ComponentDoc, ControlValues } from '../types';
import { impl } from '../impl';

function TabsDemo() {
  const [tab, setTab] = useState('sketches');
  return (
    <Tabs
      items={[
        { id: 'sketches', label: 'Sketches' },
        { id: 'notes', label: 'Notes' },
        { id: 'circles', label: 'Circles' },
      ]}
      value={tab}
      onChange={setTab}
    />
  );
}

export const tabsDoc: ComponentDoc = {
  id: 'tabs',
  name: 'Tabs',
  category: 'navigation',
  addedAt: '2026-07-03',
  blurb: 'Pill tabs on a sunken track — for switching views without leaving the page.',
  keywords: ['tabs', 'views', 'switch'],
  importLine: "import { Tabs } from '@fj';",
  implementation: impl('tabs'),
  controls: [],
  render: () => <TabsDemo />,
  code: () => `const [tab, setTab] = useState('sketches');

<Tabs
  items={[
    { id: 'sketches', label: 'Sketches' },
    { id: 'notes', label: 'Notes' },
    { id: 'circles', label: 'Circles' },
  ]}
  value={tab}
  onChange={setTab}
/>`,
  props: [
    { name: 'items', type: '{ id, label }[]', description: 'The tabs.' },
    { name: 'value', type: 'string', description: 'Active tab id; defaults to the first item.' },
    { name: 'onChange', type: '(id) => void', description: 'Selection handler.' },
  ],
  a11y: [
    'Renders role="tablist" with aria-selected on each tab.',
    'Keep tab labels short; the panel content change should be announced by its own heading.',
  ],
};

function SegmentedDemo({ values }: { values: ControlValues }) {
  const [value, setValue] = useState('week');
  return (
    <SegmentedControl
      options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ]}
      value={value}
      onChange={setValue}
      size={values.size as SegmentedControlProps['size']}
      full={Boolean(values.full)}
    />
  );
}

export const segmentedControlDoc: ComponentDoc = {
  id: 'segmented-control',
  name: 'SegmentedControl',
  category: 'navigation',
  addedAt: '2026-07-03',
  blurb: 'An iOS-style switch with a sliding thumb — equal segments, one clear choice.',
  keywords: ['segment', 'toggle group', 'switch'],
  importLine: "import { SegmentedControl } from '@fj';",
  implementation: impl('segmented-control'),
  controls: [
    { type: 'select', prop: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
    { type: 'boolean', prop: 'full', label: 'Full width', defaultValue: false },
  ],
  render: (values) => (
    <div style={{ width: Boolean(values.full) ? 'min(360px, 100%)' : undefined }}>
      <SegmentedDemo values={values} />
    </div>
  ),
  code: (v) => `const [value, setValue] = useState('week');

<SegmentedControl
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
  value={value}
  onChange={setValue}${v.size !== 'md' ? `\n  size="${String(v.size)}"` : ''}${v.full ? '\n  full' : ''}
/>`,
  props: [
    { name: 'options', type: '{ value, label, icon? }[]', description: 'Equal-width segments.' },
    { name: 'value / defaultValue', type: 'string', description: 'Controlled or uncontrolled selection.' },
    { name: 'onChange', type: '(value) => void', description: 'Selection handler.' },
    { name: 'size', type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: '34 / 40 / 46 px height.' },
    { name: 'full', type: 'boolean', defaultValue: 'false', description: 'Stretch to fill the container.' },
  ],
  a11y: [
    'Segments are real buttons; the sliding thumb is decorative and pointer-transparent.',
    'Best for 2–4 short options — more than that reads better as Tabs or a Select.',
  ],
};
