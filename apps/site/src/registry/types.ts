import type { ReactNode } from 'react';

/**
 * The site's two top-level modules — Components and Animation — each split
 * into a handful of broad categories. Animation categories carry an `anim-`
 * prefix so the two modules can never collide.
 */
export type ComponentCategory = 'inputs' | 'navigation' | 'content' | 'feedback';
export type AnimationCategory =
  | 'anim-entrance'
  | 'anim-text'
  | 'anim-interaction'
  | 'anim-ambient'
  | 'anim-transition'
  | 'anim-status';
export type Category = ComponentCategory | AnimationCategory;

export const CATEGORY_LABELS: Record<Category, string> = {
  inputs: 'Inputs & actions',
  navigation: 'Navigation',
  content: 'Content & data',
  feedback: 'Feedback & overlays',
  'anim-entrance': 'Entrance & scroll',
  'anim-text': 'Text',
  'anim-interaction': 'Interaction',
  'anim-ambient': 'Ambient & loop',
  'anim-transition': 'Transition',
  'anim-status': 'Status & feedback',
};

export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  'inputs',
  'navigation',
  'content',
  'feedback',
];

export const ANIMATION_CATEGORIES: AnimationCategory[] = [
  'anim-entrance',
  'anim-text',
  'anim-interaction',
  'anim-ambient',
  'anim-transition',
  'anim-status',
];

export const CATEGORY_ORDER: Category[] = [...COMPONENT_CATEGORIES, ...ANIMATION_CATEGORIES];

export function isEffectCategory(category: Category): category is AnimationCategory {
  return category.startsWith('anim-');
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
  /**
   * ISO date (YYYY-MM-DD) the item was documented — the canonical, explicit
   * value behind newest-first ordering on the animation index. Never inferred
   * from file mtimes or git at runtime. Required for animation docs (enforced
   * by registry tests); missing/invalid dates sort last with a dev warning.
   */
  addedAt?: string;
  /** ISO date of the last substantial revision, when one happened. */
  updatedAt?: string;
  /** Lifecycle badge shown on the animation index. Absent means stable. */
  status?: 'stable' | 'new' | 'updated' | 'experimental';
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
