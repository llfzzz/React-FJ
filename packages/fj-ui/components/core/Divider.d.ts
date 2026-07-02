import * as React from "react";

/** Hairline separator with optional centered label. */
export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  /** @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Centered uppercase mono label (horizontal only). */
  label?: React.ReactNode;
  /** Margin along the main axis, px. @default 0 */
  inset?: number;
}
export declare function Divider(props: DividerProps): JSX.Element;
