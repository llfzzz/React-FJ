import * as React from "react";

/**
 * Primary call-to-action and secondary actions, pill-shaped.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default "primary" */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /** Control height. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Recolors the primary fill: a named accent or any CSS color. @default "coral" */
  accent?: "coral" | "sun" | "bloom" | string;
  /** Icon node rendered before the label. */
  iconLeft?: React.ReactNode;
  /** Icon node rendered after the label. */
  iconRight?: React.ReactNode;
  /** Shows a spinner and blocks interaction (aria-busy). @default false */
  loading?: boolean;
  /** Stretch to fill container width. @default false */
  full?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
