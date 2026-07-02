import * as React from "react";

/** Icon-only button. Pass an `<Icon />` as the child. */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default "ghost" */
  variant?: "ghost" | "solid" | "outline";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Solid-fill color. @default "coral" */
  accent?: "coral" | "sun" | "bloom" | string;
  /** Fully rounded vs. rounded-square. @default true */
  round?: boolean;
  children?: React.ReactNode;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
