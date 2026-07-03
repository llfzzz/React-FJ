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

// Text effects
export { GradientText } from "./components/GradientText";
export type { GradientTextProps } from "./components/GradientText";
export { RotatingText } from "./components/RotatingText";
export type { RotatingTextProps } from "./components/RotatingText";
export { AnimatedUnderline } from "./components/AnimatedUnderline";
export type { AnimatedUnderlineProps } from "./components/AnimatedUnderline";
export { Highlighter } from "./components/Highlighter";
export type { HighlighterProps } from "./components/Highlighter";

// Surface effects
export { Shimmer } from "./components/Shimmer";
export type { ShimmerProps } from "./components/Shimmer";
export { Float } from "./components/Float";
export type { FloatProps } from "./components/Float";

// Interaction effects
export { Magnetic } from "./components/Magnetic";
export type { MagneticProps } from "./components/Magnetic";
export { TiltCard } from "./components/TiltCard";
export type { TiltCardProps } from "./components/TiltCard";
export { Tactile } from "./components/Tactile";
export type { TactileProps } from "./components/Tactile";
export { CursorSpotlight } from "./components/CursorSpotlight";
export type { CursorSpotlightProps } from "./components/CursorSpotlight";

// Status effects
export { SuccessCheck } from "./components/SuccessCheck";
export type { SuccessCheckProps } from "./components/SuccessCheck";
export { ErrorShake } from "./components/ErrorShake";
export type { ErrorShakeProps } from "./components/ErrorShake";
export { LoaderDots } from "./components/LoaderDots";
export type { LoaderDotsProps } from "./components/LoaderDots";
