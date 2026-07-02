import * as React from "react";

/**
 * Fade + rise on scroll into view; `cascade` staggers direct children.
 */
export interface RevealProps {
  /** Lead-in delay in ms. @default 0 */
  delay?: number;
  /** Rise distance in px. @default 14 */
  y?: number;
  /** @default 640 */
  duration?: number;
  /** Animate only on first entry. @default true */
  once?: boolean;
  /** Stagger direct children instead of moving as one block. @default false */
  cascade?: boolean;
  /** Per-child stagger in ms (with cascade). @default 60 */
  stagger?: number;
  /** IntersectionObserver threshold. @default 0.15 */
  threshold?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Reveal(props: RevealProps): JSX.Element;
