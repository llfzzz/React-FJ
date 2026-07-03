import * as React from "react";

export interface GridPatternProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Dots or lines. @default "dot" */
  type?: "dot" | "line";
  /** Cell size in px. @default 24 */
  size?: number;
  /** Pattern opacity 0–1. @default 0.5 */
  opacity?: number;
  /** Radial fade mask so edges dissolve. @default true */
  fade?: boolean;
  /** Line/dot color. @default var(--border) */
  color?: string;
}

/**
 * Free Joy — GridPattern (effect)
 * A subtle dot or line grid with an optional radial fade — a quiet, static
 * texture for hero and section backgrounds. No animation, so it's safe
 * anywhere and needs no reduced-motion handling.
 */
export function GridPattern({
  children,
  type = "dot",
  size = 24,
  opacity = 0.5,
  fade = true,
  color = "var(--border)",
  style,
  ...rest
}: GridPatternProps) {
  const image =
    type === "dot"
      ? `radial-gradient(${color} 1px, transparent 1px)`
      : `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`;
  const mask = fade ? "radial-gradient(ellipse at center, #000 40%, transparent 75%)" : undefined;

  return (
    <div style={{ position: "relative", ...style }} {...rest}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: image,
          backgroundSize: `${size}px ${size}px`,
          opacity,
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}
