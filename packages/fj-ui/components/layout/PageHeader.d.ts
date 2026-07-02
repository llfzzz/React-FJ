import * as React from "react";

/**
 * Editorial page/section opener with title, description and actions.
 */
export interface PageHeaderProps {
  /** Uppercase mono kicker above the title. */
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned action buttons. */
  actions?: React.ReactNode;
  /** Breadcrumb node rendered above everything. */
  breadcrumb?: React.ReactNode;
  /** Hairline under the header. @default true */
  divider?: boolean;
  style?: React.CSSProperties;
}
export declare function PageHeader(props: PageHeaderProps): JSX.Element;
