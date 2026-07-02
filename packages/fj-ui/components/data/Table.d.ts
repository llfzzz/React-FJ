import * as React from "react";

export interface TableColumn {
  key: string;
  header: React.ReactNode;
  align?: "left" | "center" | "right";
  width?: number | string;
  /** Custom cell renderer. */
  render?: (value: any, row: any) => React.ReactNode;
}

/** Static data table. */
export interface TableProps {
  columns: TableColumn[];
  rows: Record<string, any>[];
  /** Alternating row tint. @default false */
  zebra?: boolean;
  /** Row hover highlight. @default true */
  hover?: boolean;
  /** Tighter cell padding. @default false */
  dense?: boolean;
  style?: React.CSSProperties;
}
export declare function Table(props: TableProps): JSX.Element;
