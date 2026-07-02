import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Checkbox,
  Input,
  RadioGroup,
  Select,
  Slider,
  Switch,
  Textarea,
  type InputProps,
  type SelectProps,
} from '@fj';
import type { ComponentDoc, ControlValues } from '../types';

export const inputDoc: ComponentDoc = {
  id: 'input',
  name: 'Input',
  category: 'forms',
  blurb: 'A labeled text field with hint and error states — calm until it needs your attention.',
  keywords: ['text', 'field', 'form'],
  importLine: "import { Input } from '@fj';",
  controls: [
    { type: 'text', prop: 'label', defaultValue: 'Studio name' },
    { type: 'text', prop: 'placeholder', defaultValue: 'e.g. Morning pages' },
    { type: 'select', prop: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
    { type: 'text', prop: 'hint', defaultValue: 'Visible only to your circle.' },
    { type: 'text', prop: 'error', defaultValue: '' },
    { type: 'boolean', prop: 'disabled', defaultValue: false },
  ],
  render: (v) => (
    <Input
      label={String(v.label)}
      placeholder={String(v.placeholder)}
      size={v.size as InputProps['size']}
      hint={String(v.hint) || undefined}
      error={String(v.error) || undefined}
      disabled={Boolean(v.disabled)}
      style={{ width: 'min(320px, 100%)' }}
    />
  ),
  examples: [
    {
      title: 'With a leading icon',
      render: () => (
        <Input
          label="Search your studio"
          placeholder="Sketch, note, or circle"
          iconLeft={<Search size={16} aria-hidden />}
          style={{ width: 'min(320px, 100%)' }}
        />
      ),
      code: `<Input
  label="Search your studio"
  placeholder="Sketch, note, or circle"
  iconLeft={<Search size={16} aria-hidden />}
/>`,
    },
  ],
  props: [
    { name: 'label', type: 'string', description: 'Field label rendered above, linked via htmlFor.' },
    { name: 'hint', type: 'string', description: 'Helper text below the field.' },
    { name: 'error', type: 'string', description: 'Error message — red border, overrides hint.' },
    { name: 'iconLeft', type: 'ReactNode', description: 'Icon inside the field, before the text.' },
    { name: 'size', type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: '36 / 44 / 52 px height.' },
  ],
  a11y: [
    'The label is a real <label> tied to the input id — click-to-focus works.',
    'Focus draws the accent border plus the 3px coral ring.',
    'Error text is placed directly under the field; pair with aria-invalid in your form logic.',
  ],
};

export const textareaDoc: ComponentDoc = {
  id: 'textarea',
  name: 'Textarea',
  category: 'forms',
  blurb: 'The multi-line sibling of Input — same calm labels, hints, and error states.',
  keywords: ['multiline', 'text', 'form'],
  importLine: "import { Textarea } from '@fj';",
  controls: [
    { type: 'text', prop: 'label', defaultValue: 'A note about the light' },
    { type: 'number', prop: 'rows', defaultValue: 4, min: 2, max: 10, step: 1 },
    { type: 'text', prop: 'error', defaultValue: '' },
  ],
  render: (v) => (
    <Textarea
      label={String(v.label)}
      rows={Number(v.rows)}
      error={String(v.error) || undefined}
      placeholder="Soft, from the north window…"
      style={{ width: 'min(360px, 100%)' }}
    />
  ),
  props: [
    { name: 'label', type: 'string', description: 'Field label rendered above.' },
    { name: 'hint', type: 'string', description: 'Helper text below.' },
    { name: 'error', type: 'string', description: 'Error message — red border, overrides hint.' },
    { name: 'rows', type: 'number', defaultValue: '4', description: 'Initial visible rows; resizable vertically.' },
  ],
  a11y: [
    'Label and control are linked; hint/error sits directly below the field.',
    'Vertical resize stays enabled — never trap content.',
  ],
};

export const selectDoc: ComponentDoc = {
  id: 'select',
  name: 'Select',
  category: 'forms',
  blurb: 'A native select in Free Joy clothing — dependable keyboard behavior, quiet chevron.',
  keywords: ['dropdown', 'options', 'form'],
  importLine: "import { Select } from '@fj';",
  controls: [
    { type: 'text', prop: 'label', defaultValue: 'Share with' },
    { type: 'select', prop: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
    { type: 'text', prop: 'error', defaultValue: '' },
    { type: 'boolean', prop: 'disabled', defaultValue: false },
  ],
  render: (v) => (
    <Select
      label={String(v.label)}
      size={v.size as SelectProps['size']}
      error={String(v.error) || undefined}
      disabled={Boolean(v.disabled)}
      options={['Only me', 'My circle', 'Anyone with the link']}
      style={{ width: 'min(280px, 100%)' }}
    />
  ),
  code: () => `<Select
  label="Share with"
  options={['Only me', 'My circle', 'Anyone with the link']}
/>`,
  props: [
    { name: 'options', type: 'Array<string | { label, value }>', description: 'Options as strings or label/value pairs.' },
    { name: 'label', type: 'string', description: 'Field label rendered above.' },
    { name: 'hint', type: 'string', description: 'Helper text below.' },
    { name: 'error', type: 'string', description: 'Error message — red border, overrides hint.' },
    { name: 'size', type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: '36 / 44 / 52 px height.' },
  ],
  a11y: [
    'Built on the native <select>: full keyboard and screen-reader behavior for free.',
    'The chevron is decorative (pointer-events: none) — the whole field is the target.',
  ],
};

function CheckboxDemo({ values }: { values: ControlValues }) {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox
      checked={checked}
      onChange={setChecked}
      label={String(values.label)}
      disabled={Boolean(values.disabled)}
    />
  );
}

export const checkboxDoc: ComponentDoc = {
  id: 'checkbox',
  name: 'Checkbox',
  category: 'forms',
  blurb: 'A crisp check for independent yes/no choices.',
  keywords: ['check', 'toggle', 'form'],
  importLine: "import { Checkbox } from '@fj';",
  controls: [
    { type: 'text', prop: 'label', defaultValue: 'Include work-in-progress' },
    { type: 'boolean', prop: 'disabled', defaultValue: false },
  ],
  render: (values) => <CheckboxDemo values={values} />,
  code: (v) => `const [checked, setChecked] = useState(true);

<Checkbox
  checked={checked}
  onChange={setChecked}
  label="${String(v.label)}"${v.disabled ? '\n  disabled' : ''}
/>`,
  props: [
    { name: 'checked', type: 'boolean', defaultValue: 'false', description: 'Controlled checked state.' },
    { name: 'onChange', type: '(checked, event) => void', description: 'Change handler.' },
    { name: 'label', type: 'string', description: 'Inline label, part of the click target.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables at 50% opacity.' },
  ],
  a11y: [
    'A real hidden <input type="checkbox"> carries the state — Space toggles, forms submit.',
    'The label wraps the control, so the whole row is clickable.',
  ],
};

function RadioDemo({ values }: { values: ControlValues }) {
  const [value, setValue] = useState('My circle');
  return (
    <div style={{ opacity: values.disabled ? 0.5 : 1 }}>
      <RadioGroup
        value={value}
        onChange={setValue}
        options={['Only me', 'My circle', 'Anyone with the link']}
      />
    </div>
  );
}

export const radioDoc: ComponentDoc = {
  id: 'radio',
  name: 'Radio',
  category: 'forms',
  blurb: 'One choice from a short list — RadioGroup keeps the set tidy.',
  keywords: ['choice', 'group', 'form'],
  importLine: "import { Radio, RadioGroup } from '@fj';",
  controls: [{ type: 'boolean', prop: 'disabled', label: 'dim (demo)', defaultValue: false }],
  render: (values) => <RadioDemo values={values} />,
  code: () => `const [value, setValue] = useState('My circle');

<RadioGroup
  value={value}
  onChange={setValue}
  options={['Only me', 'My circle', 'Anyone with the link']}
/>`,
  props: [
    { name: 'value', type: 'string', description: 'RadioGroup: selected value.' },
    { name: 'onChange', type: '(value, event) => void', description: 'RadioGroup: change handler.' },
    { name: 'options', type: 'Array<string | { label, value }>', description: 'RadioGroup: the choices.' },
    { name: 'name', type: 'string', description: 'Shared input name (auto-generated by RadioGroup).' },
  ],
  a11y: [
    'RadioGroup renders role="radiogroup" over native radio inputs — arrow keys move the selection.',
    'Use radios for 2–5 visible options; longer lists belong in a Select.',
  ],
};

function SwitchDemo({ values }: { values: ControlValues }) {
  const [checked, setChecked] = useState(true);
  return (
    <Switch
      checked={checked}
      onChange={setChecked}
      label={String(values.label)}
      disabled={Boolean(values.disabled)}
    />
  );
}

export const switchDoc: ComponentDoc = {
  id: 'switch',
  name: 'Switch',
  category: 'forms',
  blurb: 'An instant on/off toggle — for settings that apply the moment you flip them.',
  keywords: ['toggle', 'setting', 'on', 'off'],
  importLine: "import { Switch } from '@fj';",
  controls: [
    { type: 'text', prop: 'label', defaultValue: 'Quiet mode' },
    { type: 'boolean', prop: 'disabled', defaultValue: false },
  ],
  render: (values) => <SwitchDemo values={values} />,
  code: (v) => `const [on, setOn] = useState(true);

<Switch checked={on} onChange={setOn} label="${String(v.label)}" />`,
  props: [
    { name: 'checked', type: 'boolean', defaultValue: 'false', description: 'Controlled state.' },
    { name: 'onChange', type: '(checked, event) => void', description: 'Change handler.' },
    { name: 'label', type: 'string', description: 'Inline label to the right of the track.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables at 50% opacity.' },
  ],
  a11y: [
    'Backed by a hidden checkbox input — Space toggles it, labels announce it.',
    'Use Switch for immediate effect; use Checkbox inside forms that submit.',
  ],
};

function SliderDemo({ values }: { values: ControlValues }) {
  const [value, setValue] = useState(40);
  return (
    <div style={{ width: 'min(320px, 100%)' }}>
      <Slider
        value={value}
        onChange={setValue}
        accent={String(values.accent)}
        showValue={Boolean(values.showValue)}
        disabled={Boolean(values.disabled)}
        aria-label="Brush opacity"
      />
    </div>
  );
}

export const sliderDoc: ComponentDoc = {
  id: 'slider',
  name: 'Slider',
  category: 'forms',
  blurb: 'A single-thumb range with a filled track — for values you feel more than type.',
  keywords: ['range', 'value', 'form'],
  importLine: "import { Slider } from '@fj';",
  controls: [
    { type: 'select', prop: 'accent', options: ['coral', 'sun', 'bloom'], defaultValue: 'coral' },
    { type: 'boolean', prop: 'showValue', defaultValue: false },
    { type: 'boolean', prop: 'disabled', defaultValue: false },
  ],
  render: (values) => <SliderDemo values={values} />,
  code: (v) => `const [value, setValue] = useState(40);

<Slider value={value} onChange={setValue}${v.showValue ? ' showValue' : ''}${
    v.accent !== 'coral' ? ` accent="${String(v.accent)}"` : ''
  } aria-label="Brush opacity" />`,
  props: [
    { name: 'value', type: 'number', description: 'Controlled value.' },
    { name: 'min / max / step', type: 'number', defaultValue: '0 / 100 / 1', description: 'Range bounds and step.' },
    { name: 'onChange', type: '(value) => void', description: 'Change handler.' },
    { name: 'accent', type: '"coral" | "sun" | "bloom" | string', defaultValue: '"coral"', description: 'Fill and thumb color.' },
    { name: 'showValue', type: 'boolean', defaultValue: 'false', description: 'Mono value readout beside the track.' },
  ],
  a11y: [
    'A native <input type="range"> drives it — arrows adjust, Home/End jump.',
    'Give unlabeled sliders an aria-label describing the value they set.',
  ],
};
