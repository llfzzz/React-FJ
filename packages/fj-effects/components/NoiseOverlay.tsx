import * as React from "react";

// A tiny inline SVG feTurbulence — static grain, no animation, ~0 cost.
const NOISE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
);

export interface NoiseOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Grain opacity 0–1. @default 0.04 */
  opacity?: number;
  /** CSS mix-blend-mode for the grain. @default "overlay" */
  blend?: React.CSSProperties["mixBlendMode"];
  /** Grain tile scale (px). @default 120 */
  scale?: number;
}

/**
 * Free Joy — NoiseOverlay (effect)
 * A fine, static film-grain overlay that adds tactile texture to flat surfaces.
 * Purely decorative and non-animated — no motion, no reduced-motion concern.
 * Keep opacity low so text stays crisp.
 */
export function NoiseOverlay({
  children,
  opacity = 0.04,
  blend = "overlay",
  scale = 120,
  style,
  ...rest
}: NoiseOverlayProps) {
  return (
    <div style={{ position: "relative", ...style }} {...rest}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity,
          mixBlendMode: blend,
          backgroundImage: `url("data:image/svg+xml,${NOISE_SVG}")`,
          backgroundSize: `${scale}px ${scale}px`,
        }}
      />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}
