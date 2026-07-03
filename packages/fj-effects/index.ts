/**
 * Free Joy — Effects & Motion (fj-effects)
 *
 * A LOCAL package (not synced from upstream fj-ui) of reusable, configurable
 * animation and visual-effect components, built on FJ design tokens. Consumed
 * via the `@fj-effects` alias, mirroring how the site consumes `@fj`.
 *
 * Every effect:
 * - uses FJ tokens for color / spacing / radius / shadow / motion,
 * - animates transform/opacity only (no layout shift),
 * - respects prefers-reduced-motion with an explicit static fallback,
 * - renders children untouched when `disabled`.
 *
 * See /docs/effects-guide for the motion, performance, and accessibility policy.
 */

// Motion primitives
export { useReducedMotion } from "./motion/useReducedMotion";
export { useInView } from "./motion/useInView";
export type { UseInViewOptions, UseInViewResult } from "./motion/useInView";
export { useTrigger } from "./motion/useTrigger";
export type { UseTriggerOptions, UseTriggerResult } from "./motion/useTrigger";
export { ensureKeyframes } from "./motion/keyframes";
export { easeVar } from "./motion/types";
export type {
  EasingToken,
  TriggerMode,
  PerformanceMode,
  BaseEffectProps,
  TriggeredEffectProps,
  LoopEffectProps,
} from "./motion/types";

// Components are added in the effects batches (B2).
