import * as React from "react";
import { ensureKeyframes } from "../motion/keyframes";
import { useReducedMotion } from "../motion/useReducedMotion";

const KF = "fj-shimmer-sweep";
ensureKeyframes(
  KF,
  `@keyframes ${KF} { from { transform: translateX(-100%); } to { transform: translateX(100%); } }`,
);

export interface ShimmerProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  /** When the sheen plays. @default "loop" */
  trigger?: "loop" | "hover" | "mount";
  /** Sheen travel duration in ms. @default 1400 */
  duration?: number;
  /** Sweep angle in degrees. @default 20 */
  angle?: number;
  /** Sheen opacity 0–1. @default 0.35 */
  intensity?: number;
  /** Disable (children unchanged). @default false */
  disabled?: boolean;
}

/**
 * Free Joy — Shimmer (effect)
 * A soft light sheen sweeps across a surface — badges, skeleton chips, freshly
 * loaded cards. Wraps its children; the sheen is a pointer-transparent overlay.
 * Reduced motion suppresses the sweep.
 */
export function Shimmer({
  children,
  trigger = "loop",
  duration = 1400,
  angle = 20,
  intensity = 0.35,
  disabled = false,
  style,
  ...rest
}: ShimmerProps) {
  const reduced = useReducedMotion();
  const [hover, setHover] = React.useState(false);
  const play = !disabled && !reduced && (trigger === "loop" || trigger === "mount" || (trigger === "hover" && hover));

  return (
    <span
      onMouseEnter={() => trigger === "hover" && setHover(true)}
      onMouseLeave={() => trigger === "hover" && setHover(false)}
      style={{ position: "relative", display: "inline-block", overflow: "hidden", ...style }}
      {...rest}
    >
      {children}
      {!disabled && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `linear-gradient(${90 + angle}deg, transparent 20%, color-mix(in srgb, var(--white) ${Math.round(
              intensity * 100,
            )}%, transparent) 50%, transparent 80%)`,
            transform: "translateX(-100%)",
            animation: play ? `${KF} ${duration}ms var(--ease-in-out) ${trigger === "loop" ? "infinite" : "1"}` : "none",
          }}
        />
      )}
    </span>
  );
}
