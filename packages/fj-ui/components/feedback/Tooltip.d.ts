import * as React from "react";

/**
 * Hover / focus tooltip bubble wrapping a single trigger.
 *
 * @startingPoint section="Feedback" subtitle="Hover label bubble" viewport="700x140"
 */
export interface TooltipProps {
  /** Text shown in the bubble. */
  label: React.ReactNode;
  /** @default "top" */
  placement?: "top" | "bottom" | "left" | "right";
  /** The trigger element. */
  children: React.ReactNode;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
