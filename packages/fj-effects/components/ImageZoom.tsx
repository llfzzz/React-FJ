import * as React from "react";
import { ensureKeyframes } from "../motion/keyframes";
import { useReducedMotion } from "../motion/useReducedMotion";

const KF = "fj-kenburns";
const MAX_SCALE = 1.15; // keep the zoom subtle — motion-policy cap

export interface ImageZoomProps extends React.HTMLAttributes<HTMLDivElement> {
  /** An <img>, picture, or any surface to zoom. */
  children?: React.ReactNode;
  /** "hover" zooms on hover; "drift" is a slow ken-burns loop. @default "hover" */
  mode?: "hover" | "drift";
  /** Zoom scale (capped at 1.15). @default 1.06 */
  scale?: number;
  /** Hover transition duration in ms. @default 600 */
  duration?: number;
  /** Drift-loop speed multiplier (base period 16s). @default 1 */
  speed?: number;
  /** Still image, no zoom. @default false */
  disabled?: boolean;
}

/**
 * Free Joy — ImageZoom (effect)
 * A gentle zoom inside a cropped frame — hover zoom for gallery cards, or a
 * slow ken-burns drift for hero imagery. The frame clips overflow, so nothing
 * shifts layout. Still under reduced motion or when disabled.
 */
export function ImageZoom({
  children,
  mode = "hover",
  scale = 1.06,
  duration = 600,
  speed = 1,
  disabled = false,
  style,
  ...rest
}: ImageZoomProps) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = React.useState(false);
  const effScale = Math.min(scale, MAX_SCALE);
  const name = `${KF}-${Math.round(effScale * 100)}`;

  React.useEffect(() => {
    if (mode !== "drift") return;
    ensureKeyframes(
      name,
      `@keyframes ${name} {
        from { transform: scale(1) translate(0, 0); }
        to { transform: scale(${effScale}) translate(-1.5%, 1%); }
      }`,
    );
  }, [mode, name, effScale]);

  const animate = !disabled && !reduced;
  const inner: React.CSSProperties =
    mode === "drift"
      ? {
          animation: animate ? `${name} ${16 / speed}s var(--ease-in-out) infinite alternate` : "none",
          willChange: animate ? "transform" : undefined,
        }
      : {
          transform: animate && hovered ? `scale(${effScale})` : "none",
          transition: animate ? `transform ${duration}ms var(--ease-out)` : "none",
          willChange: animate && hovered ? "transform" : undefined,
        };

  return (
    <div
      onMouseEnter={() => mode === "hover" && setHovered(true)}
      onMouseLeave={() => mode === "hover" && setHovered(false)}
      style={{ display: "block", overflow: "hidden", borderRadius: "inherit", ...style }}
      {...rest}
    >
      <div style={inner}>{children}</div>
    </div>
  );
}
