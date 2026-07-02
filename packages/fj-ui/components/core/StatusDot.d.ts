import * as React from "react";

/**
 * Tiny status indicator dot with optional label and pulse ring.
 */
export interface StatusDotProps {
  /** Semantic tone, presence alias, or any CSS color. @default "neutral" */
  tone?: "success" | "warn" | "danger" | "info" | "neutral" | "accent" | "online" | "away" | "busy" | "offline" | string;
  /** Expanding pulse ring (respects reduced motion). @default false */
  pulse?: boolean;
  /** Dot diameter in px. @default 8 */
  size?: number;
  /** Text rendered next to the dot. */
  label?: React.ReactNode;
  /** 2px surface ring — for overlaying on avatars. @default false */
  ring?: boolean;
  style?: React.CSSProperties;
}
export declare function StatusDot(props: StatusDotProps): JSX.Element;
