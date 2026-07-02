import { Bookmark, Heart, Pencil, Search, Trash2 } from 'lucide-react';
import { Avatar, IconButton, Stack, StatusDot, Tag, type AvatarProps, type IconButtonProps } from '@fj';
import type { ComponentDoc } from '../types';

export const iconButtonDoc: ComponentDoc = {
  id: 'icon-button',
  name: 'IconButton',
  category: 'core',
  blurb: 'A quiet square for a single icon action. Always labeled, never mysterious.',
  keywords: ['icon', 'action', 'toolbar'],
  importLine: "import { IconButton } from '@fj';",
  controls: [
    { type: 'select', prop: 'variant', options: ['ghost', 'solid', 'outline'], defaultValue: 'ghost' },
    { type: 'select', prop: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
    { type: 'select', prop: 'accent', options: ['coral', 'sun', 'bloom'], defaultValue: 'coral' },
    { type: 'boolean', prop: 'round', defaultValue: true },
    { type: 'boolean', prop: 'disabled', defaultValue: false },
  ],
  render: (v) => (
    <IconButton
      variant={v.variant as IconButtonProps['variant']}
      size={v.size as IconButtonProps['size']}
      accent={String(v.accent)}
      round={Boolean(v.round)}
      disabled={Boolean(v.disabled)}
      aria-label="Appreciate"
    >
      <Heart size={18} aria-hidden />
    </IconButton>
  ),
  code: () => `<IconButton aria-label="Appreciate">
  <Heart size={18} aria-hidden />
</IconButton>`,
  examples: [
    {
      title: 'A small toolbar',
      render: () => (
        <Stack direction="row" gap={8} align="center">
          <IconButton aria-label="Edit">
            <Pencil size={17} aria-hidden />
          </IconButton>
          <IconButton aria-label="Bookmark">
            <Bookmark size={17} aria-hidden />
          </IconButton>
          <IconButton variant="outline" aria-label="Search">
            <Search size={17} aria-hidden />
          </IconButton>
          <IconButton variant="solid" accent="var(--danger-500)" aria-label="Delete">
            <Trash2 size={17} aria-hidden />
          </IconButton>
        </Stack>
      ),
      code: `<IconButton aria-label="Edit"><Pencil size={17} aria-hidden /></IconButton>
<IconButton aria-label="Bookmark"><Bookmark size={17} aria-hidden /></IconButton>
<IconButton variant="outline" aria-label="Search"><Search size={17} aria-hidden /></IconButton>
<IconButton variant="solid" accent="var(--danger-500)" aria-label="Delete">
  <Trash2 size={17} aria-hidden />
</IconButton>`,
    },
  ],
  props: [
    { name: 'variant', type: '"ghost" | "solid" | "outline"', defaultValue: '"ghost"', description: 'Visual style.' },
    { name: 'size', type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: 'Square dimension (32 / 40 / 48 px).' },
    { name: 'accent', type: '"coral" | "sun" | "bloom" | string', defaultValue: '"coral"', description: 'Solid-fill color per instance.' },
    { name: 'round', type: 'boolean', defaultValue: 'true', description: 'Fully rounded vs rounded-square.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the button.' },
  ],
  a11y: [
    'Icon-only buttons must carry an aria-label — the icon alone is not a name.',
    'Mark the icon aria-hidden so screen readers hear only the label.',
    'Minimum touch target is 40px at md; prefer md+ on touch surfaces.',
  ],
};

export const tagDoc: ComponentDoc = {
  id: 'tag',
  name: 'Tag',
  category: 'core',
  blurb: 'A compact chip for topics and filters — with an optional dot, icon, or remove affordance.',
  keywords: ['chip', 'filter', 'topic', 'label'],
  importLine: "import { Tag } from '@fj';",
  controls: [
    { type: 'text', prop: 'children', label: 'Label', defaultValue: 'Sketchbook' },
    { type: 'select', prop: 'accent', options: ['neutral', 'coral', 'sun', 'bloom'], defaultValue: 'neutral' },
    { type: 'boolean', prop: 'dot', defaultValue: false },
    { type: 'boolean', prop: 'selected', defaultValue: false },
  ],
  render: (v) => (
    <Tag accent={String(v.accent)} dot={Boolean(v.dot)} selected={Boolean(v.selected)}>
      {String(v.children)}
    </Tag>
  ),
  examples: [
    {
      title: 'Removable filters',
      render: () => (
        <Stack direction="row" gap={8} wrap>
          <Tag accent="coral" onRemove={() => {}}>
            Ink
          </Tag>
          <Tag accent="bloom" onRemove={() => {}}>
            Charcoal
          </Tag>
          <Tag accent="sun" onRemove={() => {}}>
            Gouache
          </Tag>
        </Stack>
      ),
      code: `<Tag accent="coral" onRemove={clearInk}>Ink</Tag>
<Tag accent="bloom" onRemove={clearCharcoal}>Charcoal</Tag>
<Tag accent="sun" onRemove={clearGouache}>Gouache</Tag>`,
    },
  ],
  props: [
    { name: 'accent', type: '"neutral" | "coral" | "sun" | "bloom" | string', defaultValue: '"neutral"', description: 'Tint — a named accent or any CSS color.' },
    { name: 'dot', type: 'boolean', defaultValue: 'false', description: 'Leading status dot.' },
    { name: 'icon', type: 'ReactNode', description: 'Leading icon node.' },
    { name: 'onRemove', type: '() => void', description: 'Shows a remove (×) button.' },
    { name: 'selected', type: 'boolean', defaultValue: 'false', description: 'Outline for a selected chip.' },
  ],
  a11y: [
    'The remove button ships with aria-label="Remove"; the tag text gives it context.',
    'For toggleable filter chips, prefer a real button wrapper with aria-pressed.',
  ],
};

export const avatarDoc: ComponentDoc = {
  id: 'avatar',
  name: 'Avatar',
  category: 'core',
  blurb: 'A circular portrait with warm initials when no image exists.',
  keywords: ['user', 'profile', 'portrait', 'initials'],
  importLine: "import { Avatar } from '@fj';",
  controls: [
    { type: 'text', prop: 'name', defaultValue: 'June Ito' },
    { type: 'select', prop: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  ],
  render: (v) => <Avatar name={String(v.name)} size={v.size as AvatarProps['size']} />,
  examples: [
    {
      title: 'With presence',
      description: 'Overlay a StatusDot with ring for presence on surfaces.',
      render: () => (
        <Stack direction="row" gap={20} align="center">
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <Avatar name="June Ito" size="lg" />
            <StatusDot tone="online" ring size={11} style={{ position: 'absolute', right: 2, bottom: 2 }} />
          </span>
          <Avatar name="Ana Reyes" />
          <Avatar name="Kofi Mensah" size="sm" />
        </Stack>
      ),
      code: `<span style={{ position: 'relative', display: 'inline-flex' }}>
  <Avatar name="June Ito" size="lg" />
  <StatusDot tone="online" ring size={11}
    style={{ position: 'absolute', right: 2, bottom: 2 }} />
</span>`,
    },
  ],
  props: [
    { name: 'src', type: 'string', description: 'Image URL; initials render when absent.' },
    { name: 'name', type: 'string', description: 'Full name — used for initials and alt text.' },
    { name: 'size', type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: '28 / 40 / 56 px.' },
  ],
  a11y: [
    'The image alt text comes from name — always pass it.',
    'Initials fall back to “?” rather than an empty circle.',
  ],
};
