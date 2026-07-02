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

/** Sidebar structure: get-started chapters, then one group per category. */
export function buildNavGroups(): NavGroup[] {
  const componentGroups: NavGroup[] = presentCategories().map((category) => ({
    label: CATEGORY_LABELS[category],
    items: REGISTRY.filter((doc) => doc.category === category).map((doc) => ({
      label: doc.name,
      to: `/components/${doc.id}`,
    })),
  }));
  return [GET_STARTED, ...componentGroups];
}
