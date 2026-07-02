import * as React from "react";

/** Slide-in panel anchored to a screen edge, with scrim. */
export interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  /** @default "right" */
  side?: "left" | "right" | "top" | "bottom";
  /** Width (left/right) or height (top/bottom) in px. @default 380 */
  size?: number;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Drawer(props: DrawerProps): JSX.Element;
