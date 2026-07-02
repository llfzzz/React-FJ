import * as React from "react";

/**
 * Product-app scaffold: sunken sticky sidebar + frosted sticky topbar + content.
 */
export interface AppShellProps {
  /** Sidebar content (hidden below `breakpoint`). */
  sidebar?: React.ReactNode;
  /** Sticky frosted top bar content. */
  topbar?: React.ReactNode;
  /** @default 264 */
  sidebarWidth?: number;
  /** Max width of the main column. @default "var(--container)" */
  contentMaxWidth?: number | string;
  /** Apply default content padding. @default true */
  padded?: boolean;
  /** Viewport width (px) below which the sidebar hides. @default 900 */
  breakpoint?: number;
  style?: React.CSSProperties;
  /** Main content. */
  children?: React.ReactNode;
}
export declare function AppShell(props: AppShellProps): JSX.Element;
