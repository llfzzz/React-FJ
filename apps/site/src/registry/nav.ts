import { CATEGORY_LABELS, presentCategories, REGISTRY } from './index';

export interface NavItem {
  label: string;
  to: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

const GET_STARTED: NavGroup = {
  label: 'Get started',
  items: [
    { label: 'Introduction', to: '/docs/introduction' },
    { label: 'Installation', to: '/docs/installation' },
    { label: 'Usage', to: '/docs/usage' },
  ],
};

const TOKENS: NavGroup = {
  label: 'Design tokens',
  items: [
    { label: 'Colors', to: '/docs/tokens/colors' },
    { label: 'Typography', to: '/docs/tokens/typography' },
    { label: 'Spacing & elevation', to: '/docs/tokens/spacing' },
    { label: 'Motion', to: '/docs/tokens/motion' },
  ],
};

const EFFECTS: NavGroup = {
  label: 'Effects & Motion',
  items: [
    { label: 'Gallery', to: '/effects' },
    { label: 'Motion & effects guide', to: '/docs/effects-guide' },
  ],
};

/** Sidebar structure: get-started chapters, tokens, effects, then one group per category. */
export function buildNavGroups(): NavGroup[] {
  const componentGroups: NavGroup[] = presentCategories().map((category) => ({
    label: CATEGORY_LABELS[category],
    items: REGISTRY.filter((doc) => doc.category === category).map((doc) => ({
      label: doc.name,
      to: `/components/${doc.id}`,
    })),
  }));
  return [GET_STARTED, TOKENS, EFFECTS, ...componentGroups];
}
