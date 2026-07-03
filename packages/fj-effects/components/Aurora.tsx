import * as React from "react";
import { ensureKeyframes } from "../motion/keyframes";
import { useReducedMotion } from "../motion/useReducedMotion";
import type { PerformanceMode } from "../motion/types";

ensureKeyframes(
  "fj-aurora",
  `@keyframes fj-aurora {
    0% { transform: translate3d(-10%, 0, 0) rotate(0deg); }
    50% { transform: translate3d(10%, 4%, 0) rotate(8deg); }
    100% { transform: translate3d(-10%, 0, 0) rotate(0deg); }
  }`,
);

const VARIANTS: Record<string, [string, string, string]> = {
  warm: ["var(--joy-400)", "var(--sun-300)", "var(--bloom-300)"],
  cool: ["var(--bloom-400)", "var(--info-300)", "var(--joy-300)"],
  joy: ["var(--joy-500)", "var(--joy-300)", "var(--sun-300)"],
};

export interface AuroraProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Ribbon palette. @default "warm" */
  variant?: "warm" | "cool" | "joy";
  /** Speed multiplier (1 = default). @default 1 */
  speed?: number;
  /** Ribbon opacity 0–1. @default 0.5 */
  opacity?: number;
  /** Blur radius in px. @default 60 */
  blur?: number;
  /** "lite" lowers blur and simplifies motion. @default "full" */
  performance?: PerformanceMode;
  /** Disable animation (static wash). @default false */
  disabled?: boolean;
}

/**
 * Free Joy — Aurora (effect)
 * Slow, soft aurora ribbons behind hero content. Heroes and section headers
 * only. Blur is capped and only transform/opacity animate. Static under reduced
 * motion (the wash stays).
 */
export function Aurora({
  children,
  variant = "warm",
  speed = 1,
  opacity = 0.5,
  blur = 60,
  performance = "full",
  disabled = false,
  style,
  ...rest
}: AuroraProps) {
  const reduced = useReducedMotion();
  const [c1, c2, c3] = VARIANTS[variant] || VARIANTS.warm;
  const animate = !disabled && !reduced;
  const effBlur = performance === "lite" ? Math.min(blur, 40) : blur;
  const base = 24 / speed;

  const ribbon = (color: string, top: string, rot: number, dur: number): React.CSSProperties => ({
    position: "absolute",
    top,
    left: "-20%",
    width: "140%",
    height: "60%",
    borderRadius: "50%",
    background: `radial-gradient(closest-side, ${color}, transparent)`,
    filter: `blur(${effBlur}px)`,
    opacity,
    transform: `rotate(${rot}deg)`,
    animation: animate ? `fj-aurora ${dur}s var(--ease-in-out) infinite` : "none",
    willChange: animate ? "transform" : undefined,
    pointerEvents: "none",
  });

  return (
    <div style={{ position: "relative", overflow: "hidden", background: "var(--bg)", ...style }} {...rest}>
      <div aria-hidden="true" style={ribbon(c1, "-15%", -6, base)} />
      <div aria-hidden="true" style={ribbon(c2, "10%", 10, base * 1.25)} />
      <div aria-hidden="true" style={ribbon(c3, "35%", -3, base * 1.1)} />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}
