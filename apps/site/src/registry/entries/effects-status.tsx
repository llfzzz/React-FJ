import { useState } from 'react';
import { ErrorShake, LoaderDots, NumberTicker, PingDot, ProgressRing, SuccessCheck, type PingDotProps } from '@fj-effects';
import { Button, Card, Input, Text } from '@fj';
import type { ComponentDoc, ControlValues } from '../types';
import { impl } from '../impl';

const replayKey = (values: ControlValues) => JSON.stringify(values);

export const successCheckDoc: ComponentDoc = {
  id: 'success-check',
  name: 'SuccessCheck',
  category: 'effects-status',
  blurb: 'An SVG checkmark that draws itself in, with a soft ring — for confirmations.',
  keywords: ['success', 'check', 'confirm', 'complete', 'animation'],
  importLine: "import { SuccessCheck } from '@fj-effects';",
  implementation: impl('success-check'),
  replayable: true,
  controls: [
    { type: 'number', prop: 'size', defaultValue: 48, min: 24, max: 96, step: 8 },
    { type: 'number', prop: 'duration', defaultValue: 500, min: 200, max: 1000, step: 50 },
    { type: 'boolean', prop: 'ring', defaultValue: true },
  ],
  render: (v) => (
    <span key={replayKey(v)}>
      <SuccessCheck size={Number(v.size)} duration={Number(v.duration)} ring={Boolean(v.ring)} />
    </span>
  ),
  code: (v) => `<SuccessCheck${v.size !== 48 ? ` size={${Number(v.size)}}` : ''}${
    v.ring === false ? ' ring={false}' : ''
  } />`,
  props: [
    { name: 'size', type: 'number', defaultValue: '48', description: 'Pixel diameter.' },
    { name: 'color', type: 'string', defaultValue: 'var(--success-500)', description: 'Check + ring color.' },
    { name: 'duration', type: 'number', defaultValue: '500', description: 'Stroke-draw duration in ms.' },
    { name: 'ring', type: 'boolean', defaultValue: 'true', description: 'Show the soft pulsing ring.' },
    { name: 'trigger', type: '"mount" | "inview" | "manual"', defaultValue: '"mount"', description: 'When to play.' },
  ],
  a11y: [
    'Exposes role="img" with an accessible label (default "Success") — the SVG is aria-hidden.',
    'Reduced motion shows the finished check instantly, ring suppressed.',
    'Pair with a text confirmation — the check is reinforcement, not the only signal.',
  ],
};

export const errorShakeDoc: ComponentDoc = {
  id: 'error-shake',
  name: 'ErrorShake',
  category: 'effects-status',
  blurb: 'A short shake (error) or warning pulse, played when a value flips to invalid.',
  keywords: ['error', 'shake', 'warning', 'invalid', 'form', 'animation'],
  importLine: "import { ErrorShake } from '@fj-effects';",
  implementation: impl('error-shake'),
  replayable: true,
  controls: [
    { type: 'select', prop: 'mode', options: ['error', 'warning'], defaultValue: 'error' },
    { type: 'number', prop: 'intensity', defaultValue: 4, min: 2, max: 10, step: 1 },
  ],
  render: (v) => <ErrorShakeDemo mode={v.mode as 'error' | 'warning'} intensity={Number(v.intensity)} />,
  code: (v) => `const [invalid, setInvalid] = useState(false);

<ErrorShake mode="${String(v.mode)}"${v.intensity !== 4 ? ` intensity={${Number(v.intensity)}}` : ''} active={invalid}>
  <Input error={invalid ? 'Required' : undefined} />
</ErrorShake>`,
  props: [
    { name: 'mode', type: '"error" | "warning"', defaultValue: '"error"', description: '"error" shakes; "warning" pulses a ring.' },
    { name: 'active', type: 'boolean', description: 'Play when this flips to true.' },
    { name: 'intensity', type: 'number', defaultValue: '4', description: 'Shake amplitude in px.' },
    { name: 'duration', type: 'number', defaultValue: '400', description: 'Animation duration in ms.' },
    { name: 'onDone', type: '() => void', description: 'Called when the animation ends.' },
  ],
  a11y: [
    'Motion reinforces an error you must also convey in text (e.g. the field’s error message).',
    'Under reduced motion it flashes a ring once instead of shaking.',
    'Keep it to a single play per validation — never a looping shake.',
  ],
};

