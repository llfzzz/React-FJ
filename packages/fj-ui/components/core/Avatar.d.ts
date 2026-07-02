import * as React from "react";

/** Circular user avatar — image with initials fallback. */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image URL. Falls back to initials when absent. */
  src?: string;
  /** Full name — used for initials and alt text. */
  name?: string;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
}
export declare function Avatar(props: AvatarProps): JSX.Element;
