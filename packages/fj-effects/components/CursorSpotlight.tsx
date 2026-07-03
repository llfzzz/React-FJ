import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";
import type { PerformanceMode } from "../motion/types";

export interface CursorSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Spotlight diameter in px. @default 400 */
  size?: number;
  /** Spotlight color (FJ token or CSS color). @default var(--accent-soft) */
  color?: string;
  /** Opacity 0–1 at the center. @default 1 */
  intensity?: number;
  /** "lite" shrinks the light and lowers cost. @default "full" */
  performance?: PerformanceMode;
  /** Disable (no light). @default false */
  disabled?: boolean;
}

/**
 * Free Joy — CursorSpotlight (effect)
 * A soft light that follows the cursor across a container — great behind a grid
 * of feature cards. The light is a single pointer-transparent layer; content
 * sits above it. No light under reduced motion or when disabled.
 */
export function CursorSpotlight({
  children,
  size = 400,
  color = "var(--accent-soft)",
  intensity = 1,
  performance = "full",
  disabled = false,
  style,
  ...rest
}: CursorSpotlightProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ x: -9999, y: -9999 });
  const inactive = disabled || reduced;
  const diameter = performance === "lite" ? size * 0.6 : size;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (inactive) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: -9999, y: -9999 })}
      style={{ position: "relative", ...style }}
      {...rest}
    >
      {!inactive && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: intensity,
            background: `radial-gradient(${diameter}px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 65%)`,
            transition: "background 60ms linear",
          }}
        />
      )}
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}
