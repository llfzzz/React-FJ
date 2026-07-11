import { ArrowRight, Heart } from 'lucide-react';
import { Button, Stack, type ButtonProps } from '@fj';
import type { ComponentDoc } from '../types';
import { impl } from '../impl';

export const buttonDoc: ComponentDoc = {
  id: 'button',
  name: 'Button',
  category: 'core',
  blurb: 'The pill-shaped action. One vivid fill for the primary path; quiet variants for everything else.',
  keywords: ['action', 'cta', 'submit', 'press'],
  importLine: "import { Button } from '@fj';",
  implementation: impl('button', {
    notes: {
      css: 'Hover, press scale, focus ring, disabled and loading all live in Button.css — the component only composes class names.',
      tailwind: 'Utilities point at FJ token variables, so a retheme keeps working unchanged.',
    },
  }),
  controls: [
    { type: 'text', prop: 'children', label: 'Label', defaultValue: 'Start free' },
    { type: 'select', prop: 'variant', options: ['primary', 'secondary', 'ghost', 'danger'], defaultValue: 'primary' },
    { type: 'select', prop: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
    { type: 'select', prop: 'accent', options: ['coral', 'sun', 'bloom'], defaultValue: 'coral' },
    { type: 'boolean', prop: 'loading', defaultValue: false },
    { type: 'boolean', prop: 'disabled', defaultValue: false },
    { type: 'boolean', prop: 'full', label: 'Full width', defaultValue: false },
  ],
  render: (v) => (
    <Button
      variant={v.variant as ButtonProps['variant']}
      size={v.size as ButtonProps['size']}
      accent={String(v.accent)}
      loading={Boolean(v.loading)}
      disabled={Boolean(v.disabled)}
      full={Boolean(v.full)}
    >
      {String(v.children)}
    </Button>
  ),
  examples: [
    {
      title: 'With icons',
      description: 'Pass any icon node — the label stays the accessible name.',
      render: () => (
        <Stack direction="row" gap={12} wrap align="center">
          <Button iconLeft={<Heart size={16} aria-hidden />}>Appreciate</Button>
          <Button variant="secondary" iconRight={<ArrowRight size={16} aria-hidden />}>
            Continue
          </Button>
        </Stack>
      ),
      code: `<Button iconLeft={<Heart size={16} aria-hidden />}>Appreciate</Button>
<Button variant="secondary" iconRight={<ArrowRight size={16} aria-hidden />}>
  Continue
</Button>`,
    },
    {
      title: 'States',
      description: 'Loading blocks interaction and announces itself with aria-busy.',
      render: () => (
        <Stack direction="row" gap={12} wrap align="center">
          <Button loading>Saving</Button>
          <Button disabled>Unavailable</Button>
          <Button variant="danger">Delete sketchbook</Button>
        </Stack>
      ),
      code: `<Button loading>Saving</Button>
<Button disabled>Unavailable</Button>
<Button variant="danger">Delete sketchbook</Button>`,
    },
  ],
  props: [
    { name: 'variant', type: '"primary" | "secondary" | "ghost" | "danger"', defaultValue: '"primary"', description: 'Visual style.' },
    { name: 'size', type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: 'Control height (36 / 44 / 54 px).' },
    { name: 'accent', type: '"coral" | "sun" | "bloom" | string', defaultValue: '"coral"', description: 'Recolors the primary fill per instance — a named accent or any CSS color.' },
    { name: 'iconLeft', type: 'ReactNode', description: 'Icon node rendered before the label.' },
    { name: 'iconRight', type: 'ReactNode', description: 'Icon node rendered after the label.' },
    { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Shows a spinner, blocks interaction, sets aria-busy.' },
    { name: 'full', type: 'boolean', defaultValue: 'false', description: 'Stretch to fill the container width.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the button at 45% opacity.' },
  ],
  a11y: [
    'Renders a native <button>, so Space and Enter activate it and it participates in the tab order.',
    'Keyboard focus shows the 3px coral focus ring (:focus-visible) — never remove it.',
    'loading sets aria-busy and disables the control; the label stays visible beside the spinner.',
    'Icon-only actions belong to IconButton, which requires an aria-label.',
  ],
};
