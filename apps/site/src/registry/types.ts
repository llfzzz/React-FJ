import type { ReactNode } from 'react';

export type Category =
  | 'core'
  | 'layout'
  | 'forms'
  | 'feedback'
  | 'overlay'
  | 'navigation'
  | 'data'
  | 'effects-text'
  | 'effects-interaction'
  | 'effects-surfaces'
  | 'effects-backgrounds'
  | 'effects-status'
  | 'effects-motion';

export const CATEGORY_LABELS: Record<Category, string> = {
  core: 'Core',
  layout: 'Layout',
  forms: 'Forms',
  feedback: 'Feedback',
  overlay: 'Overlay',
  navigation: 'Navigation',
  data: 'Data',
  'effects-text': 'Text animations',
  'effects-interaction': 'Interaction',
  'effects-surfaces': 'Surfaces',
  'effects-backgrounds': 'Backgrounds',
  'effects-status': 'Status animations',
  'effects-motion': 'Animation & transitions',
};

export const CATEGORY_ORDER: Category[] = [
  'core',
  'layout',
  'forms',
  'feedback',
  'overlay',
  'navigation',
  'data',
  'effects-text',
  'effects-interaction',
  'effects-surfaces',
  'effects-backgrounds',
  'effects-status',
  'effects-motion',
];

/** Categories that make up the Animation section. */
export const EFFECT_CATEGORIES: Category[] = [
  'effects-text',
  'effects-interaction',
  'effects-surfaces',
  'effects-backgrounds',
  'effects-status',
  'effects-motion',
];

export function isEffectCategory(category: Category): boolean {
  return EFFECT_CATEGORIES.includes(category);
}

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

/**
 * The two axes of the implementation switcher. A language (JavaScript or
 * TypeScript) and a styling method (plain CSS or Tailwind) combine into one
 * complete, copy-ready implementation.
 */
export type ImplLanguage = 'js' | 'ts';
export type ImplStyling = 'css' | 'tailwind';
export type ImplVariantKey = `${ImplLanguage}-${ImplStyling}`;

export const IMPL_LANGUAGE_LABELS: Record<ImplLanguage, string> = {
  js: 'JavaScript',
  ts: 'TypeScript',
};

export const IMPL_STYLING_LABELS: Record<ImplStyling, string> = {
  css: 'CSS',
  tailwind: 'Tailwind CSS',
};

export const IMPL_LANGUAGE_ORDER: ImplLanguage[] = ['js', 'ts'];
export const IMPL_STYLING_ORDER: ImplStyling[] = ['css', 'tailwind'];

/** One displayed file of a variant (component module, stylesheet, …). */
export interface ImplFile {
  /** Display file name, e.g. "Button.tsx" or "Button.css". */
  name: string;
  /** Shiki grammar for highlighting. */
  lang: string;
  /** Lazy raw-source loader (its own on-demand chunk). */
  load: () => Promise<string>;
}

/** A complete implementation for one language + styling combination. */
export interface ImplVariant {
  /** Component file first; the shared stylesheet second (CSS styling only). */
  files: ImplFile[];
}

export interface ImplementationDoc {
  /** The four language × styling combinations (missing keys render a notice). */
  variants: Partial<Record<ImplVariantKey, ImplVariant>>;
  /** Short caveat rendered above the code for a styling method. */
  notes?: Partial<Record<ImplStyling, string>>;
  /**
   * Set when the component draws its visuals in JavaScript, so CSS and
   * Tailwind produce the identical source: the Style picker is inert and this
   * reason is shown next to it.
   */
  stylingNeutral?: string;
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
  /** Full implementation code per language × styling combination. */
  implementation: ImplementationDoc;
  /** Effects: show a Replay button that remounts the preview. */
  replayable?: boolean;
}
