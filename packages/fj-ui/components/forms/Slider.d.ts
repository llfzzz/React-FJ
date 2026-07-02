import * as React from "react";

/** Single-thumb range slider with a filled track. */
export interface SliderProps {
  /** Controlled value. */
  value?: number;
  /** Uncontrolled initial value. @default 50 */
  defaultValue?: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  onChange?: (value: number) => void;
  /** Fill + thumb color. @default "coral" */
  accent?: "coral" | "sun" | "bloom" | string;
  /** Show the numeric value beside the track. @default false */
  showValue?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Slider(props: SliderProps): JSX.Element;
