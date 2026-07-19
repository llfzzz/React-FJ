import { Info } from 'lucide-react';
import {
  Alert,
  Button,
  EmptyState,
  Progress,
  Skeleton,
  Spinner,
  Stack,
  ToastProvider,
  Tooltip,
  useToast,
  type AlertProps,
  type ProgressProps,
  type SkeletonProps,
  type ToastOptions,
  type TooltipProps,
} from '@fj';
import type { ComponentDoc, ControlValues } from '../types';
import { impl } from '../impl';

export const alertDoc: ComponentDoc = {
  id: 'alert',
  name: 'Alert',
  category: 'feedback',
  addedAt: '2026-07-03',
  blurb: 'An inline banner that states what happened and stays out of the way.',
  keywords: ['banner', 'message', 'status'],
  importLine: "import { Alert } from '@fj';",
  implementation: impl('alert'),
  controls: [
    { type: 'select', prop: 'tone', options: ['info', 'success', 'warn', 'danger', 'neutral'], defaultValue: 'info' },
    { type: 'text', prop: 'title', defaultValue: 'Sketch saved' },
    { type: 'boolean', prop: 'dismissible', label: 'Dismissible', defaultValue: false },
  ],
  render: (v) => (
    <Alert
      tone={v.tone as AlertProps['tone']}
      title={String(v.title)}
      icon={<Info size={17} aria-hidden />}
      onClose={v.dismissible ? () => {} : undefined}
      style={{ width: 'min(420px, 100%)' }}
    >
      Your morning pages are safely in the sketchbook.
    </Alert>
  ),
  code: (v) => `<Alert tone="${String(v.tone)}" title="${String(v.title)}" icon={<Info size={17} aria-hidden />}${
    v.dismissible ? ' onClose={dismiss}' : ''
  }>
  Your morning pages are safely in the sketchbook.
</Alert>`,
  props: [
    { name: 'tone', type: '"info" | "success" | "warn" | "danger" | "neutral"', defaultValue: '"info"', description: 'Semantic tint.' },
    { name: 'title', type: 'string', description: 'Bold first line.' },
    { name: 'icon', type: 'ReactNode', description: 'Leading icon, tinted to the tone.' },
    { name: 'onClose', type: '() => void', description: 'Shows a dismiss button.' },
  ],
  a11y: [
    'Renders role="status" so content changes are announced politely.',
    'Tone colors pair 700-step text on 100-step tint — readable on every fill.',
    'The meaning lives in the words, never only in the color.',
  ],
};

export const tooltipDoc: ComponentDoc = {
  id: 'tooltip',
  name: 'Tooltip',
  category: 'feedback',
  addedAt: '2026-07-03',
  blurb: 'A small dark bubble that answers “what is this?” on hover or focus.',
  keywords: ['hint', 'hover', 'label'],
  importLine: "import { Tooltip } from '@fj';",
  implementation: impl('tooltip'),
  controls: [
    { type: 'text', prop: 'label', defaultValue: 'Share with your circle' },
    { type: 'select', prop: 'placement', options: ['top', 'bottom', 'left', 'right'], defaultValue: 'top' },
  ],
  render: (v) => (
    <Tooltip label={String(v.label)} placement={v.placement as TooltipProps['placement']}>
      <Button variant="secondary">Hover or focus me</Button>
    </Tooltip>
  ),
  code: (v) => `<Tooltip label="${String(v.label)}"${v.placement !== 'top' ? ` placement="${String(v.placement)}"` : ''}>
  <Button variant="secondary">Hover or focus me</Button>
</Tooltip>`,
  props: [
    { name: 'label', type: 'ReactNode', description: 'Bubble content — keep it to a few words.' },
    { name: 'placement', type: '"top" | "bottom" | "left" | "right"', defaultValue: '"top"', description: 'Bubble position.' },
    { name: 'children', type: 'ReactNode', description: 'The single trigger element.' },
  ],
  a11y: [
    'Opens on keyboard focus as well as hover; it is never the only way to learn a control’s name.',
    'The bubble is pointer-transparent, so it cannot trap the cursor.',
    'For icon-only buttons, still set aria-label — the tooltip is a visual aid.',
  ],
};

function ToastDemo({ values }: { values: ControlValues }) {
  const push = useToast();
  return (
    <Button
      variant="secondary"
      onClick={() =>
        push({
          title: String(values.title),
          description: 'Quietly delivered, quietly gone.',
          tone: values.tone as ToastOptions['tone'],
        })
      }
    >
      Show toast
    </Button>
  );
}

