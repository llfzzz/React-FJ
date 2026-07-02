import * as React from "react";

/** Centered, max-width content column with responsive side padding. */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max width preset. @default "lg" */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** Apply responsive horizontal padding. @default true */
  pad?: boolean;
  children?: React.ReactNode;
}
export declare function Container(props: ContainerProps): JSX.Element;
