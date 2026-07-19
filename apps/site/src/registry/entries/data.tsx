import { Badge, Table } from '@fj';
import type { ComponentDoc } from '../types';
import { impl } from '../impl';

const COLUMNS = [
  { key: 'title', header: 'Sketch' },
  { key: 'circle', header: 'Circle' },
  {
    key: 'status',
    header: 'Status',
    render: (value: unknown) => (
      <Badge tone={value === 'Published' ? 'success' : value === 'Draft' ? 'warn' : 'neutral'}>
        {String(value)}
      </Badge>
    ),
  },
  { key: 'updated', header: 'Updated', align: 'right' as const },
];

const ROWS = [
  { title: 'Morning pages', circle: 'Studio', status: 'Published', updated: 'Today' },
  { title: 'Bridge study', circle: 'Ink club', status: 'Draft', updated: 'Yesterday' },
  { title: 'Color notes', circle: 'Only me', status: 'Private', updated: 'Mon' },
  { title: 'Figure warm-ups', circle: 'Studio', status: 'Published', updated: 'Sun' },
];

export const tableDoc: ComponentDoc = {
  id: 'table',
  name: 'Table',
  category: 'content',
  addedAt: '2026-07-03',
  blurb: 'A quiet data table — hairline rows, mono headers, no drama.',
  keywords: ['data', 'rows', 'columns', 'grid'],
  importLine: "import { Table } from '@fj';",
  implementation: impl('table'),
  controls: [
    { type: 'boolean', prop: 'zebra', defaultValue: false },
    { type: 'boolean', prop: 'hover', defaultValue: true },
    { type: 'boolean', prop: 'dense', defaultValue: false },
  ],
  render: (v) => (
    <Table
      columns={COLUMNS}
      rows={ROWS}
      zebra={Boolean(v.zebra)}
      hover={Boolean(v.hover)}
      dense={Boolean(v.dense)}
      style={{ width: 'min(560px, 100%)' }}
    />
  ),
  code: (v) => `<Table
  columns={[
    { key: 'title', header: 'Sketch' },
    { key: 'circle', header: 'Circle' },
    { key: 'status', header: 'Status', render: (s) => <Badge>{s}</Badge> },
    { key: 'updated', header: 'Updated', align: 'right' },
  ]}
  rows={rows}${v.zebra ? '\n  zebra' : ''}${!v.hover ? '\n  hover={false}' : ''}${v.dense ? '\n  dense' : ''}
/>`,
  props: [
    { name: 'columns', type: '{ key, header, align?, width?, render? }[]', description: 'Column definitions; render customizes cells.' },
    { name: 'rows', type: 'object[]', description: 'Row data keyed by column key.' },
    { name: 'zebra', type: 'boolean', defaultValue: 'false', description: 'Alternating row tint.' },
    { name: 'hover', type: 'boolean', defaultValue: 'true', description: 'Row hover highlight.' },
    { name: 'dense', type: 'boolean', defaultValue: 'false', description: 'Tighter cell padding.' },
  ],
  a11y: [
    'Semantic <table> markup — headers are real <th> cells.',
    'The wrapper scrolls horizontally on small screens instead of crushing columns.',
    'Status cells pair color with text via Badge — never color alone.',
  ],
};
