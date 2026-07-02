import * as React from "react";

/**
 * Slim control row for tables and list views.
 */
export interface ToolbarProps {
  /** Leading controls (search, filters). */
  start?: React.ReactNode;
  /** Trailing controls, pushed right (bulk actions, view toggles). */
  end?: React.ReactNode;
  /** Stick to the top with a frosted background. @default false */
  sticky?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Toolbar(props: ToolbarProps): JSX.Element;
