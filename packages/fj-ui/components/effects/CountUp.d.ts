import * as React from "react";

/**
 * Number that counts up when scrolled into view.
 */
export interface CountUpProps {
  value?: number;
  /** @default 1200 */
  duration?: number;
  /** @default 0 */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Thousands separator. @default "," */
  separator?: string;
  /** Animate only on first entry. @default true */
  once?: boolean;
  style?: React.CSSProperties;
}
export declare function CountUp(props: CountUpProps): JSX.Element;
