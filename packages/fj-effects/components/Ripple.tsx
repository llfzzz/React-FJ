import * as React from "react";
import { ensureKeyframes } from "../motion/keyframes";
import { useReducedMotion } from "../motion/useReducedMotion";

ensureKeyframes(
  "fj-ripple",
  `@keyframes fj-ripple {
    from { transform: scale(0); opacity: var(--fj-ripple-o, 0.25); }
    to { transform: scale(1); opacity: 0; }
  }`,
);

const CAP = 6; // hard cap on live ripples

export interface RippleProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  /** Ripple color. @default "currentColor" */
  color?: string;
  /** Peak ripple opacity 0–1. @default 0.25 */
  intensity?: number;
  /** Expand-and-fade duration in ms. @default 500 */
  duration?: number;
  /** Children unchanged, no ripple. @default false */
  disabled?: boolean;
}

interface RippleSpot {
  id: number;
  x: number;
  y: number;
  size: number;
}

/**
 * Free Joy — Ripple (effect)
 * A soft ripple expands from the pointer-down point across the wrapped control —
 * tactile press feedback for buttons and tiles. Live ripples are capped at 6
 * and auto-clean when the fade ends. No ripple ever spawns under reduced
 * motion; the child's own press state carries the feedback.
 */
export function Ripple({
  children,
  color = "currentColor",
  intensity = 0.25,
  duration = 500,
  disabled = false,
  style,
  ...rest
}: RippleProps) {
  const reduced = useReducedMotion();
  const [ripples, setRipples] = React.useState<RippleSpot[]>([]);
  const nextId = React.useRef(0);

  const onPointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (disabled || reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Diameter reaches the farthest corner, so the ripple always fills the box.
    const size = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y)) * 2;
    setRipples((rs) => [...rs.slice(-(CAP - 1)), { id: nextId.current++, x, y, size }]);
  };

  return (
    <span
      onPointerDown={onPointerDown}
      style={{ position: "relative", display: "inline-block", overflow: "hidden", borderRadius: "inherit", ...style }}
      {...rest}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: r.x - r.size / 2,
            top: r.y - r.size / 2,
            width: r.size,
            height: r.size,
            borderRadius: "50%",
            background: color,
            transform: "scale(0)",
            ["--fj-ripple-o" as string]: String(intensity),
            animation: `fj-ripple ${duration}ms var(--ease-out) forwards`,
            pointerEvents: "none",
          } as React.CSSProperties}
          onAnimationEnd={() => setRipples((rs) => rs.filter((p) => p.id !== r.id))}
        />
      ))}
    </span>
  );
}
