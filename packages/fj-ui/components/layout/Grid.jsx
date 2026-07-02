import React from "react";

/**
 * Free Joy — Grid
 * Responsive CSS grid. Fixed column count, or auto-fill from a min column width.
 */
export function Grid({ cols = 12, min, gap = 20, style, children, ...rest }) {
  const template = min
    ? `repeat(auto-fill, minmax(${min}px, 1fr))`
    : `repeat(${cols}, minmax(0, 1fr))`;
  return (
    <div style={{ display: "grid", gridTemplateColumns: template, gap, ...style }} {...rest}>
      {children}
    </div>
  );
}
