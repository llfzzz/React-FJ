import type { ReactNode } from 'react';

export type Category =
  | 'core'
  | 'layout'
  | 'forms'
  | 'feedback'
  | 'overlay'
  | 'navigation'
  | 'data'
  | 'effects';

export const CATEGORY_LABELS: Record<Category, string> = {
  core: 'Core',
  layout: 'Layout',
  forms: 'Forms',
  feedback: 'Feedback',
  overlay: 'Overlay',
  navigation: 'Navigation',
  data: 'Data',
  effects: 'Effects',
};

export const CATEGORY_ORDER: Category[] = [
  'core',
  'layout',
  'forms',
  'feedback',
  'overlay',
  'navigation',
  'data',
  'effects',
];

/** Values a playground control can produce. */
export type ControlValue = string | number | boolean;
export type ControlValues = Record<string, ControlValue>;

interface ControlBase {
  /** Prop name this control drives (also the key in ControlValues). */
  prop: string;
  /** Human label; defaults to the prop name. */
  label?: string;
}

export interface SelectControl extends ControlBase {
  type: 'select';
  options: readonly string[];
  defaultValue: string;
}

export interface BooleanControl extends ControlBase {
  type: 'boolean';
  defaultValue: boolean;
}

export interface TextControl extends ControlBase {
  type: 'text';
  defaultValue: string;
  placeholder?: string;
}

export interface NumberControl extends ControlBase {
  type: 'number';
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
}

export type ControlDef = SelectControl | BooleanControl | TextControl | NumberControl;

/** The four code styles the implementation switcher offers. */
export type ImplFormat = 'js' | 'ts' | 'css' | 'tailwind';

export const IMPL_FORMAT_LABELS: Record<ImplFormat, string> = {
  js: 'JavaScript',
  ts: 'TypeScript',
  css: 'CSS',
  tailwind: 'Tailwind',
};

export const IMPL_FORMAT_ORDER: ImplFormat[] = ['js', 'ts', 'css', 'tailwind'];

export interface ImplementationDoc {
  /** Lazy raw-source loaders; a missing css/tailwind key must have a notApplicable reason. */
  sources: Partial<Record<ImplFormat, () => Promise<string>>>;
  /** Shiki lang overrides (defaults: js/ts/tailwind → 'tsx', css → 'html'). */
  langs?: Partial<Record<ImplFormat, string>>;
  /** Short caveat rendered above the code for a format. */
  notes?: Partial<Record<ImplFormat, string>>;
  /** Why css/tailwind is intentionally absent (rendered instead of code). */
  notApplicable?: Partial<Record<'css' | 'tailwind', string>>;
}

export interface PropDef {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
}

export interface ExampleDef {
  title: string;
  description?: string;
  /** Live rendering of the example. */
  render: () => ReactNode;
  /** The code shown (and copied) for this example. */
  code: string;
}

export interface ComponentDoc {
  /** URL slug, e.g. "button". */
  id: string;
  /** Display name, e.g. "Button". */
  name: string;
  category: Category;
  /** One-sentence summary in FJ voice. */
  blurb: string;
  /** Extra search keywords. */
  keywords?: string[];
  /** Playground knobs (all values stay within FJ's sanctioned options). */
  controls: ControlDef[];
  /** Live preview driven by the playground values. */
  render: (values: ControlValues) => ReactNode;
  /**
   * Code snippet for the current playground values. When omitted, a snippet
   * is generated from the control values via jsxSnippet().
   */
  code?: (values: ControlValues) => string;
  /** Static import line shown in the usage section. */
  importLine: string;
  /** Additional fixed examples below the showcase. */
  examples?: ExampleDef[];
  props: PropDef[];
  /** Accessibility notes (rendered as a list). */
  a11y: string[];
  /**
   * Full implementation code per format (JS / TS / CSS / Tailwind).
   * Optional only while the catalog is being backfilled — see registry.test.
   */
  implementation?: ImplementationDoc;
  /** Effects: show a Replay button that remounts the preview. */
  replayable?: boolean;
}
