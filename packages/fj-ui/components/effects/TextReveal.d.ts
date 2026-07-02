import * as React from "react";

/**
 * Editorial headline reveal — words/characters rise in on scroll into view.
 * Showcase surfaces only (heroes, section titles, empty states).
 */
export interface TextRevealProps {
  text?: string;
  /** Split unit. @default "word" */
  by?: "word" | "char";
  /** Lead-in delay in ms. @default 0 */
  delay?: number;
  /** Per-unit stagger in ms. @default 45 */
  stagger?: number;
  /** Per-unit duration in ms. @default 640 */
  duration?: number;
  /** Animate only the first time it enters the viewport. @default true */
  once?: boolean;
  style?: React.CSSProperties;
}
export declare function TextReveal(props: TextRevealProps): JSX.Element;
