import type { AnimationCategory, Category, ComponentCategory, ComponentDoc } from './types';
import {
  ANIMATION_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  COMPONENT_CATEGORIES,
  isEffectCategory,
} from './types';
import { buttonDoc } from './entries/button';
import { cardDoc } from './entries/card';
import { badgeDoc } from './entries/badge';
import { avatarDoc, iconButtonDoc, tagDoc } from './entries/core-more';
import {
  checkboxDoc,
  inputDoc,
  radioDoc,
  selectDoc,
  sliderDoc,
  switchDoc,
  textareaDoc,
} from './entries/forms';
import { segmentedControlDoc, tabsDoc } from './entries/navigation';
import {
  alertDoc,
  emptyStateDoc,
  progressDoc,
  skeletonDoc,
  spinnerDoc,
  toastDoc,
  tooltipDoc,
} from './entries/feedback';
import { drawerDoc, modalDoc } from './entries/overlay';
import { tableDoc } from './entries/data';
import {
  ambientBackgroundDoc,
  animatedBorderDoc,
  countUpDoc,
  glowDoc,
  revealDoc,
  spotlightCardDoc,
  textRevealDoc,
} from './entries/effects';
import {
  animatedUnderlineDoc,
  blurRevealDoc,
  gradientTextDoc,
  highlighterDoc,
  rotatingTextDoc,
  scrambleTextDoc,
  typewriterDoc,
  waveTextDoc,
} from './entries/effects-text';
import {
  cardStackDoc,
  flipCardDoc,
  floatDoc,
  imageZoomDoc,
  marqueeDoc,
  shimmerDoc,
} from './entries/effects-surfaces';
import {
  clickSparkDoc,
  cursorSpotlightDoc,
  dockDoc,
  magneticDoc,
  rippleDoc,
  tactileDoc,
  tiltCardDoc,
} from './entries/effects-interaction';
import {
  errorShakeDoc,
  loaderDotsDoc,
  numberTickerDoc,
  pingDotDoc,
  progressRingDoc,
  successCheckDoc,
} from './entries/effects-status';
import {
  auroraDoc,
  confettiBurstDoc,
  gridPatternDoc,
  noiseOverlayDoc,
  orbsDoc,
  sparklesDoc,
  wavesDoc,
} from './entries/effects-backgrounds';
import {
  collapseDoc,
  fadeSwitchDoc,
  reorderListDoc,
  scrollProgressDoc,
  staggerListDoc,
  themeTransitionDoc,
} from './entries/effects-motion';

/** Every documented component, in sidebar order. */
export const REGISTRY: ComponentDoc[] = sortByCategory([
  buttonDoc,
  iconButtonDoc,
  cardDoc,
  badgeDoc,
  tagDoc,
  avatarDoc,
  inputDoc,
  textareaDoc,
  selectDoc,
  checkboxDoc,
  radioDoc,
  switchDoc,
  sliderDoc,
  tabsDoc,
  segmentedControlDoc,
  alertDoc,
  tooltipDoc,
  toastDoc,
  progressDoc,
  spinnerDoc,
  skeletonDoc,
  emptyStateDoc,
  modalDoc,
  drawerDoc,
  tableDoc,
  textRevealDoc,
  revealDoc,
  countUpDoc,
  spotlightCardDoc,
  animatedBorderDoc,
  glowDoc,
  ambientBackgroundDoc,
  gradientTextDoc,
  rotatingTextDoc,
  animatedUnderlineDoc,
  highlighterDoc,
  typewriterDoc,
  scrambleTextDoc,
  blurRevealDoc,
  waveTextDoc,
  shimmerDoc,
  floatDoc,
  marqueeDoc,
  imageZoomDoc,
  flipCardDoc,
  cardStackDoc,
  magneticDoc,
  tiltCardDoc,
  tactileDoc,
  cursorSpotlightDoc,
  rippleDoc,
  clickSparkDoc,
  dockDoc,
  successCheckDoc,
  errorShakeDoc,
  loaderDotsDoc,
  progressRingDoc,
  pingDotDoc,
  numberTickerDoc,
  auroraDoc,
  gridPatternDoc,
  noiseOverlayDoc,
  sparklesDoc,
  confettiBurstDoc,
  orbsDoc,
  wavesDoc,
  staggerListDoc,
  scrollProgressDoc,
  fadeSwitchDoc,
  collapseDoc,
  themeTransitionDoc,
  reorderListDoc,
]);

