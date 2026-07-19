import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommandMenu, type Command } from '@fj';
import { CATEGORY_LABELS, docPath, REGISTRY } from '../registry';

const CATEGORY_ICONS: Record<string, string> = {
  inputs: 'text-cursor-input',
  navigation: 'compass',
  content: 'table',
  feedback: 'bell',
  'anim-entrance': 'arrow-up-from-line',
  'anim-text': 'type',
  'anim-interaction': 'mouse-pointer-click',
  'anim-ambient': 'sparkles',
  'anim-transition': 'arrow-left-right',
  'anim-status': 'activity',
};

const PAGES: Array<{ label: string; to: string; icon: string; hint: string }> = [
  { label: 'Home', to: '/', icon: 'home', hint: 'Page' },
  { label: 'Introduction', to: '/docs/introduction', icon: 'book-open', hint: 'Get started' },
  { label: 'Installation', to: '/docs/installation', icon: 'book-open', hint: 'Get started' },
  { label: 'Usage', to: '/docs/usage', icon: 'book-open', hint: 'Get started' },
  { label: 'Component catalog', to: '/components', icon: 'layout-grid', hint: 'Page' },
  { label: 'Animation index', to: '/animation', icon: 'sparkles', hint: 'Page' },
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
        group: `${CATEGORY_LABELS[doc.category]} ${doc.keywords?.join(' ') ?? ''} ${doc.blurb} ${doc.importLine} ${doc.status ?? ''}`,
        onRun: () => navigate(docPath(doc)),
      })),
    ],
    [navigate],
  );
  return (
    <CommandMenu
      open={open}
      onClose={onClose}
      commands={commands}
      placeholder="Search components, animations, docs…"
    />
  );
}
