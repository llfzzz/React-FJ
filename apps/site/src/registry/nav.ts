import {
  CATEGORY_LABELS,
  componentDocs,
  docPath,
  effectDocs,
  presentAnimationCategories,
  presentCategories,
} from './index';

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
    { label: 'Index', to: '/animation' },
    { label: 'Usage', to: '/docs/usage' },
  ],
};

/**
 * Sidebar structure — three sections: get-started chapters (including the
 * animation Index), the Components module, and the Animation module. Both
 * modules list every item directly under its broad category — no overview
 * pages, no deeper nesting. Everything derives from the registry, the one
 * canonical metadata source.
 */
export function buildNavSections(): NavSection[] {
  const componentGroups: NavGroup[] = presentCategories().map((category) => ({
    label: CATEGORY_LABELS[category],
    items: componentDocs()
      .filter((doc) => doc.category === category)
      .map((doc) => ({ label: doc.name, to: docPath(doc) })),
  }));
  const animationGroups: NavGroup[] = presentAnimationCategories().map((category) => ({
    label: CATEGORY_LABELS[category],
    items: effectDocs()
      .filter((doc) => doc.category === category)
      .map((doc) => ({ label: doc.name, to: docPath(doc) })),
  }));
  return [
    { groups: [GET_STARTED] },
    { label: 'Components', groups: componentGroups },
    { label: 'Animation', groups: animationGroups },
  ];
}