export const toastDoc: ComponentDoc = {
  id: 'toast',
  name: 'Toast',
  category: 'feedback',
  addedAt: '2026-07-03',
  blurb: 'A frosted notification that arrives, says its piece, and leaves on its own.',
  keywords: ['notification', 'snackbar', 'message'],
  importLine: "import { ToastProvider, useToast } from '@fj';",
  implementation: impl('toast'),
  controls: [
    { type: 'text', prop: 'title', defaultValue: 'Sketch published' },
    { type: 'select', prop: 'tone', options: ['neutral', 'success', 'warn', 'danger', 'info'], defaultValue: 'neutral' },
  ],
  render: (values) => (
    <ToastProvider>
      <ToastDemo values={values} />
    </ToastProvider>
  ),
  code: (v) => `// once, at the app root
<ToastProvider>…</ToastProvider>

// anywhere inside
const push = useToast();
push({ title: '${String(v.title)}', description: 'Quietly delivered.'${
    v.tone !== 'neutral' ? `, tone: '${String(v.tone)}'` : ''
  } });`,
  props: [
    { name: 'ToastProvider position', type: '"bottom-right" | "bottom-left" | "top-right" | "top-left"', defaultValue: '"bottom-right"', description: 'Stack corner.' },
    { name: 'push(options)', type: '{ title, description, tone, duration, icon }', description: 'Returned by useToast(); duration 0 keeps it sticky.' },
  ],
  a11y: [
    'Each toast is role="status" — announced without stealing focus.',
    'Auto-dismiss defaults to 4s; anything requiring action belongs in a dialog, not a toast.',
  ],
};

