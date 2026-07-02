import * as React from "react";

export interface SplitButtonMenuItem {
  label: React.ReactNode;
  onSelect?: () => void;
}

/** A primary action plus a caret opening a menu of secondary actions. */
export interface SplitButtonProps {
  /** Primary action label. */
  children?: React.ReactNode;
  /** Primary action handler. */
  onClick?: () => void;
  /** Secondary actions in the dropdown. */
  menu?: SplitButtonMenuItem[];
  /** @default "coral" */
  accent?: "coral" | "sun" | "bloom" | string;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
}
export declare function SplitButton(props: SplitButtonProps): JSX.Element;
