import * as React from "react";
import { ensureKeyframes } from "../motion/keyframes";
import { useReducedMotion } from "../motion/useReducedMotion";

ensureKeyframes(
  "fj-loader-dots",
  `@keyframes fj-loader-dots {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }`,
);

export interface LoaderDotsProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Dot diameter in px. @default 8 */
  size?: number;
  /** Gap between dots in px. @default 6 */
  gap?: number;
  /** Dot color. @default var(--accent) */
  color?: string;
  /** Speed multiplier (1 = default). Higher is faster. @default 1 */
  speed?: number;
  /** Accessible label. @default "Loading" */
  label?: string;
}

/**
 * Free Joy — LoaderDots (effect)
 * Three dots that pulse in sequence — a calmer, more playful loader than the
 * spinner for inline "working…" states. Under reduced motion the dots hold at
 * a steady mid-opacity instead of pulsing.
 */
export function LoaderDots({ size = 8, gap = 6, color = "var(--accent)", speed = 1, label = "Loading", style, ...rest }: LoaderDotsProps) {
  const reduced = useReducedMotion();
  const dur = 1400 / speed;
  return (
    <span role="status" aria-label={label} style={{ display: "inline-flex", alignItems: "center", gap, ...style }} {...rest}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: color,
            opacity: reduced ? 0.7 : undefined,
            animation: reduced ? "none" : `fj-loader-dots ${dur}ms var(--ease-in-out) ${(i * dur) / 6}ms infinite`,
          }}
        />
      ))}
    </span>
  );
}
