import React from "react";

const KEYFRAMES = `
@property --fj-angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
@keyframes fjAngleSpin { to { --fj-angle: 360deg; } }
`;

/**
 * Free Joy — AnimatedBorder (effect)
 * Hairline conic-gradient border that slowly sweeps around the panel.
 * Reserve for ONE flagship element per view (a hero card, a highlighted plan).
 * Falls back to a static gradient border where @property or motion is
 * unavailable (the global reduced-motion rule freezes the sweep).
 */
export function AnimatedBorder({
  speed = 8,
  width = 1,
  radius = "var(--radius-lg)",
  colors = ["var(--joy-400)", "var(--bloom-300)", "var(--sun-300)"],
  padding = "var(--space-5)",
  style,
  contentStyle,
  children,
  ...rest
}) {
  const stops = colors.join(", ");
  return (
    <div
      style={{
        position: "relative",
        borderRadius: radius,
        padding: width,
        background: `conic-gradient(from var(--fj-angle, 0deg), var(--border) 0%, ${stops}, var(--border) 100%)`,
        animation: `fjAngleSpin ${speed}s linear infinite`,
        ...style,
      }}
      {...rest}
    >
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <div
        style={{
          position: "relative",
          background: "var(--surface)",
          borderRadius: `calc(${typeof radius === "number" ? radius + "px" : radius} - ${width}px)`,
          padding,
          ...contentStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
