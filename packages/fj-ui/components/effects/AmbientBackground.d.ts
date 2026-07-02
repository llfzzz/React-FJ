import * as React from "react";

/**
 * Slow-drifting ambient color washes behind hero/onboarding/empty-state
 * content. Never dense product UI.
 */
export interface AmbientBackgroundProps {
  /** Wash palette. @default "warm" */
  variant?: "warm" | "cool" | "joy";
  /** Drift animation on/off (reduced motion freezes it regardless). @default true */
  animate?: boolean;
  /** Wash strength 0–1. @default 0.14 */
  opacity?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function AmbientBackground(props: AmbientBackgroundProps): JSX.Element;
