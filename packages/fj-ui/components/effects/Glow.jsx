import React from "react";

/**
 * Free Joy — Glow (effect)
 * Static soft gradient glow behind a child element — lifts a hero screenshot,
 * plan card, or CTA off the page. No animation, cheap single blur layer.
 */
export function Glow({
  colors = ["var(--joy-300)", "var(--bloom-300)"],
  intensity = 0.35,
  blur = 48,
  spread = 8,
  style,
  children,
  ...rest
}) {
  return (
    <div style={{ position: "relative", display: "inline-block", ...style }} {...rest}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: -spread,
          background: `linear-gradient(120deg, ${colors.join(", ")})`,
          filter: `blur(${blur}px)`,
          opacity: intensity,
          borderRadius: "var(--radius-xl)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}
