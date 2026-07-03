import { useState } from 'react';
import { ErrorShake, LoaderDots, SuccessCheck } from '@fj-effects';
import { Input } from '@fj';
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
