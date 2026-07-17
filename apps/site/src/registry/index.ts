import type { ComponentDoc, Category } from './types';
import { CATEGORY_LABELS, CATEGORY_ORDER, isEffectCategory } from './types';
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

export function adjacentDocs(id: string): { prev?: ComponentDoc; next?: ComponentDoc } {
  const index = REGISTRY.findIndex((doc) => doc.id === id);
  if (index === -1) return {};
  return { prev: REGISTRY[index - 1], next: REGISTRY[index + 1] };
}

/** Categories that actually have documented components, in canonical order. */
export function presentCategories(): Category[] {
  const present = new Set(REGISTRY.map((doc) => doc.category));
  return CATEGORY_ORDER.filter((category) => present.has(category));
}

/** Every documented animation, in sidebar order — powers the /effects gallery. */
export function effectDocs(): ComponentDoc[] {
  return REGISTRY.filter((doc) => isEffectCategory(doc.category));
}

export { CATEGORY_LABELS };
