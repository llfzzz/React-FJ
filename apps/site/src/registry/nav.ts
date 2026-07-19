import { CATEGORY_LABELS, docPath, effectDocs, presentCategories, componentDocs } from './index';

export interface NavItem {
  label: string;
  to: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** A top-level module of the sidebar. Untitled sections render groups only. */
export interface NavSection {
  label?: string;
  groups: NavGroup[];
}

const GET_STARTED: NavGroup = {
  label: 'Get started',
  items: [
    { label: 'Introduction', to: '/docs/introduction' },
    { label: 'Installation', to: '/docs/installation' },
    { label: 'Usage', to: '/docs/usage' },
  ],
};

/**
 * Sidebar structure — three sections: get-started chapters, the Components
 * module (one group per broad category), and the Animation module (overview
 * pages + every animation under the single "Animation types" group).
 */
export function buildNavSections(): NavSection[] {
  const componentGroups: NavGroup[] = presentCategories().map((category) => ({
    label: CATEGORY_LABELS[category],
    items: componentDocs()
      .filter((doc) => doc.category === category)
      .map((doc) => ({ label: doc.name, to: docPath(doc) })),
  }));
  const animationGroups: NavGroup[] = [
    {
      label: 'Overview',
      items: [
        { label: 'Gallery', to: '/animation' },
        { label: 'Animation guide', to: '/docs/effects-guide' },
      ],
    },
    {
      label: CATEGORY_LABELS.animation,
      items: effectDocs().map((doc) => ({ label: doc.name, to: docPath(doc) })),
    },
  ];
  return [
    { groups: [GET_STARTED] },
    { label: 'Components', groups: componentGroups },
    { label: 'Animation', groups: animationGroups },
  ];
}