function ErrorShakeDemo({ mode, intensity }: { mode: 'error' | 'warning'; intensity: number }) {
  const [active, setActive] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <ErrorShake mode={mode} intensity={intensity} active={active} onDone={() => setActive(false)}>
        <Input error={active ? 'This field is required' : undefined} placeholder="Your handle" style={{ width: 240 }} />
      </ErrorShake>
      <button type="button" className="showcase-reset" onClick={() => setActive(true)}>
        Trigger {mode}
      </button>
    </div>
  );
}

export const loaderDotsDoc: ComponentDoc = {
  id: 'loader-dots',
  name: 'LoaderDots',
  category: 'effects-status',
  blurb: 'Three dots that pulse in sequence — a calmer, playful loader for inline states.',
  keywords: ['loader', 'dots', 'loading', 'spinner', 'animation'],
  importLine: "import { LoaderDots } from '@fj-effects';",
  implementation: impl('loader-dots'),
  controls: [
    { type: 'number', prop: 'size', defaultValue: 8, min: 4, max: 16, step: 1 },
    { type: 'number', prop: 'speed', defaultValue: 1, min: 0.5, max: 2, step: 0.1 },
  ],
  render: (v) => <LoaderDots size={Number(v.size)} speed={Number(v.speed)} />,
  code: (v) => `<LoaderDots${v.size !== 8 ? ` size={${Number(v.size)}}` : ''}${
    v.speed !== 1 ? ` speed={${Number(v.speed)}}` : ''
  } />`,
  props: [
    { name: 'size', type: 'number', defaultValue: '8', description: 'Dot diameter in px.' },
    { name: 'gap', type: 'number', defaultValue: '6', description: 'Gap between dots in px.' },
    { name: 'color', type: 'string', defaultValue: 'var(--accent)', description: 'Dot color.' },
    { name: 'speed', type: 'number', defaultValue: '1', description: 'Speed multiplier.' },
    { name: 'label', type: 'string', defaultValue: '"Loading"', description: 'Accessible status label.' },
  ],
  a11y: [
    'Exposes role="status" with an accessible label so assistive tech announces the busy state.',
    'Under reduced motion the dots hold at a steady mid-opacity instead of pulsing.',
    'The dots themselves are aria-hidden — the label carries the meaning.',
  ],
};

export const progressRingDoc: ComponentDoc = {
  id: 'progress-ring',
  name: 'ProgressRing',
  category: 'effects-status',
  blurb: 'A circular progress ring that sweeps to its value — goals, scores, upload completion.',
  keywords: ['progress', 'ring', 'circular', 'percent', 'gauge', 'animation'],
  importLine: "import { ProgressRing } from '@fj-effects';",
  implementation: impl('progress-ring'),
  replayable: true,
  controls: [
    { type: 'number', prop: 'value', defaultValue: 72, min: 0, max: 100, step: 5 },
    { type: 'number', prop: 'size', defaultValue: 48, min: 32, max: 96, step: 8 },
    { type: 'boolean', prop: 'showValue', defaultValue: true },
  ],
  render: (v) => (
    <span key={replayKey(v)}>
      <ProgressRing value={Number(v.value)} size={Number(v.size)} showValue={Boolean(v.showValue)} />
    </span>
  ),
  code: (v) => `<ProgressRing value={${Number(v.value)}}${v.size !== 48 ? ` size={${Number(v.size)}}` : ''}${
    v.showValue !== false ? ' showValue' : ''
  } />`,
  props: [
    { name: 'value', type: 'number', description: 'Progress 0–100 (clamped).' },
    { name: 'size', type: 'number', defaultValue: '48', description: 'Pixel diameter.' },
    { name: 'strokeWidth', type: 'number', defaultValue: '4', description: 'Ring stroke width in px.' },
    { name: 'color', type: 'string', defaultValue: 'var(--accent)', description: 'Value-arc color.' },
    { name: 'duration', type: 'number', defaultValue: '600', description: 'Sweep duration in ms.' },
    { name: 'showValue', type: 'boolean', defaultValue: 'false', description: 'Show the % label in the center.' },
    { name: 'trigger', type: '"mount" | "inview" | "manual"', defaultValue: '"mount"', description: 'When to sweep in.' },
  ],
  a11y: [
    'Exposes role="progressbar" with aria-valuenow/min/max and a label; the SVG and % text are aria-hidden.',
    'Reduced motion renders the final value instantly; later value changes jump with no sweep.',
    'For indeterminate waiting use Spinner; for linear completion use Progress — the ring is for scored values.',
  ],
};

const PING_TONES: Record<string, string> = {
  accent: 'var(--accent)',
  success: 'var(--success-500)',
  danger: 'var(--danger-500)',
};

