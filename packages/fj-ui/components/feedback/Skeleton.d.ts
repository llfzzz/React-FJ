import * as React from "react";

/** Shimmering loading placeholder. */
export interface SkeletonProps {
  /** @default "text" */
  variant?: "text" | "circle" | "rect";
  width?: number | string;
  height?: number | string;
  /** Number of text lines (text variant). @default 1 */
  lines?: number;
  /** Corner radius (rect variant). */
  radius?: number | string;
  style?: React.CSSProperties;
}
export declare function Skeleton(props: SkeletonProps): JSX.Element;
