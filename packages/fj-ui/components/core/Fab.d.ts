import * as React from "react";

/** Floating action button — round, or extended with a label. */
export interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon node (use `<Icon />`). */
  icon?: React.ReactNode;
  /** Optional label — makes it an extended FAB. */
  label?: React.ReactNode;
  /** @default "coral" */
  accent?: "coral" | "sun" | "bloom" | string;
  /** @default "md" */
  size?: "md" | "lg";
  /** Pin to a viewport corner. @default true */
  fixed?: boolean;
  /** @default "bottom-right" */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}
export declare function Fab(props: FabProps): JSX.Element;
