import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";
import type { PerformanceMode } from "../motion/types";

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Max tilt in degrees at the corners. @default 10 */
  maxTilt?: number;
  /** CSS perspective in px. @default 800 */
  perspective?: number;
  /** Show a soft glare that tracks the cursor. @default true */
  glare?: boolean;
  /** Scale on hover. @default 1.02 */
  scale?: number;
  /** ms to settle flat on leave. @default 400 */
  resetDuration?: number;
  /** "lite" drops the glare layer. @default "full" */
  performance?: PerformanceMode;
  /** Disable (children unchanged). @default false */
  disabled?: boolean;
}

/**
 * Free Joy — TiltCard (effect)
 * A card that tilts in 3D toward the cursor, with an optional soft glare. For
 * flagship/showcase cards only. Flat and still under reduced motion or disabled.
 */
export function TiltCard({
  children,
  maxTilt = 10,
  perspective = 800,
  glare = true,
  scale = 1.02,
  resetDuration = 400,
  performance = "full",
  disabled = false,
  style,
  ...rest
}: TiltCardProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = React.useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const [hover, setHover] = React.useState(false);
  const inactive = disabled || reduced;
  const showGlare = glare && performance === "full" && !inactive;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (inactive) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({
      rx: (0.5 - py) * maxTilt * 2,
      ry: (px - 0.5) * maxTilt * 2,
      gx: px * 100,
      gy: py * 100,
    });
  };

  const reset = () => {
    setHover(false);
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  const transform = inactive
    ? undefined
    : `perspective(${perspective}px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hover ? scale : 1})`;

  return (
    <div
      ref={ref}
      onMouseEnter={() => !inactive && setHover(true)}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{
        position: "relative",
        transformStyle: "preserve-3d",
        transform,
        transition: hover ? "transform 80ms var(--ease-out)" : `transform ${resetDuration}ms var(--ease-out)`,
        willChange: inactive ? undefined : "transform",
        ...style,
      }}
      {...rest}
    >
      {children}
      {showGlare && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            borderRadius: "inherit",
            background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, color-mix(in srgb, var(--white) 35%, transparent), transparent 60%)`,
            opacity: hover ? 1 : 0,
            transition: "opacity var(--dur-base) var(--ease-out)",
          }}
        />
      )}
    </div>
  );
}