function sortByCategory(docs: ComponentDoc[]): ComponentDoc[] {
  return [...docs].sort((a, b) => {
    const cat = CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
    return cat !== 0 ? cat : a.name.localeCompare(b.name);
  });
}

const byId = new Map(REGISTRY.map((doc) => [doc.id, doc]));

export function getComponentDoc(id: string): ComponentDoc | undefined {
  return byId.get(id);
}

/** The Components module: every documented UI component (not animations). */
export function componentDocs(): ComponentDoc[] {
  return REGISTRY.filter((doc) => !isEffectCategory(doc.category));
}

/** The Animation module: every documented animation, in sidebar order. */
export function effectDocs(): ComponentDoc[] {
  return REGISTRY.filter((doc) => isEffectCategory(doc.category));
}

/** The detail-page route for a doc — animations live under /animation. */
export function docPath(doc: ComponentDoc): string {
  return isEffectCategory(doc.category) ? `/animation/${doc.id}` : `/components/${doc.id}`;
}

/** Previous/next within the doc's own module — the pager never crosses modules. */
export function adjacentDocs(id: string): { prev?: ComponentDoc; next?: ComponentDoc } {
  const doc = byId.get(id);
  if (!doc) return {};
  const module = isEffectCategory(doc.category) ? effectDocs() : componentDocs();
  const index = module.findIndex((entry) => entry.id === id);
  return { prev: module[index - 1], next: module[index + 1] };
}

/** Component categories that actually have documented docs, in canonical order. */
export function presentCategories(): ComponentCategory[] {
  const present = new Set(componentDocs().map((doc) => doc.category));
  return COMPONENT_CATEGORIES.filter((category) => present.has(category));
}

/** Animation categories that actually have documented docs, in canonical order. */
export function presentAnimationCategories(): AnimationCategory[] {
  const present = new Set(effectDocs().map((doc) => doc.category));
  return ANIMATION_CATEGORIES.filter((category) => present.has(category));
}

/** Every category with at least one doc — component and animation, canonical order. */
export function presentIndexCategories(): Category[] {
  const present = new Set(REGISTRY.map((doc) => doc.category));
  return CATEGORY_ORDER.filter((category) => present.has(category));
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function hasValidAddedAt(doc: ComponentDoc): boolean {
  return Boolean(doc.addedAt && ISO_DATE.test(doc.addedAt));
}

/** Newest `addedAt` first, name as the stable tiebreaker; invalid dates last. */
function byNewestFirst(a: ComponentDoc, b: ComponentDoc): number {
  const aValid = hasValidAddedAt(a);
  const bValid = hasValidAddedAt(b);
  if (aValid !== bValid) return aValid ? -1 : 1;
  if (aValid && bValid && a.addedAt !== b.addedAt) {
    return a.addedAt! < b.addedAt! ? 1 : -1;
  }
  return a.name.localeCompare(b.name);
}

/**
 * The Index order: every documented item — components and animations alike —
 * newest `addedAt` first, name as the stable tiebreaker. The date is explicit
 * metadata on each doc, never inferred from file mtimes or git. Docs with a
 * missing/malformed date sort last and warn in development so the gap is caught
 * before it ships.
 */
export function indexDocs(): ComponentDoc[] {
  if (import.meta.env.DEV) {
    for (const doc of REGISTRY) {
      if (!hasValidAddedAt(doc)) {
        console.warn(`[registry] ${doc.id}: missing or invalid addedAt (${doc.addedAt ?? 'unset'}) — sorted last on the Index`);
      }
    }
  }
  return [...REGISTRY].sort(byNewestFirst);
}

export { CATEGORY_LABELS };
