import * as React from "react";
import { ensureKeyframes } from "../motion/keyframes";
import { useReducedMotion } from "../motion/useReducedMotion";

const KF = "fj-float";

export interface FloatProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Vertical travel in px (kept small). @default 8 */
  distance?: number;
  /** Seconds per loop. @default 4 */
  duration?: number;
  /** Lead-in delay in seconds. @default 0 */
  delay?: number;
  /** Degrees of gentle rotation at the extremes. @default 0 */
  rotate?: number;
  /** Disable (static). @default false */
  disabled?: boolean;
}

/**
 * Free Joy — Float (effect)
 * Gentle levitation loop for illustrations, empty-state art, and hero props.
 * Travel is capped small (≤ a few px). Static under reduced motion or disabled.
 */
export function Float({
  children,
  distance = 8,
  duration = 4,
  delay = 0,
  rotate = 0,
  disabled = false,
  style,
  ...rest
}: FloatProps) {
  const reduced = useReducedMotion();
  const name = `${KF}-${distance}-${rotate}`;

  React.useEffect(() => {
    ensureKeyframes(
      name,
      `@keyframes ${name} {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-${distance}px) rotate(${rotate}deg); }
      }`,
    );
  }, [name, distance, rotate]);

  const animate = !disabled && !reduced;
  return (
    <div
      style={{
        display: "inline-block",
        animation: animate ? `${name} ${duration}s var(--ease-in-out) ${delay}s infinite` : "none",
        willChange: animate ? "transform" : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
