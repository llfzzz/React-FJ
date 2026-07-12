import * as React from "react";
import { ensureKeyframes } from "../motion/keyframes";
import { useReducedMotion } from "../motion/useReducedMotion";
import type { PerformanceMode } from "../motion/types";

ensureKeyframes(
  "fj-orb",
  `@keyframes fj-orb {
    0% { transform: translate3d(0, 0, 0); }
    33% { transform: translate3d(6%, -8%, 0); }
    66% { transform: translate3d(-5%, 6%, 0); }
    100% { transform: translate3d(0, 0, 0); }
  }`,
);

const MAX = 6; // hard cap on orbs

export interface OrbsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Orb count (capped at 6; "lite" caps at 3). @default 3 */
  count?: number;
  /** Orb colors (FJ tokens or CSS colors). @default joy/bloom/sun */
  colors?: string[];
  /** Base orb diameter in px (±30% variance). @default 240 */
  size?: number;
  /** Speed multiplier (1 = default). @default 1 */
  speed?: number;
  /** Orb opacity 0–1. @default 0.5 */
  opacity?: number;
  /** Blur radius in px ("lite" caps at 24). @default 40 */
  blur?: number;
  /** "lite" caps the count at 3 and the blur at 24. @default "full" */
  performance?: PerformanceMode;
  /** Static wash, no drift. @default false */
  disabled?: boolean;
}

interface Orb {
  top: number;
  left: number;
  size: number;
  color: string;
  dur: number;
  delay: number;
}

/**
 * Free Joy — Orbs (effect)
 * Soft gradient blobs drifting slowly behind hero content — a rounder, calmer
 * cousin of Aurora. Only transform animates; blur is static and capped in
 * "lite". Under reduced motion the orbs stay rendered but still (the wash
 * remains, the drift stops).
 */
export function Orbs({
  children,
  count = 3,
  colors = ["var(--joy-300)", "var(--bloom-300)", "var(--sun-300)"],
  size = 240,
  speed = 1,
  opacity = 0.5,
  blur = 40,
  performance = "full",
  disabled = false,
  style,
  ...rest
}: OrbsProps) {
  const reduced = useReducedMotion();
  const n = Math.min(performance === "lite" ? 3 : MAX, Math.max(0, count));
  const effBlur = performance === "lite" ? Math.min(blur, 24) : blur;
  const animate = !disabled && !reduced;

  const orbs = React.useMemo<Orb[]>(
    () =>
      Array.from({ length: n }, (_, i) => ({
        top: 15 + Math.random() * 70,
        left: 10 + Math.random() * 80,
        size: size * (0.7 + Math.random() * 0.6),
        color: colors[i % colors.length],
        dur: (18 + Math.random() * 12) / speed,
        delay: -Math.random() * 20,
      })),
    [n, size, colors, speed],
  );

  return (
    <div style={{ position: "relative", overflow: "hidden", ...style }} {...rest}>
      {orbs.map((o, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: `${o.top}%`,
            left: `${o.left}%`,
            width: o.size,
            height: o.size,
            marginTop: -o.size / 2,
            marginLeft: -o.size / 2,
            borderRadius: "50%",
            background: `radial-gradient(closest-side, ${o.color}, transparent)`,
            filter: `blur(${effBlur}px)`,
            opacity,
            animation: animate ? `fj-orb ${o.dur}s var(--ease-in-out) ${o.delay}s infinite` : "none",
            willChange: animate ? "transform" : undefined,
            pointerEvents: "none",
          }}
        />
      ))}
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}
