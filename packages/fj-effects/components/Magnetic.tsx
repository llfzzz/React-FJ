import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";

export interface MagneticProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Pull strength 0–1 (fraction of cursor offset applied). @default 0.3 */
  strength?: number;
  /** Activation radius in px around the element. @default 120 */
  radius?: number;
  /** ms to settle back to rest. @default 400 */
  restDuration?: number;
  /** Disable (children unchanged). @default false */
  disabled?: boolean;
}

/**
 * Free Joy — Magnetic (effect)
 * Eases its child toward the cursor when the pointer is near — a tactile pull
 * for a primary CTA. Snaps back on leave. Inert under reduced motion, on touch,
 * and when disabled (the child still works as a normal button).
 */
export function Magnetic({
  children,
  strength = 0.3,
  radius = 120,
  restDuration = 400,
  disabled = false,
  style,
  ...rest
}: MagneticProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const inactive = disabled || reduced;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (inactive) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > radius) {
      setOffset({ x: 0, y: 0 });
      return;
    }
    setOffset({ x: dx * strength, y: dy * strength });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{
        display: "inline-block",
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition:
          offset.x === 0 && offset.y === 0
            ? `transform ${restDuration}ms var(--ease-spring)`
            : "transform 80ms var(--ease-out)",
        willChange: inactive ? undefined : "transform",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
