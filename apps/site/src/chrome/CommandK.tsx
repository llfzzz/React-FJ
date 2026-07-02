import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommandMenu, type Command } from '@fj';
import { CATEGORY_LABELS, REGISTRY } from '../registry';

const CATEGORY_ICONS: Record<string, string> = {
  core: 'square',
  layout: 'layout',
  forms: 'text-cursor-input',
  feedback: 'bell',
  overlay: 'layers',
  navigation: 'compass',
  data: 'table',
  effects: 'sparkles',
};

const PAGES: Array<{ label: string; to: string; icon: string; hint: string }> = [
  { label: 'Home', to: '/', icon: 'home', hint: 'Page' },
  { label: 'Introduction', to: '/docs/introduction', icon: 'book-open', hint: 'Get started' },
  { label: 'Installation', to: '/docs/installation', icon: 'book-open', hint: 'Get started' },
  { label: 'Usage', to: '/docs/usage', icon: 'book-open', hint: 'Get started' },
  { label: 'Color tokens', to: '/docs/tokens/colors', icon: 'palette', hint: 'Tokens' },
  { label: 'Typography tokens', to: '/docs/tokens/typography', icon: 'type', hint: 'Tokens' },
  { label: 'Spacing tokens', to: '/docs/tokens/spacing', icon: 'ruler', hint: 'Tokens' },
  { label: 'Motion tokens', to: '/docs/tokens/motion', icon: 'wind', hint: 'Tokens' },
  { label: 'Component catalog', to: '/components', icon: 'layout-grid', hint: 'Page' },
  { label: 'Theme playground', to: '/playground', icon: 'sliders-horizontal', hint: 'Page' },
];

export function useCommandK() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return { open, openMenu: () => setOpen(true), closeMenu: () => setOpen(false) };
}

export function CommandK({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const commands = useMemo<Command[]>(
    () => [
      ...PAGES.map((page) => ({
        id: page.to,
        label: page.label,
        hint: page.hint,
        icon: page.icon,
        group: page.hint,
        onRun: () => navigate(page.to),
      })),
      ...REGISTRY.map((doc) => ({
        id: `component-${doc.id}`,
        label: doc.name,
        hint: CATEGORY_LABELS[doc.category],
        icon: CATEGORY_ICONS[doc.category],
        group: `${CATEGORY_LABELS[doc.category]} ${doc.keywords?.join(' ') ?? ''} ${doc.blurb}`,
        onRun: () => navigate(`/components/${doc.id}`),
      })),
    ],
    [navigate],
  );
  return (
    <CommandMenu
      open={open}
      onClose={onClose}
      commands={commands}
      placeholder="Search components, docs, tokens…"
    />
  );
}
