import * as React from "react";

/** Copies text to the clipboard, with a brief confirmation state. */
export interface CopyButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** Text to copy. */
  value: string;
  /** @default "Copy" */
  label?: string;
  /** @default "Copied" */
  copiedLabel?: string;
  /** @default "sm" */
  size?: "sm" | "md";
}
export declare function CopyButton(props: CopyButtonProps): JSX.Element;
