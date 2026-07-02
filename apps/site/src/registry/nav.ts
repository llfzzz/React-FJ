export interface NavItem {
  label: string;
  to: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Sidebar structure. Component categories are appended as the catalog grows. */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Get started',
    items: [
      { label: 'Introduction', to: '/docs/introduction' },
      { label: 'Installation', to: '/docs/installation' },
      { label: 'Usage', to: '/docs/usage' },
    ],
  },
];
