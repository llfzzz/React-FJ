import * as React from "react";
import { ensureKeyframes } from "../motion/keyframes";
import { useReducedMotion } from "../motion/useReducedMotion";
import type { PerformanceMode } from "../motion/types";

ensureKeyframes(
  "fj-sparkle",
  `@keyframes fj-sparkle {
    0%, 100% { opacity: 0; transform: scale(0.4); }
    50% { opacity: 1; transform: scale(1); }
  }`,
);

const MAX = 24; // hard cap on DOM nodes

// Module-level defaults: fresh array literals as prop defaults would change
// identity every render and re-randomize the useMemo'd particle layout.
const DEFAULT_SIZE_RANGE: [number, number] = [2, 5];
const DEFAULT_COLORS = ["var(--sun-400)", "var(--joy-400)", "var(--bloom-400)"];

export interface SparklesProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Particle count (capped at 24; "lite" halves it). @default 14 */
  count?: number;
  /** [min, max] particle size in px. @default [2, 5] */
  sizeRange?: [number, number];
  /** Particle colors (FJ tokens or CSS colors). @default sun/coral/bloom */
  colors?: string[];
  /** Speed multiplier (1 = default). @default 1 */
  speed?: number;
  /** "lite" halves the particle count. @default "full" */
  performance?: PerformanceMode;
  /** Disable (no particles). @default false */
  disabled?: boolean;
}

interface Spark {
  top: number;
  left: number;
  size: number;
  color: string;
  delay: number;
  dur: number;
}

/**
 * Free Joy — Sparkles (effect)
 * A capped scatter of gently twinkling particles behind hero content. DOM nodes
 * are hard-capped at 24 (fewer in "lite"); each is a small opacity/scale pulse.
 * Renders nothing under reduced motion or when disabled.
 */
export function Sparkles({
  children,
  count = 14,
  sizeRange = DEFAULT_SIZE_RANGE,
  colors = DEFAULT_COLORS,
  speed = 1,
  performance = "full",
  disabled = false,
  style,
  ...rest
}: SparklesProps) {
  const reduced = useReducedMotion();
  const n = Math.min(MAX, Math.max(0, performance === "lite" ? Math.floor(count / 2) : count));

  const sparks = React.useMemo<Spark[]>(() => {
    const [minS, maxS] = sizeRange;
    return Array.from({ length: n }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: minS + Math.random() * (maxS - minS),
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 3,
      dur: (2.4 + Math.random() * 2) / speed,
    }));
  }, [n, sizeRange, colors, speed]);

  const show = !disabled && !reduced;

  return (
    <div style={{ position: "relative", overflow: "hidden", ...style }} {...rest}>
      {show &&
        sparks.map((s, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: s.color,
              opacity: 0,
              animation: `fj-sparkle ${s.dur}s var(--ease-in-out) ${s.delay}s infinite`,
              pointerEvents: "none",
            }}
          />
        ))}
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}
