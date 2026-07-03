import type * as React from "react";

/** FJ motion easing tokens (see tokens/motion.css). */
export type EasingToken = "out" | "in" | "in-out" | "emphasized" | "spring";

/** Resolve an easing token to its CSS variable. */
export function easeVar(easing: EasingToken): string {
  return `var(--ease-${easing})`;
}

/** How an effect decides when to play. */
export type TriggerMode = "mount" | "inview" | "hover" | "click" | "manual";

/** Performance profile: "lite" trades richness for lower GPU cost. */
export type PerformanceMode = "full" | "lite";

/** Props shared by every fj-effect. */
export interface BaseEffectProps {
  /** Animation duration in ms (per unit, where applicable). */
  duration?: number;
  /** Lead-in delay in ms. */
  delay?: number;
  /** FJ easing token. */
  easing?: EasingToken;
  /** Render children untouched — no effect, no wrappers' motion. */
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** Effects that can be triggered on mount / scroll / hover / click / manually. */
export interface TriggeredEffectProps extends BaseEffectProps {
  /** @default varies per effect */
  trigger?: TriggerMode;
  /** Play only once. @default true */
  once?: boolean;
  /** Controlled active state for trigger="manual". */
  active?: boolean;
}

/** Effects that loop, with a speed multiplier and performance profile. */
export interface LoopEffectProps extends BaseEffectProps {
  /** Keep looping. @default true */
  loop?: boolean;
  /** Speed multiplier (1 = default). Higher is faster. */
  speed?: number;
  /** "lite" reduces cost (fewer particles, less blur, no glare, …). @default "full" */
  performance?: PerformanceMode;
}