export const progressDoc: ComponentDoc = {
  id: 'progress',
  name: 'Progress',
  category: 'feedback',
  addedAt: '2026-07-03',
  blurb: 'A slim bar for work you can measure — or an easy drift when you cannot.',
  keywords: ['loading', 'bar', 'percent'],
  importLine: "import { Progress } from '@fj';",
  implementation: impl('progress'),
  controls: [
    { type: 'number', prop: 'value', defaultValue: 64, min: 0, max: 100, step: 1 },
    { type: 'select', prop: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
    { type: 'select', prop: 'accent', options: ['coral', 'sun', 'bloom'], defaultValue: 'coral' },
    { type: 'boolean', prop: 'showLabel', defaultValue: false },
    { type: 'boolean', prop: 'indeterminate', defaultValue: false },
  ],
  render: (v) => (
    <div style={{ width: 'min(360px, 100%)' }}>
      <Progress
        value={Number(v.value)}
        size={v.size as ProgressProps['size']}
        accent={String(v.accent)}
        showLabel={Boolean(v.showLabel)}
        indeterminate={Boolean(v.indeterminate)}
        aria-label="Upload progress"
      />
    </div>
  ),
  props: [
    { name: 'value / max', type: 'number', defaultValue: '0 / 100', description: 'Determinate progress.' },
    { name: 'indeterminate', type: 'boolean', defaultValue: 'false', description: 'Looping drift for unknown durations.' },
    { name: 'accent', type: '"coral" | "sun" | "bloom" | string', defaultValue: '"coral"', description: 'Fill color.' },
    { name: 'size', type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: '5 / 8 / 12 px track.' },
    { name: 'showLabel', type: 'boolean', defaultValue: 'false', description: 'Mono % readout.' },
  ],
  a11y: [
    'role="progressbar" with aria-valuenow on determinate bars.',
    'Indeterminate bars omit aria-valuenow; pair with visible text about what is happening.',
  ],
};

export const spinnerDoc: ComponentDoc = {
  id: 'spinner',
  name: 'Spinner',
  category: 'feedback',
  addedAt: '2026-07-03',
  blurb: 'The smallest honest loading signal — a ring, optionally with a word.',
  keywords: ['loading', 'busy', 'wait'],
  importLine: "import { Spinner } from '@fj';",
  implementation: impl('spinner'),
  controls: [
    { type: 'number', prop: 'size', defaultValue: 22, min: 14, max: 48, step: 2 },
    { type: 'text', prop: 'label', defaultValue: 'Uploading' },
  ],
  render: (v) => <Spinner size={Number(v.size)} label={String(v.label) || undefined} />,
  props: [
    { name: 'size', type: 'number', defaultValue: '22', description: 'Ring diameter in px.' },
    { name: 'color', type: 'string', defaultValue: 'var(--accent)', description: 'Ring color.' },
    { name: 'thickness', type: 'number', defaultValue: '2.5', description: 'Stroke width.' },
    { name: 'label', type: 'string', description: 'Text beside the ring; also the aria-label.' },
  ],
  a11y: [
    'role="status" with an accessible name ("Loading" by default).',
    'Under reduced motion the global kill switch freezes the rotation.',
  ],
};

export const skeletonDoc: ComponentDoc = {
  id: 'skeleton',
  name: 'Skeleton',
  category: 'feedback',
  addedAt: '2026-07-03',
  blurb: 'Shimmering placeholders that hold the layout while content arrives.',
  keywords: ['loading', 'placeholder', 'shimmer'],
  importLine: "import { Skeleton } from '@fj';",
  implementation: impl('skeleton'),
  controls: [
    { type: 'select', prop: 'variant', options: ['text', 'circle', 'rect'], defaultValue: 'text' },
    { type: 'number', prop: 'lines', defaultValue: 3, min: 1, max: 6, step: 1 },
  ],
  render: (v) => (
    <div style={{ width: 'min(320px, 100%)' }}>
      <Skeleton variant={v.variant as SkeletonProps['variant']} lines={Number(v.lines)} />
    </div>
  ),
  examples: [
    {
      title: 'A loading card',
      render: () => (
        <Stack direction="row" gap={14} align="center" style={{ width: 'min(320px, 100%)' }}>
          <Skeleton variant="circle" width={44} />
          <div style={{ flex: 1 }}>
            <Skeleton lines={2} />
          </div>
        </Stack>
      ),
      code: `<Stack direction="row" gap={14} align="center">
  <Skeleton variant="circle" width={44} />
  <div style={{ flex: 1 }}>
    <Skeleton lines={2} />
  </div>
</Stack>`,
    },
  ],
  props: [
    { name: 'variant', type: '"text" | "circle" | "rect"', defaultValue: '"text"', description: 'Placeholder shape.' },
    { name: 'lines', type: 'number', defaultValue: '1', description: 'Text lines (last one shortens).' },
    { name: 'width / height', type: 'number | string', description: 'Dimensions per variant.' },
    { name: 'radius', type: 'number | string', description: 'Corner radius for rect.' },
  ],
  a11y: [
    'Skeletons are decorative — keep them aria-hidden in busy regions and announce loading once with text or role="status".',
    'Match the real content’s shape so nothing jumps when it lands.',
  ],
};

export const emptyStateDoc: ComponentDoc = {
  id: 'empty-state',
  name: 'EmptyState',
  category: 'feedback',
  addedAt: '2026-07-03',
  blurb: 'A kind placeholder for nothing-here moments, with one clear next step.',
  keywords: ['empty', 'zero', 'no results'],
  importLine: "import { EmptyState } from '@fj';",
  implementation: impl('empty-state'),
  controls: [
    { type: 'text', prop: 'title', defaultValue: 'No sketches yet' },
    { type: 'boolean', prop: 'compact', defaultValue: false },
  ],
  render: (v) => (
    <EmptyState
      title={String(v.title)}
      compact={Boolean(v.compact)}
      description="Your studio is quiet. Start something small today."
      action={<Button size="sm">Start a sketch</Button>}
    />
  ),
  code: (v) => `<EmptyState
  title="${String(v.title)}"
  description="Your studio is quiet. Start something small today."
  action={<Button size="sm">Start a sketch</Button>}${v.compact ? '\n  compact' : ''}
/>`,
  props: [
    { name: 'icon', type: 'string', defaultValue: '"inbox"', description: 'Lucide icon name.' },
    { name: 'title', type: 'ReactNode', description: 'Display-type headline.' },
    { name: 'description', type: 'ReactNode', description: 'One calm sentence of guidance.' },
    { name: 'action', type: 'ReactNode', description: 'A single CTA — usually a Button.' },
    { name: 'compact', type: 'boolean', defaultValue: 'false', description: 'Tighter padding for panels.' },
  ],
  a11y: [
    'Headline and description are real text — no meaning hidden in the illustration.',
    'Offer exactly one primary action; empty states are not menus.',
  ],
};
