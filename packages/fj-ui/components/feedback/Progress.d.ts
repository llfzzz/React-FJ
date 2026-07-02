import * as React from "react";

/** Linear progress bar, determinate or indeterminate. */
export interface ProgressProps {
  /** Current value. @default 0 */
  value?: number;
  /** @default 100 */
  max?: number;
  /** Looping indeterminate animation. @default false */
  indeterminate?: boolean;
  /** Fill color. @default "coral" */
  accent?: "coral" | "sun" | "bloom" | string;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Show a % label. @default false */
  showLabel?: boolean;
  style?: React.CSSProperties;
}
export declare function Progress(props: ProgressProps): JSX.Element;
