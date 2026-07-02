import * as React from "react";

/** Responsive CSS grid — fixed columns, or auto-fill from a min column width. */
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fixed column count (ignored when `min` is set). @default 12 */
  cols?: number;
  /** Min column width in px — switches to auto-fill responsive mode. */
  min?: number;
  /** Gap between cells, px. @default 20 */
  gap?: number;
  children?: React.ReactNode;
}
export declare function Grid(props: GridProps): JSX.Element;
