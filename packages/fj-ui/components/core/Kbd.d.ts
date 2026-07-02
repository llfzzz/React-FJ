import * as React from "react";

/** Keyboard shortcut badge — mono keycap(s) with a hairline border. */
export interface KbdProps {
  /** Render each entry as its own keycap: ["⌘", "K"]. */
  keys?: React.ReactNode[];
  /** @default "md" */
  size?: "sm" | "md";
  style?: React.CSSProperties;
  /** Single-cap content when `keys` is not used, e.g. "⌘ K". */
  children?: React.ReactNode;
}
export declare function Kbd(props: KbdProps): JSX.Element;
