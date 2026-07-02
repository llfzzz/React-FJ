import * as React from "react";

/**
 * Hairline conic-gradient border slowly sweeping around a panel.
 * One flagship element per view, max.
 */
export interface AnimatedBorderProps {
  /** Seconds per revolution. @default 8 */
  speed?: number;
  /** Border thickness in px. @default 1 */
  width?: number;
  /** @default "var(--radius-lg)" */
  radius?: number | string;
  /** Gradient stops between hairline segments. @default coral→lilac→sun */
  colors?: string[];
  /** Inner panel padding. @default "var(--space-5)" */
  padding?: number | string;
  style?: React.CSSProperties;
  /** Styles for the inner surface panel. */
  contentStyle?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function AnimatedBorder(props: AnimatedBorderProps): JSX.Element;