export const pingDotDoc: ComponentDoc = {
  id: 'ping-dot',
  name: 'PingDot',
  category: 'effects-status',
  blurb: 'A notification dot with a radiating echo, pinned to a corner — “something new here”.',
  keywords: ['ping', 'dot', 'notification', 'badge', 'pulse', 'animation'],
  importLine: "import { PingDot } from '@fj-effects';",
  implementation: impl('ping-dot'),
  controls: [
    { type: 'select', prop: 'tone', options: ['accent', 'success', 'danger'], defaultValue: 'accent' },
    { type: 'number', prop: 'size', defaultValue: 10, min: 6, max: 16, step: 1 },
    { type: 'number', prop: 'speed', defaultValue: 1, min: 0.5, max: 2, step: 0.1 },
    { type: 'select', prop: 'position', options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'], defaultValue: 'top-right' },
  ],
  render: (v) => (
    <PingDot
      color={PING_TONES[String(v.tone)]}
      size={Number(v.size)}
      speed={Number(v.speed)}
      position={v.position as PingDotProps['position']}
    >
      <Button>Inbox</Button>
    </PingDot>
  ),
  code: (v) => `<PingDot${v.tone !== 'accent' ? ` color="${PING_TONES[String(v.tone)]}"` : ''}${
    v.size !== 10 ? ` size={${Number(v.size)}}` : ''
  }${v.position !== 'top-right' ? ` position="${String(v.position)}"` : ''}>
  <Button>Inbox</Button>
</PingDot>`,
  props: [
    { name: 'size', type: 'number', defaultValue: '10', description: 'Dot diameter in px.' },
    { name: 'color', type: 'string', defaultValue: 'var(--accent)', description: 'Dot color.' },
    { name: 'speed', type: 'number', defaultValue: '1', description: 'Echo speed multiplier.' },
    { name: 'position', type: '"top-right" | "top-left" | "bottom-right" | "bottom-left"', defaultValue: '"top-right"', description: 'Corner to pin to (with children).' },
    { name: 'label', type: 'string', defaultValue: '"New activity"', description: 'Accessible status label.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Steady dot, no echo.' },
  ],
  a11y: [
    'Exposes role="status" with an accessible label; the echo layer is aria-hidden.',
    'Under reduced motion (or disabled) the echo is gone but the solid dot keeps the meaning.',
    'Pair with a count or text for real notifications; for semantic status colors see StatusDot.',
  ],
};

export const numberTickerDoc: ComponentDoc = {
  id: 'number-ticker',
  name: 'NumberTicker',
  category: 'effects-status',
  blurb: 'Odometer-style digit columns that roll to the value on change — live stats and scores.',
  keywords: ['number', 'ticker', 'odometer', 'counter', 'stats', 'animation'],
  importLine: "import { NumberTicker } from '@fj-effects';",
  implementation: impl('number-ticker'),
  // Not replayable on purpose: changing the value knob IS the demo — the
  // columns roll in place (a remount would snap to the target).
  controls: [
    { type: 'number', prop: 'value', defaultValue: 1234, min: 0, max: 9999, step: 1 },
    { type: 'number', prop: 'duration', defaultValue: 600, min: 200, max: 1200, step: 100 },
    { type: 'number', prop: 'padTo', defaultValue: 4, min: 0, max: 6, step: 1 },
  ],
  render: (v) => (
    <Card style={{ textAlign: 'center', minWidth: 180 }}>
      <Text variant="small" as="p">
        Plays this week
      </Text>
      <Text variant="h3" as="div">
        <NumberTicker value={Number(v.value)} duration={Number(v.duration)} padTo={Number(v.padTo)} />
      </Text>
    </Card>
  ),
  code: (v) => `<NumberTicker value={plays}${v.duration !== 600 ? ` duration={${Number(v.duration)}}` : ''}${
    Number(v.padTo) !== 0 ? ` padTo={${Number(v.padTo)}}` : ''
  } />`,
  props: [
    { name: 'value', type: 'number', description: 'The number to display; changing it rolls the digits.' },
    { name: 'duration', type: 'number', defaultValue: '600', description: 'ms per roll.' },
    { name: 'padTo', type: 'number', defaultValue: '0', description: "Minimum digit count, left-padded with 0 so columns don't pop in." },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Plain text, no rolling columns.' },
  ],
  a11y: [
    'The whole value is exposed as one accessible label; the rolling digit columns are aria-hidden.',
    'Assistive tech never reads a mid-roll number — the label always carries the target value, and reduced motion snaps the columns to it.',
    'Tabular numerals keep column widths fixed, so rolling digits never shift surrounding layout. (CountUp interpolates a value over time; NumberTicker rolls columns on change.)',
  ],
};
