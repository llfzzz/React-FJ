import * as React from "react";
import { ensureKeyframes } from "../motion/keyframes";
import { useReducedMotion } from "../motion/useReducedMotion";

const KF = "fj-gradient-move";
ensureKeyframes(
  KF,
  `@keyframes ${KF} { to { background-position: 200% center; } }`,
);

export interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The text (or nodes) to paint with the moving gradient. */
  children?: React.ReactNode;
  /** Gradient color stops (FJ tokens or any CSS colors). @default coral→bloom→sun */
  colors?: string[];
  /** Seconds per loop. @default 6 */
  duration?: number;
  /** Gradient angle in degrees. @default 100 */
  angle?: number;
  /** Keep the gradient animating. @default true */
  loop?: boolean;
  /** Render plain text with no gradient. @default false */
  disabled?: boolean;
}

/**
 * Free Joy — GradientText (effect)
 * A word or heading painted with a slow-moving FJ gradient. Landing/hero
 * surfaces. Under reduced motion (or disabled) the gradient holds still.
 */
export function GradientText({
  children,
  colors = ["var(--joy-500)", "var(--bloom-500)", "var(--sun-500)"],
  duration = 6,
  angle = 100,
  loop = true,
  disabled = false,
  style,
  ...rest
}: GradientTextProps) {
  const reduced = useReducedMotion();
  if (disabled) {
    return (
      <span style={style} {...rest}>
        {children}
      </span>
    );
  }
  const animate = loop && !reduced;
  const stops = [...colors, colors[0]].join(", ");
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(${angle}deg, ${stops})`,
        backgroundSize: "200% auto",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        animation: animate ? `${KF} ${duration}s linear infinite` : "none",
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
