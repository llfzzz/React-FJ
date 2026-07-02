import * as React from "react";

/**
 * Static soft gradient glow behind a child element.
 */
export interface GlowProps {
  /** Gradient colors. @default coral→lilac */
  colors?: string[];
  /** Glow opacity 0–1. @default 0.35 */
  intensity?: number;
  /** Blur radius in px. @default 48 */
  blur?: number;
  /** How far the glow extends past the child, in px. @default 8 */
  spread?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Glow(props: GlowProps): JSX.Element;
