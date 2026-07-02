import * as React from "react";

/**
 * Card with a soft cursor-following highlight. Flagship/showcase cards only.
 */
export interface SpotlightCardProps {
  /** Spotlight diameter in px. @default 320 */
  size?: number;
  /** @default "var(--space-5)" */
  padding?: number | string;
  /** @default "var(--radius-lg)" */
  radius?: number | string;
  /** Hover lift + shadow like Card interactive. @default true */
  interactive?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function SpotlightCard(props: SpotlightCardProps): JSX.Element;
