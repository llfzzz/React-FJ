import * as React from "react";

/** Floating "scroll to top" button that appears after a scroll threshold. */
export interface BackToTopProps {
  /** Scroll distance (px) before it appears. @default 400 */
  offset?: number;
  /** Ref to a scroll container; defaults to the window. */
  scrollRef?: React.RefObject<HTMLElement>;
  /** Optional label beside the arrow. */
  label?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function BackToTop(props: BackToTopProps): JSX.Element;
